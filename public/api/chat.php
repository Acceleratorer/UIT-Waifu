<?php
declare(strict_types=1);

const MAX_CHAT_MESSAGES = 50;
const MAX_CHAT_CONTENT_CHARS = 12000;
const MAX_CHAT_REQUEST_BYTES = 750000;
const CHAT_RATE_LIMIT_REQUESTS = 30;
const CHAT_RATE_LIMIT_WINDOW_SECONDS = 60;
const DEFAULT_ANTHROPIC_MODEL = 'claude-haiku-4-5';
const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
const ANTHROPIC_VERSION = '2023-06-01';
const CONTENT_SECURITY_POLICY_REPORT_ONLY = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.anthropic.com https://openrouter.ai https://*.supabase.co wss://*.supabase.co; worker-src 'self' blob:; manifest-src 'self'; media-src 'self'";

function security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: SAMEORIGIN');
    header('Cross-Origin-Opener-Policy: same-origin');
    header('Cross-Origin-Resource-Policy: same-origin');
    header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
    header('Content-Security-Policy-Report-Only: ' . CONTENT_SECURITY_POLICY_REPORT_ONLY);

    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        header('Strict-Transport-Security: max-age=15552000');
    }
}

function json_error_response(int $status, string $code, string $message, array $details = [])
{
    http_response_code($status);
    security_headers();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => [
            'code' => $code,
            'message' => $message,
            'details' => $details,
        ],
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

function client_rate_limit_key(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return hash('sha256', $ip);
}

function enforce_chat_rate_limit(): void
{
    $dir = dirname(__DIR__, 3) . '/tmp/uit-waifu-rate-limit';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        return;
    }

    $file = $dir . '/' . client_rate_limit_key() . '.json';
    $now = time();
    $windowStart = $now - CHAT_RATE_LIMIT_WINDOW_SECONDS;
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        return;
    }

    $locked = false;
    try {
        if (!flock($handle, LOCK_EX)) {
            return;
        }
        $locked = true;

        $raw = stream_get_contents($handle);
        $timestamps = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
        if (!is_array($timestamps)) {
            $timestamps = [];
        }

        $timestamps = array_values(array_filter($timestamps, static function ($value) use ($windowStart): bool {
            return is_int($value) && $value >= $windowStart;
        }));

        if (count($timestamps) >= CHAT_RATE_LIMIT_REQUESTS) {
            $retryAfter = max(1, CHAT_RATE_LIMIT_WINDOW_SECONDS - ($now - min($timestamps)));
            header('Retry-After: ' . $retryAfter);
            json_error_response(429, 'rate_limited', 'Too many chat requests. Please wait and try again.');
        }

        $timestamps[] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($timestamps));
    } finally {
        if ($locked) {
            flock($handle, LOCK_UN);
        }
        fclose($handle);
    }
}

function normalized_host(?string $host): string
{
    if (!is_string($host) || trim($host) === '') {
        return '';
    }

    return strtolower(preg_replace('/:\d+$/', '', trim($host)) ?? '');
}

function url_host(?string $value): string
{
    if (!is_string($value) || trim($value) === '') {
        return '';
    }

    $host = parse_url($value, PHP_URL_HOST);
    return is_string($host) ? normalized_host($host) : '';
}

function enforce_same_origin_request(): void
{
    $requestHost = normalized_host($_SERVER['HTTP_HOST'] ?? '');
    if ($requestHost === '') {
        json_error_response(403, 'forbidden', 'Invalid request host.');
    }

    $originHost = url_host($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($originHost !== '' && $originHost !== $requestHost) {
        json_error_response(403, 'forbidden', 'Cross-origin chat requests are not allowed.');
    }

    $refererHost = url_host($_SERVER['HTTP_REFERER'] ?? '');
    if ($originHost === '' && $refererHost !== '' && $refererHost !== $requestHost) {
        json_error_response(403, 'forbidden', 'Cross-origin chat requests are not allowed.');
    }
}

function enforce_json_content_type(): void
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    if (!is_string($contentType)) {
        $contentType = '';
    }

    $mediaType = strtolower(trim(explode(';', $contentType)[0] ?? ''));
    if ($mediaType !== 'application/json') {
        json_error_response(415, 'unsupported_media', 'Chat requests must use application/json.');
    }
}

function read_private_config(): array
{
    $configPath = dirname(__DIR__, 3) . '/.uit-waifu.env.php';
    if (!is_file($configPath)) {
        return [];
    }

    $rawConfig = file_get_contents($configPath);
    if (!is_string($rawConfig)) {
        return [];
    }

    $trimmedConfig = ltrim($rawConfig, "\xEF\xBB\xBF \t\r\n");
    if (strpos($trimmedConfig, '<?php') === 0) {
        $config = require $configPath;
    } else {
        $config = json_decode($rawConfig, true);
    }

    if (!is_array($config)) {
        return [];
    }

    if (isset($config['env']) && is_array($config['env'])) {
        $config = array_merge($config, $config['env']);
    }

    if (
        isset($config['model']) &&
        is_string($config['model']) &&
        !isset($config['ANTHROPIC_MODEL'])
    ) {
        $config['ANTHROPIC_MODEL'] = $config['model'];
    }

    return $config;
}

function config_value(array $config, string $key): string
{
    $envValue = getenv($key);
    if (is_string($envValue) && $envValue !== '') {
        return $envValue;
    }

    $lowerKey = strtolower($key);
    $value = $config[$key] ?? $config[$lowerKey] ?? '';
    return is_string($value) ? $value : '';
}

function anthropic_key(array $config): string
{
    $apiKey = config_value($config, 'ANTHROPIC_API_KEY');
    if ($apiKey !== '') {
        return $apiKey;
    }

    return config_value($config, 'ANTHROPIC_AUTH_TOKEN');
}

function anthropic_model(array $config): string
{
    $model = trim(config_value($config, 'ANTHROPIC_MODEL'));
    if ($model === 'opus') {
        $opusModel = config_value($config, 'ANTHROPIC_DEFAULT_OPUS_MODEL');
        return $opusModel !== '' ? $opusModel : $model;
    }

    if ($model === 'sonnet') {
        $sonnetModel = config_value($config, 'ANTHROPIC_DEFAULT_SONNET_MODEL');
        return $sonnetModel !== '' ? $sonnetModel : $model;
    }

    if ($model === 'haiku') {
        $haikuModel = config_value($config, 'ANTHROPIC_DEFAULT_HAIKU_MODEL');
        return $haikuModel !== '' ? $haikuModel : $model;
    }

    if ($model !== '') {
        return $model;
    }

    $haikuModel = config_value($config, 'ANTHROPIC_DEFAULT_HAIKU_MODEL');
    return $haikuModel !== '' ? $haikuModel : DEFAULT_ANTHROPIC_MODEL;
}

function anthropic_messages_url(array $config): string
{
    $baseUrl = rtrim(config_value($config, 'ANTHROPIC_BASE_URL'), '/');
    if ($baseUrl === '') {
        $baseUrl = DEFAULT_ANTHROPIC_BASE_URL;
    }

    return str_ends_with($baseUrl, '/v1') ? $baseUrl . '/messages' : $baseUrl . '/v1/messages';
}

function compose_system_prompt(string $mode): string
{
    $basePersonality = <<<'PROMPT'
You are UIT Waifu, a friendly AI companion for students at the University of Information Technology.
You help with studying, programming, documents, schedules, and university life.
You are warm, supportive, practical, and clear.
You can be playful, but usefulness and accuracy come first.
You support Vietnamese and English. Match the user's language.
You explain with examples when helpful.
You avoid pretending to know official university information without sources.
PROMPT;

    $safetyFooter = <<<'PROMPT'
Stay accurate. If unsure, say so.
Do not present official university policy, deadlines, or grades as fact unless they come from provided sources.
Clearly mark anything you are uncertain about.
Refuse harmful, unsafe, or academically dishonest requests (for example, writing an exam answer to be submitted as the student's own).
PROMPT;

    $modeTemplates = [
        'general' => '',
        'study' => <<<'PROMPT'
You are in study tutor mode.
Explain concepts step by step, starting from what the student likely already knows.
Give a hint before revealing a full solution, then ask if they want the rest.
Use concrete examples. Generate a short practice question when it helps.
When asked to summarize a lesson, extract key ideas, formulas or definitions, common traps, and a short self-check quiz.
Keep explanations grounded; do not invent facts.
PROMPT,
        'code' => <<<'PROMPT'
You are in code assistant mode.
When debugging, identify the root cause before suggesting a fix.
Explain compiler and runtime errors in plain language.
Format all code in fenced blocks with the correct language tag.
For SQL, note correctness and obvious performance issues.
When refactoring, preserve behavior unless the user explicitly asks for a redesign.
State the time complexity when relevant.
Do not rewrite working code unless asked.
PROMPT,
        'document' => <<<'PROMPT'
You are in document question-answering mode.
Answer ONLY from the provided document context below.
If the answer is not in the context, say so plainly and do not guess.
Cite the source snippet you used.
PROMPT,
        'revision' => <<<'PROMPT'
You are in exam revision mode.
Turn course material into concise summaries, flashcards, quizzes, and likely weak spots.
Ask what exam, topic, or deadline the student is preparing for when it is unclear.
Quiz one question at a time when the student asks to practice.
Explain why an answer is right or wrong, then give a small follow-up drill.
Do not claim exact exam coverage unless the user provides official material.
PROMPT,
        'project' => <<<'PROMPT'
You are in project planning mode.
Break goals into a clear, ordered roadmap with milestones and rough timelines.
Ask about deadlines, scope, and current progress before planning when they are unknown.
Suggest concrete next steps the student can start today.
Keep plans realistic; do not overcommit or invent constraints.
PROMPT,
        'companion' => <<<'PROMPT'
You are in companion mode.
Keep things light, warm, and encouraging, with a bit more personality.
Be a supportive study buddy: check in, motivate, and keep replies short and friendly.
Stay honest and accurate; usefulness comes before play.
PROMPT,
    ];

    $parts = [$basePersonality];
    if (($modeTemplates[$mode] ?? '') !== '') {
        $parts[] = $modeTemplates[$mode];
    }
    $parts[] = $safetyFooter;

    return implode("\n\n", $parts);
}

function read_chat_request(): array
{
    $rawBody = file_get_contents('php://input');
    if (!is_string($rawBody) || $rawBody === '') {
        json_error_response(400, 'validation_error', 'Invalid JSON body.');
    }

    if (strlen($rawBody) > MAX_CHAT_REQUEST_BYTES) {
        json_error_response(413, 'payload_too_large', 'Chat request is too large.');
    }

    $body = json_decode($rawBody, true);
    if (!is_array($body)) {
        json_error_response(400, 'validation_error', 'Invalid JSON body.');
    }

    $mode = $body['mode'] ?? null;
    $allowedModes = ['general', 'study', 'code', 'document', 'revision', 'project', 'companion'];
    if (!is_string($mode) || !in_array($mode, $allowedModes, true)) {
        json_error_response(400, 'validation_error', 'Invalid chat request.', [
            ['path' => 'mode', 'message' => 'Unknown assistant mode.'],
        ]);
    }

    $messages = $body['messages'] ?? null;
    if (!is_array($messages) || count($messages) < 1 || count($messages) > MAX_CHAT_MESSAGES) {
        json_error_response(400, 'validation_error', 'Invalid chat request.', [
            ['path' => 'messages', 'message' => 'Message count is outside the allowed range.'],
        ]);
    }

    $validatedMessages = [];
    foreach ($messages as $index => $message) {
        if (!is_array($message)) {
            json_error_response(400, 'validation_error', 'Invalid chat request.', [
                ['path' => "messages.$index", 'message' => 'Message must be an object.'],
            ]);
        }

        $role = $message['role'] ?? null;
        $content = $message['content'] ?? null;
        if (!is_string($role) || !in_array($role, ['user', 'assistant'], true)) {
            json_error_response(400, 'validation_error', 'Invalid chat request.', [
                ['path' => "messages.$index.role", 'message' => 'Unsupported message role.'],
            ]);
        }

        if (!is_string($content) || trim($content) === '' || strlen($content) > MAX_CHAT_CONTENT_CHARS) {
            json_error_response(400, 'validation_error', 'Invalid chat request.', [
                ['path' => "messages.$index.content", 'message' => 'Message content is invalid.'],
            ]);
        }

        $validatedMessages[] = ['role' => $role, 'content' => $content];
    }

    return ['mode' => $mode, 'messages' => $validatedMessages];
}

function call_anthropic(string $url, string $apiKey, string $model, string $mode, array $messages): string
{
    if (!function_exists('curl_init')) {
        json_error_response(500, 'internal_error', 'Chat is not configured. PHP cURL is unavailable.');
    }

    $payload = [
        'model' => $model !== '' ? $model : DEFAULT_ANTHROPIC_MODEL,
        'max_tokens' => 1024,
        'stream' => false,
        'system' => compose_system_prompt($mode),
        'messages' => $messages,
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_HTTPHEADER => [
            'x-api-key: ' . $apiKey,
            'anthropic-version: ' . ANTHROPIC_VERSION,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES),
    ]);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (!is_string($response)) {
        json_error_response(500, 'internal_error', $curlError !== '' ? $curlError : 'Could not reach the chat provider.');
    }

    if ($status < 200 || $status >= 300) {
        $message = $status === 401 || $status === 403
            ? 'Chat is temporarily unavailable. Provider authentication failed.'
            : "Chat provider returned an error ($status).";
        json_error_response(500, 'internal_error', $message);
    }

    $decoded = json_decode($response, true);
    if (!is_array($decoded) || !isset($decoded['content']) || !is_array($decoded['content'])) {
        json_error_response(500, 'internal_error', 'Chat provider returned an invalid response.');
    }

    $text = '';
    foreach ($decoded['content'] as $part) {
        if (is_array($part) && ($part['type'] ?? '') === 'text' && is_string($part['text'] ?? null)) {
            $text .= $part['text'];
        }
    }

    if ($text === '') {
        json_error_response(500, 'internal_error', 'Chat provider returned an empty response.');
    }

    return $text;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    security_headers();
    header('Allow: POST, OPTIONS');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST, OPTIONS');
    json_error_response(405, 'method_not_allowed', 'Method not allowed.');
}

enforce_same_origin_request();
enforce_json_content_type();
enforce_chat_rate_limit();
$privateConfig = read_private_config();
$apiKey = anthropic_key($privateConfig);
if ($apiKey === '') {
    json_error_response(500, 'internal_error', 'Chat is not configured. Missing Anthropic API key or auth token.');
}

$model = anthropic_model($privateConfig);
$url = anthropic_messages_url($privateConfig);
$request = read_chat_request();
$reply = call_anthropic($url, $apiKey, $model, $request['mode'], $request['messages']);

header('Content-Type: text/event-stream; charset=utf-8');
security_headers();
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');
echo 'data: ' . json_encode(['type' => 'delta', 'delta' => $reply], JSON_UNESCAPED_SLASHES) . "\n\n";
echo 'data: ' . json_encode(['type' => 'done'], JSON_UNESCAPED_SLASHES) . "\n\n";

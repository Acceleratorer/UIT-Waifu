<?php
declare(strict_types=1);

const MAX_CHAT_MESSAGES = 50;
const MAX_CHAT_CONTENT_CHARS = 12000;
const DEFAULT_ANTHROPIC_MODEL = 'claude-haiku-4-5';
const ANTHROPIC_VERSION = '2023-06-01';

function json_error_response(int $status, string $code, string $message, array $details = [])
{
    http_response_code($status);
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

function read_private_config(): array
{
    $configPath = dirname(__DIR__, 3) . '/.uit-waifu.env.php';
    if (!is_file($configPath)) {
        return [];
    }

    $config = require $configPath;
    return is_array($config) ? $config : [];
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
Keep explanations grounded; do not invent facts.
PROMPT,
        'code' => <<<'PROMPT'
You are in code assistant mode.
When debugging, identify the root cause before suggesting a fix.
Explain compiler and runtime errors in plain language.
Format all code in fenced blocks with the correct language tag.
For SQL, note correctness and obvious performance issues.
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
You are in study tutor mode.
Explain concepts step by step, starting from what the student likely already knows.
Give a hint before revealing a full solution, then ask if they want the rest.
Use concrete examples. Generate a short practice question when it helps.
Keep explanations grounded; do not invent facts.
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

function call_anthropic(string $apiKey, string $model, string $mode, array $messages): string
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

    $ch = curl_init('https://api.anthropic.com/v1/messages');
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
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error_response(405, 'method_not_allowed', 'Method not allowed.');
}

$privateConfig = read_private_config();
$apiKey = config_value($privateConfig, 'ANTHROPIC_API_KEY');
if ($apiKey === '') {
    json_error_response(500, 'internal_error', 'Chat is not configured. Missing Anthropic API key.');
}

$model = config_value($privateConfig, 'ANTHROPIC_MODEL');
$request = read_chat_request();
$reply = call_anthropic($apiKey, $model, $request['mode'], $request['messages']);

header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');
echo 'data: ' . json_encode(['delta' => $reply], JSON_UNESCAPED_SLASHES) . "\n\n";
echo "data: [DONE]\n\n";

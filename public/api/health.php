<?php
declare(strict_types=1);

const CONTENT_SECURITY_POLICY_REPORT_ONLY = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.anthropic.com https://openrouter.ai https://*.supabase.co wss://*.supabase.co; worker-src 'self' blob:; manifest-src 'self'; media-src 'self'";

function security_headers(): void
{
    header_remove('X-Powered-By');
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

http_response_code(200);
security_headers();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

echo json_encode([
    'status' => 'ok',
    'version' => '0.1.0',
    'time' => (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s.v\Z'),
], JSON_UNESCAPED_SLASHES);

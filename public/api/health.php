<?php
declare(strict_types=1);

function security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: SAMEORIGIN');
    header('Cross-Origin-Opener-Policy: same-origin');
    header('Cross-Origin-Resource-Policy: same-origin');
    header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');

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

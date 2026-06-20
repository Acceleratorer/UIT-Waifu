<?php
declare(strict_types=1);

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

echo json_encode([
    'status' => 'ok',
    'version' => '0.1.0',
    'time' => (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s.v\Z'),
], JSON_UNESCAPED_SLASHES);

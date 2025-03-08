<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

require __DIR__.'/vendor/autoload.php';

$app = new Application(
    $_ENV['APP_ENV'] ?? 'production',
    $_ENV['APP_DEBUG'] ?? false
);

$request = Request::capture();

$response = $app->handle($request);
$response->send();

$app->terminate($request, $response);
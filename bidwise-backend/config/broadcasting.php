<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    */

    'default' => env('BROADCAST_DRIVER', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    */

    'connections' => [
        'reverb' => [
            'driver' => 'reverb',
            'key' => env('REVERB_APP_KEY', 'bidwise-key'),
            'secret' => env('REVERB_APP_SECRET', 'bidwise-secret'),
            'app_id' => env('REVERB_APP_ID', 'bidwise'),
            'options' => [
                'host' => env('REVERB_HOST', '127.0.0.1'),
                'port' => env('REVERB_PORT', 6001),
                'scheme' => env('REVERB_SCHEME', 'http'),
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],
    ],
]; 
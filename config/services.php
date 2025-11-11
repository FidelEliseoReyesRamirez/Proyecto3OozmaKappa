<?php

return [

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // ===========================
    // AUTODESK APS CONFIG
    // ===========================
    'aps' => [
        'client_id' => env('APS_CLIENT_ID'),
        'client_secret' => env('APS_CLIENT_SECRET'),
        'bucket' => env('APS_BUCKET'),
        'base_url' => env('APS_BASE_URL'),
    ],

];

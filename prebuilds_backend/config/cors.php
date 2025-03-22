<?php

return [
    'paths' => [ 'api/*', 'sanctum/csrf-cookie' ],
    'allowed_methods' => [ '*' ],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://192.168.11.101',
        'http://192.168.11.106:5173',
        'http://192.168.11.101:4173',
        'http://192.168.197.1:4173',
        'http://192.168.11.101:5173',
        'http://192.168.197.1:5173',
        'http://192.168.44.1:5173'
        
    ],
    'allowed_headers' => [ '*' ],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];


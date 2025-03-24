<?php

return [
    'paths' => [ 'api/*', 'sanctum/csrf-cookie' ],
    'allowed_methods' => [ '*' ],
    'allowed_origins' => [
        'http://localhost:5173',
        'https://prebuilds.shop',
        'http://localhost:4173'
  
        
    ],
    'allowed_headers' => [ '*' ],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];


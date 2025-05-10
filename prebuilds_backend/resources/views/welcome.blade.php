<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Index</title>
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" href="{{asset('PreBuilds_Logo.png')}}" type="image/png">

        
        <style>
            /* Custom styles if needed */
        </style>
    </head>
    <body class="font-sans antialiased dark:bg-black dark:text-white/50">
        <div class="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50 min-h-screen flex flex-col items-center justify-center">
            <img id="background" class="absolute -left-20 top-0 " src="{{asset('Sky_Background.jpg')}}" alt="Laravel background" />

            <div class="relative w-full max-w-2xl px-6 lg:max-w-7xl text-center">
                <h1 class="text-3xl font-bold text-black dark:text-white mb-6">API Endpoints</h1>
                
                <p class="text-lg mb-4">Welcome to the API index. Click on a link to explore the resources.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="{{ url('/api/categories') }}" class="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">Categories</a>
                    <a href="{{ url('/api/subcategories') }}" class="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">Subcategories</a>
                    <a href="{{ url('/api/users') }}" class="block bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition">Users</a>
                    <a href="{{ url('/api/products') }}" class="block bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition">Products</a>
                    <a href="{{ url('/api/shopping_cart') }}" class="block bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">Shopping Cart</a>
                    <a href="{{ url('/api/globalsettings') }}" class="block bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition">Global Settings</a>
                    
                    <!-- Newly added API routes -->
                    <a href="{{ url('/api/getSessionData') }}" class="block bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">Session Data</a>
                    <a href="{{ url('/api/NavBarCategories') }}" class="block bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition">Navbar Categories</a>
                    <a href="{{ url('/api/NewestProducts') }}" class="block bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition">Newest Products</a>
                    <a href="{{ url('/api/orders') }}" class="block bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition">Orders</a>
                </div>
            </div>
        </div>
    </body>
</html>

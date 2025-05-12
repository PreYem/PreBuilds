<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\SubCategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\GlobalSettingsController;
use App\Http\Controllers\OrdersController;
use Illuminate\Support\Facades\Route;





Route::apiResource('categories', CategoriesController::class); // Listing and managing categories

Route::apiResource('subcategories', SubCategoriesController::class); // Listing and managing categories

Route::apiResource('users', UsersController::class); // Listing and managing users

Route::apiResource('shopping_cart', ShoppingCartController::class); // Listing and managing shopping cart

Route::apiResource('global_settings', GlobalSettingsController::class); // Listing and managing global settings

Route::apiResource('products', ProductsController::class); // Listing and managing Products

Route::apiResource('orders', OrdersController::class); // Listing and managing Orders
 





Route::get('/getSessionData', [UsersController::class, 'getSessionData']); // Listing currently logged in user on the server side

Route::post('/logout', [UsersController::class, 'logout']); // Logging user out by reseting sessions

Route::post('/login', [UsersController::class, 'login']); // Logging user in and starting sessions

Route::get('/NavBarCategories', [CategoriesController::class, 'NavBarCategories']); // Listing categories that appear on the navbar on the frontend

Route::get('/dynaminicProducts/{catsub}', [ProductsController::class, 'NavBarFetching']); // dynamic product fetching depending on category/subcategory

Route::get('/NewestProducts', [ProductsController::class, 'newProductsFetching']); // fetching newest products depending on the global setting variable

Route::get('/searchBar/{keyWord}', [ProductsController::class, 'SearchBar']); // fetching products from a search bar

Route::get('/cartItemCount', [ShoppingCartController::class, 'cartItemCount']); // fetching number of items in user's cart to display

Route::get('/clearCart', [ShoppingCartController::class, 'clearCart']); // fetching number of items in user's cart to display
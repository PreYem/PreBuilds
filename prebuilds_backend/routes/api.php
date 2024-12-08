<?php

use App\Http\Controllers\categoriesController;
use Illuminate\Support\Facades\Route;





Route::apiResource('categories', CategoriesController::class);


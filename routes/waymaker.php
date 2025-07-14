<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'show'])->name('HomeController.show');
Route::get('/home/test123', [\App\Http\Controllers\HomeController::class, 'test123'])->name('HomeController.test123');

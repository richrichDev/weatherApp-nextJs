<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\weathernowAPI;
use App\Http\Controllers\loginAPI;
use App\Http\Controllers\saveplaceAPI;
use App\Http\Controllers\setunitAPI;
use App\Http\Controllers\deleteplaceAPI;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get("nowdata", [weathernowAPI::class, 'getNowWeather']);

Route::get("loginapi", [loginAPI::class, 'login']);
Route::get("registerapi", [loginAPI::class, 'registerAcc']);

Route::get("saveplace", [saveplaceAPI::class, 'savePlace']);

Route::get("setunit", [setunitAPI::class, 'setUnit']);

Route::get("deleteplace", [deleteplaceAPI::class, 'deleteplace']);
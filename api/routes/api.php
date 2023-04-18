<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetRequestController;

use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ValuerController;


;

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
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router)
    {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/all-users', [AuthController::class, 'allUsers']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register-accesor', [AuthController::class, 'registerAccesor']);
    
    Route::post('/invite-tenant', [AuthController::class, 'inviteTenant']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/owner-details', [AuthController::class, 'userDetails']);
    });
    Route::group([
        'middleware' => 'api',
        'prefix' => 'commons'
    ], function ($router)
        {
        Route::get('/get-accesors-list', [CommonController::class, 'getAccesorsList']);
        Route::get('/get-accesors-users-list/{accesor}', [CommonController::class, 'getAccesorsUsersList']);
        Route::get('/get-uploaders-list', [CommonController::class, 'getUploadersList']);
        Route::get('/get-uploaders-users-list/{uploader}', [CommonController::class, 'getUploadersUsersList']);
        });
        Route::group([
            'middleware' => 'api',
            'prefix' => 'admin'
        ], function ($router)
            {
            Route::post('/add-role', [AdminController::class, 'addRoles']);
            Route::get('/get-all-roles', [AdminController::class, 'getAllRoles']);
            Route::get('/get-all-permissions', [AdminController::class, 'getAllPermissions']);
            Route::post('/add-permissions', [AdminController::class, 'addPermissions']);
            Route::post('/assign-role-permissions', [AdminController::class, 'assignRolePermissions']);
            Route::get('/get-role-permissions', [AdminController::class, 'getRolePermissions']);
            

            
            });
            Route::group([
                'middleware' => 'api',
                'prefix' => 'uploader'
            ], function ($router)
                {
                Route::post('/upload-report', [ValuerController::class, 'uploadReport']);
                });

            
    
Route::post('/reset-password-request', [PasswordResetRequestController::class, 'sendPasswordResetEmail']);
Route::post('/change-password', [ChangePasswordController::class, 'passwordResetProcess']);


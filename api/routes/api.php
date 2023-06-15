<?php
use App\Http\Controllers\AccesorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\PaymentController;
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
], function ($router) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/all-users', [AuthController::class, 'allUsers']);
    Route::post('/register', [AuthController::class, 'register']);   
    Route::post('/register-accesor-user', [AuthController::class, 'registerAccesorUser']);
    
    Route::post('/register-accesor', [AuthController::class, 'registerAccesor']);
    Route::post('/invite-tenant', [AuthController::class, 'inviteTenant']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);
    Route::get('/user-information', [AuthController::class, 'userProfileDetails']);

    Route::get('/retrieve-valuer-invite-details', [AuthController::class, 'retrieveValuerInviteDetails']);
    Route::get('/retrieve-valuer-user-invite-details', [AuthController::class, 'retrieveValuerUserInviteDetails']);
    Route::get('/retrieve-accessor-user-invite-details', [AuthController::class, 'retrieveAccesorUserInviteDetails']);   
    Route::get('/retrieve-accessor-invite-details', [AuthController::class, 'retrieveAccesorInviteDetails']);
    

});
Route::group([
    'middleware' => 'api',
    'prefix' => 'commons'
], function ($router) {
    Route::get('/get-accesors-list', [CommonController::class, 'getAccesorsList']);
    Route::get('/get-accesors-users-list/{accesor}', [CommonController::class, 'getAccesorsUsersList']);
    Route::get('/get-uploaders-list', [CommonController::class, 'getUploadersList']);
    Route::get('/get-uploaders-users-list/{uploader}', [CommonController::class, 'getUploadersUsersList']);
    Route::get('/get-reports-list', [CommonController::class, 'getReportsList']);
    Route::get('/downloadvaluationreport/{id}/{signed}', [CommonController::class, 'downloadValuationReport']);
    Route::get('/get-all-users', [CommonController::class, 'getAllUsers']);
    
    
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'admin'
], function ($router) {
    Route::post('/add-role', [AdminController::class, 'addRoles']);
    Route::patch('/update-role/{id}', [AdminController::class, 'updateRole']);
    Route::delete('/delete-role/{id}', [AdminController::class, 'deleteRole']);
    Route::get('/get-all-roles', [AdminController::class, 'getAllRoles']);
    Route::get('/get-all-permissions', [AdminController::class, 'getAllPermissions']);
    Route::post('/add-permissions', [AdminController::class, 'addPermissions']);
    Route::post('/assign-role-permissions', [AdminController::class, 'assignRolePermissions']);
    Route::post('/send-valuation-firm-invite', [AdminController::class, 'sendValuationFirmInvite']);
    Route::post('/send-accesor-invite', [AdminController::class, 'sendAccesorInvite']);

    
    
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'uploader'
], function ($router) {
    Route::post('/upload-report', [ValuerController::class, 'uploadReport']);
    Route::post('/upload-valuation-report', [ValuerController::class, 'uploadReport']);
    Route::get('/addimage', [ValuerController::class, 'writeToPDF']);
    Route::get('/generate-qr-report', [ValuerController::class, 'generateQRCode']);
    Route::get('/retrieve-valuer-org-details', [ValuerController::class, 'retriveValuerOrgDetails']);
    Route::get('/get-dashboard', [ValuerController::class, 'ValuerDashboardSummary']);    
    Route::post('/update-personal-information', [ValuerController::class, 'updatePersonalInfromation']);
    Route::post('/update-company-information', [ValuerController::class, 'updateCompanyInfromation']);
    Route::post('/send-user-invite', [ValuerController::class, 'sendUserInvite']);
    Route::post('/block-user', [ValuerController::class, 'blockUser']);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'accesor'
], function ($router) {    
    Route::get('/retrieve-accesor-org-details', [AccesorController::class, 'retriveAccesorOrgDetails']);
    Route::post('/update-personal-information', [AccesorController::class, 'updatePersonalInfromation']);
    Route::post('/update-company-information', [AccesorController::class, 'updateCompanyInfromation']);
    Route::get('/get-dashboard', [AccesorController::class, 'AccesorDashboardSummary']);   
    Route::post('/send-user-invite', [AccesorController::class, 'sendUserInvite']);
});

Route::post('/reset-password-request', [PasswordResetRequestController::class, 'sendPasswordResetEmail']);
Route::post('/change-password', [ChangePasswordController::class, 'passwordResetProcess']);
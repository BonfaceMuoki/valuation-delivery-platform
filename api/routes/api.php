<?php
use App\Http\Controllers\AccesorController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\ValuerController;
use Illuminate\Support\Facades\Route;

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
    'prefix' => 'auth',
], function ($router) {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'SendAccountPasswordResetLink']);

    Route::post('/reset-password', [AuthController::class, 'ResetPassword']);

    Route::get('/all-users', [AuthController::class, 'allUsers']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register-accesor-user', [AuthController::class, 'registerAccesorUser']);

    Route::post('/request-valuer-access', [AuthController::class, 'requestValuerAccess']);
    Route::post('/request-accesor-access', [AuthController::class, 'requestAccesorAccess']);

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
    Route::get('/verify-reset-token', [AuthController::class, 'verifyResetToken']);

});
Route::group([
    'middleware' => 'api',
    'prefix' => 'commons',
], function ($router) {
    Route::get('/get-accesors-list', [CommonController::class, 'getAccesorsList']);
    Route::get('/get-accesors-users-list/{accesor}', [CommonController::class, 'getAccesorsUsersList']);
    Route::get('/get-uploaders-list', [CommonController::class, 'getUploadersList']);
    Route::get('/get-uploaders-users-list/{uploader}', [CommonController::class, 'getUploadersUsersList']);
    Route::get('/get-reports-list', [CommonController::class, 'getReportsList']);
    Route::get('/downloadvaluationreport/{id}/{signed}', [CommonController::class, 'downloadValuationReport']);
    Route::get('/get-all-users', [CommonController::class, 'getAllUsers']);
    Route::get('/get-all-propertytypes', [CommonController::class, 'getAllProprtyTypes']);
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'admin',
], function ($router) {
    Route::post('/add-role', [AdminController::class, 'addRoles']);
    Route::patch('/update-role/{id}', [AdminController::class, 'updateRole']);
    Route::post('/update-role-permission', [AdminController::class, 'updateRolePermission']);

    Route::delete('/delete-role/{id}', [AdminController::class, 'deleteRole']);
    Route::get('/get-all-roles', [AdminController::class, 'getAllRoles']);
    Route::get('/get-all-permissions', [AdminController::class, 'getAllPermissions']);
    Route::get('/get-role-permissions', [AdminController::class, 'getRolePermissions']);

    Route::post('/add-permissions', [AdminController::class, 'addPermissions']);
    Route::post('/update-permission', [AdminController::class, 'updatePermission']);

    Route::delete('/delete-permission/{permission}', [AdminController::class, 'deletePermission']);

    Route::post('/assign-role-permissions', [AdminController::class, 'assignRolePermissions']);
    Route::post('/send-valuation-firm-invite', [AdminController::class, 'sendValuationFirmInvite']);
    Route::post('/send-accesor-invite', [AdminController::class, 'sendAccesorInvite']);
    Route::get('/get-dashboard', [AdminController::class, 'getDashboard']);
    Route::get('/get-valuation-access-requests', [AdminController::class, 'getValuationAccessRequests']);
    Route::get('/get-accesor-access-requests', [AdminController::class, 'getAccesorAccessRequests']);
    Route::post('/accept-valuation-access-request', [AdminController::class, 'acceptValuationAccessRequest']);
    Route::post('/reject-valuation-access-request', [AdminController::class, 'rejectValuationAccessRequest']);
    Route::post('/archive-valuer-registration-request', [AdminController::class, 'archiveValuationAccessRequest']);
    Route::get('/get-Valuer-request-registration-status', [AdminController::class, 'getValuerRequestRegistrationStatus']);
    Route::get('/get-accesor-access-requests', [AdminController::class, 'getAccesorAccessRequests']);
    Route::post('/accept-accesor-access-request', [AdminController::class, 'acceptAccesorAccessRequest']);
    Route::post('/reject-accesor-access-request', [AdminController::class, 'rejectAccesorAccessRequest']);
    Route::post('/archive-accesor-registration-request', [AdminController::class, 'archiveAccesorAccessRequest']);
    Route::get('/get-accesor-request-registration-status', [AdminController::class, 'getAccesorRequestRegistrationStatus']);
});
Route::group([
    'middleware' => 'api',
    'prefix' => 'uploader',
], function ($router) {
    Route::post('/upload-report', [ValuerController::class, 'uploadReport']);
    Route::post('/upload-valuation-report', [ValuerController::class, 'uploadReport']);
    Route::post('/upload-cached-report-document', [ValuerController::class, 'uploadCachedReportDoc']);
    Route::get('/get-current-uploaded-file', [ValuerController::class, 'getCurrentUploadedFile']);
    Route::get('/donwload-cached-image', [ValuerController::class, 'donwloadCachedImage']);
    Route::post('/upload-valuation-report-v2', [ValuerController::class, 'uploadReportV2']);
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
    'prefix' => 'accesor',
], function ($router) {
    Route::get('/retrieve-accesor-org-details', [AccesorController::class, 'retriveAccesorOrgDetails']);
    Route::post('/update-personal-information', [AccesorController::class, 'updatePersonalInfromation']);
    Route::post('/update-company-information', [AccesorController::class, 'updateCompanyInfromation']);
    Route::get('/get-dashboard', [AccesorController::class, 'AccesorDashboardSummary']);
    Route::post('/send-user-invite', [AccesorController::class, 'sendUserInvite']);
});
Route::post('/reset-password-request', [PasswordResetRequestController::class, 'sendPasswordResetEmail']);
Route::post('/change-password', [ChangePasswordController::class, 'passwordResetProcess']);

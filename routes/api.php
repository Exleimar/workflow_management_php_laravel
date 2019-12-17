<?php

use Illuminate\Http\Request;

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('signup', 'AuthController@register');
Route::post('login', 'AuthController@login');


Route::group(['middleware' => 'jwt.auth'], function () {
    Route::get('high_prioty_work', 'Query\QueryController@query_high_priority_work');
    Route::get('work_schedule', 'Query\QueryController@query_work_remind');
    Route::get('all_user', 'Query\QueryController@query_all_user');

    // Auth APIs
    Route::get('auth', 'AuthController@user');
    Route::post('logout', 'AuthController@logout');

    // User APIs
    Route::get('users', 'UserController@index');
    Route::get('users/currentUser/groups', 'UserController@currentUserGroups');
    Route::get('user/currentUser/groups/{group_id}/works', 'UserController@currentUserGroupWorks');


    // Group APIs
    Route::get('groups', 'GroupController@index');
    Route::get('groups/lower', 'UserController@indexLowerTier');
    Route::post('groups', 'GroupController@create');
    Route::post('groups/group/update', 'GroupController@update');
    Route::post('groups/group/delete', 'GroupController@delete');
    Route::post('groups/group/user/create', 'GroupController@addUserToGroup');
    Route::post('groups/group/user/update', 'GroupController@updateUserTaskInGroup');
    Route::post('groups/group/user/delete', 'GroupController@deleteUserInGroup');
    Route::get('groups/{group_id}/users', 'GroupController@getUsersInfo');


    // Work APIs
    Route::get('user/groups/{group_id}/works', 'WorkController@index');
    ROute::get('works/analyze', 'WorkController@analyze');
    Route::post('user/groups/group/works', 'WorkController@create');
    Route::get('user/groups/{group_id}/works/basic_info', 'WorkController@workBasicInfo');
    Route::get('user/works', 'WorkController@getWorkUser');

    // Department APIs
    Route::post('departments', 'DepartmentController@create');

    // KPI APIs
    Route::get('user/targets', 'KPIController@index');
    Route::post('user/targets', 'KPIController@store');
    Route::get('user/targets/{target_id}', 'KPIController@show');
    Route::put('user/targets/{target_id}', 'KPIController@update');
    Route::delete('user/targets/{target_id}', 'KPIController@destroy');
});

Route::middleware('jwt.refresh')->get('/token/refresh', 'AuthController@refresh');

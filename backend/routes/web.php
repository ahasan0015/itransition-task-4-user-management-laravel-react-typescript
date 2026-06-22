<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// routes/web.php


//test-main

// Route::get('/test-mail', function () {
//     try {
//         Mail::raw('Testing email from Subdomain', function ($message) {
//             $message->to('ahasanstu92@gmail.com')
//                     ->subject('Test Mail from Subdomain');
//         });
//         return 'Mail Sent Successfully!';
//     } catch (\Exception $e) {
//         return 'Error: ' . $e->getMessage();
//     }
// });
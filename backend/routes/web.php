<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// routes/web.php
Route::get('/test-mail', function () {
    Mail::raw('Testing Gmail with Laravel by Roxy2', function ($message) {
        $message->to('ahasanstu92@gmail.com')->subject('Testing Mail');
    });
    return 'Mail Sent!';
});

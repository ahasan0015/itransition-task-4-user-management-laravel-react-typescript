<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // NOTE: Default inline unique() removed to avoid conflict with the explicit index at the bottom.
            $table->string('email'); 
            $table->string('password');
            // NOTE: Application workflow statuses (unverified, active, blocked)
            $table->string('status')->default('unverified'); 
            
            // THIRD REQUIREMENT: Necessary field to explicitly sort dashboard rows.
            $table->timestamp('last_login_time')->nullable(); 
            
            // NOTE: Required token to simulate the asynchronous verification process.
            $table->string('verification_token')->nullable();
            /**
             * FIRST REQUIREMENT & STORAGE LEVEL COMPLIANCE:
             * IMPORTANT: This creates an explicit UNIQUE INDEX independently of any application code logic.
             * NOTA BENE: Our storage layer will reject any parallel duplicate entries, throwing a QueryException.
             */
            $table->unique('email', 'idx_users_email_unique');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

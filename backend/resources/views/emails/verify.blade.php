<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
    <h2 style="color: #2c3e50;">Welcome to Our Platform, {{ $user->name }}!</h2>
    <p>We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ route('verification.verify', $user->verification_token) }}" 
           style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Verify Email Address
        </a>
    </div>
    
    <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
    
    <p style="word-break: break-all; color: #007bff;">
        {{ route('verification.verify', $user->verification_token) }}
    </p>
    
    <p>Best Regards,<br>The Team</p>
</div>
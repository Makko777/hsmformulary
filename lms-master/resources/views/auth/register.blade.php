@extends('layouts.auth')

@section('title', 'Register')

@section('content')
    <h1 class="fs-32 fw-bold topic">Sign up</h1>

    <form method="POST" action="{{ route('register') }}" class="mb-3 pb-3">
        @csrf

        <!-- Full Name -->
        <div class="mb-3 position-relative">
            <label class="form-label" for="name">Full Name<span class="text-danger ms-1">*</span></label>
            <div class="position-relative">
                <input type="text" id="name" name="name" value="{{ old('name') }}"
                       class="form-control form-control-lg @error('name') is-invalid @enderror"
                       required autofocus autocomplete="name">
                <span><i class="isax isax-user input-icon text-gray-7 fs-14"></i></span>
            </div>
            @error('name')
                <div class="invalid-feedback d-block">{{ $message }}</div>
            @enderror
        </div>

        <!-- Email -->
        <div class="mb-3 position-relative">
            <label class="form-label" for="email">Email<span class="text-danger ms-1">*</span></label>
            <div class="position-relative">
                <input type="email" id="email" name="email" value="{{ old('email') }}"
                       class="form-control form-control-lg @error('email') is-invalid @enderror"
                       required autocomplete="username">
                <span><i class="isax isax-sms input-icon text-gray-7 fs-14"></i></span>
            </div>
            @error('email')
                <div class="invalid-feedback d-block">{{ $message }}</div>
            @enderror
        </div>

        <!-- Password -->
        <div class="mb-3 position-relative">
            <label class="form-label" for="password">New Password <span class="text-danger"> *</span></label>
            <div class="position-relative" id="passwordInput">
                <input type="password" id="password" name="password"
                       class="pass-inputs form-control form-control-lg @error('password') is-invalid @enderror"
                       required autocomplete="new-password">
                <span class="isax toggle-passwords isax-eye-slash text-gray-7 fs-14"></span>
            </div>
            <div class="password-strength" id="passwordStrength">
                <span id="poor"></span>
                <span id="weak"></span>
                <span id="strong"></span>
                <span id="heavy"></span>
            </div>
            <div class="mt-2" id="passwordInfo"></div>
            @error('password')
                <div class="invalid-feedback d-block">{{ $message }}</div>
            @enderror
        </div>

        <!-- Confirm Password -->
        <div class="mb-3 position-relative">
            <label class="form-label" for="password_confirmation">Confirm Password <span class="text-danger"> *</span></label>
            <div class="position-relative">
                <input type="password" id="password_confirmation" name="password_confirmation"
                       class="pass-inputa form-control form-control-lg"
                       required autocomplete="new-password">
                <span class="isax toggle-passworda isax-eye-slash text-gray-7 fs-14"></span>
            </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="remember-me d-flex align-items-center">
                <input class="form-check-input" type="checkbox" value="" id="terms" required>
                <label class="form-check-label mb-0 d-inline-flex remember-me fs-14" for="terms">
                    I agree with <a href="javascript:void(0);" class="link-2 mx-2">Terms of Service</a> and <a href="javascript:void(0);" class="link-2 mx-2">Privacy Policy</a>
                </label>
            </div>
        </div>

        <!-- Sign Up Button -->
        <div class="d-grid">
            <button class="btn btn-secondary btn-lg" type="submit">Sign Up <i class="isax isax-arrow-right-3 ms-1"></i></button>
        </div>
    </form>

    <!-- Login Link -->
    <div class="fs-14 fw-normal d-flex align-items-center justify-content-center">
        Already you have an account?<a href="{{ route('login') }}" class="link-2 ms-1"> Login</a>
    </div>
@endsection

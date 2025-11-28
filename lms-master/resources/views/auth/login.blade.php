@extends('layouts.auth')

@section('title', 'Login')

@section('content')
    <h1 class="fs-32 fw-bold topic">Sign into Your Account</h1>

    <!-- Session Status -->
    @if (session('status'))
        <div class="alert alert-success mb-3" role="alert">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ route('login') }}" class="mb-3 pb-3">
        @csrf

        <!-- Email Address -->
        <div class="mb-3 position-relative">
            <label class="form-label" for="email">Email<span class="text-danger ms-1">*</span></label>
            <div class="position-relative">
                <input type="email" id="email" name="email" value="{{ old('email') }}"
                       class="form-control form-control-lg @error('email') is-invalid @enderror"
                       required autofocus autocomplete="username">
                <span><i class="isax isax-sms input-icon text-gray-7 fs-14"></i></span>
            </div>
            @error('email')
                <div class="invalid-feedback d-block">{{ $message }}</div>
            @enderror
        </div>

        <!-- Password -->
        <div class="mb-3 position-relative">
            <label class="form-label" for="password">Password <span class="text-danger ms-1">*</span></label>
            <div class="position-relative" id="passwordInput">
                <input type="password" id="password" name="password"
                       class="pass-inputs form-control form-control-lg @error('password') is-invalid @enderror"
                       required autocomplete="current-password">
                <span class="isax toggle-passwords isax-eye-slash fs-14"></span>
            </div>
            @error('password')
                <div class="invalid-feedback d-block">{{ $message }}</div>
            @enderror
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="remember-me d-flex align-items-center">
                <input class="form-check-input" type="checkbox" name="remember" id="remember_me">
                <label class="form-check-label ms-2" for="remember_me">
                    Remember Me
                </label>
            </div>
            <div>
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="link-2">
                        Forgot Password ?
                    </a>
                @endif
            </div>
        </div>

        <!-- Login Button -->
        <div class="d-grid">
            <button class="btn btn-secondary btn-lg" type="submit">Login <i class="isax isax-arrow-right-3 ms-1"></i></button>
        </div>
    </form>

    <!-- Sign Up Link -->
    <div class="fs-14 fw-normal d-flex align-items-center justify-content-center">
        Don't you have an account?<a href="{{ route('register') }}" class="link-2 ms-1"> Sign up</a>
    </div>
@endsection

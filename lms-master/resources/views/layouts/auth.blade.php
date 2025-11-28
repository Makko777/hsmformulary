<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
	<head>

		<!-- Meta Tags -->
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Dreams LMS is a powerful Learning Management System template designed for educators, training institutions, and businesses. Manage courses, track student progress, conduct virtual classes, and enhance e-learning experiences with an intuitive and feature-rich platform.">
		<meta name="keywords" content="LMS template, Learning Management System, e-learning software, online course platform, student management, education portal, virtual classroom, training management system, course tracking, online education">
		<meta name="author" content="Dreams Technologies">
		<meta name="robots" content="index, follow">
		<meta name="csrf-token" content="{{ csrf_token() }}">

		<title>{{ config('app.name', 'Dreams LMS') }} - @yield('title', 'Authentication')</title>

		<!-- Favicon -->
		<link rel="shortcut icon" href="{{ asset('assets/img/favicon.png') }}">
		<link rel="apple-touch-icon" href="{{ asset('assets/img/apple-icon.png') }}">

		<!-- Bootstrap CSS -->
		<link rel="stylesheet" href="{{ asset('assets/css/bootstrap.min.css') }}">

		<!-- Fontawesome CSS -->
		<link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome/css/fontawesome.min.css') }}">
		<link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome/css/all.min.css') }}">

		<!-- Select2 CSS -->
		<link rel="stylesheet" href="{{ asset('assets/plugins/select2/css/select2.min.css') }}">

        <!-- Slick CSS -->
		<link rel="stylesheet" href="{{ asset('assets/plugins/slick/slick.css') }}">
		<link rel="stylesheet" href="{{ asset('assets/plugins/slick/slick-theme.css') }}">

		<!-- Feathericon CSS -->
        <link rel="stylesheet" href="{{ asset('assets/plugins/feather/feather.css') }}">

		<!-- Tabler Icon CSS -->
		<link rel="stylesheet" href="{{ asset('assets/plugins/tabler-icons/tabler-icons.css') }}">

        <!-- Iconsax CSS -->
		<link rel="stylesheet" href="{{ asset('assets/css/iconsax.css') }}">

		<!-- Main CSS -->
		<link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">

	</head>
	<body>

		<!-- Main Wrapper -->
		<div class="main-wrapper">
            <div class="login-content">
                <div class="row">
                    <!-- Login Banner -->
                    <div class="col-lg-6 login-bg d-none d-lg-flex">
                        <div class="login-carousel">
                            <div>
                                <div class="login-carousel-section mb-3">
                                    <div class="login-banner">
                                        <img src="{{ asset('assets/img/auth/auth-1.svg') }}" class="img-fluid" alt="Logo">
                                    </div>
                                    <div class="mentor-course text-center">
                                        <h3 class="mb-2">Welcome to <br>Dreams<span class="text-secondary">LMS</span> Courses.</h3>
                                        <p>Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="login-carousel-section mb-3">
                                    <div class="login-banner">
                                        <img src="{{ asset('assets/img/auth/auth-1.svg') }}" class="img-fluid" alt="Logo">
                                    </div>
                                    <div class="mentor-course text-center">
                                        <h3 class="mb-2">Welcome to <br>Dreams<span class="text-secondary">LMS</span> Courses.</h3>
                                        <p>Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="login-carousel-section mb-3">
                                    <div class="login-banner">
                                        <img src="{{ asset('assets/img/auth/auth-1.svg') }}" class="img-fluid" alt="Logo">
                                    </div>
                                    <div class="mentor-course text-center">
                                        <h3 class="mb-2">Welcome to <br>Dreams<span class="text-secondary">LMS</span> Courses.</h3>
                                        <p>Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /Login Banner -->

                    <div class="col-lg-6 login-wrap-bg">
                        <!-- Login/Register Form -->
                        <div class="login-wrapper">
                            <div class="loginbox">
                                <div class="w-100">
                                    <div class="d-flex align-items-center justify-content-between login-header">
                                        <img src="{{ asset('assets/img/logo.svg') }}" class="img-fluid" alt="Logo">
                                        <a href="{{ url('/') }}" class="link-1">Back to Home</a>
                                    </div>

                                    @yield('content')

                                    <!-- /Login/Register Form -->

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	   <!-- /Main Wrapper -->

		<!-- jQuery -->
		<script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}"></script>

		<!-- Bootstrap Core JS -->
		<script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}"></script>

		<!-- Select2 JS -->
	  	<script src="{{ asset('assets/plugins/select2/js/select2.min.js') }}"></script>

        <!-- Slick Slider -->
		<script src="{{ asset('assets/plugins/slick/slick.js') }}"></script>

        <!-- Validation-->
		<script src="{{ asset('assets/js/validation.js') }}"></script>

		<!-- Custom JS -->
		<script src="{{ asset('assets/js/script.js') }}"></script>

		@stack('scripts')

	</body>
</html>

<header class="header-one">
    <div class="container">
        <div class="header-nav">
            <div class="navbar-header">
                <a id="mobile_btn" href="javascript:void(0);">
                    <span class="bar-icon">
                        <i class="isax isax-menu"></i>
                    </span>
                </a>
                <div class="navbar-logo">
                    <a class="logo-white header-logo" href="{{ url('/') }}">
                        <img src="{{ asset('assets/img/logo-white.svg') }}" class="logo" alt="Logo">
                    </a>
                    <a class="logo-dark header-logo" href="{{ url('/') }}">
                        <img src="{{ asset('assets/img/logo-white.svg') }}" class="logo" alt="Logo">
                    </a>
                </div>
            </div>
            <div class="main-menu-wrapper">
                <div class="menu-header">
                    <a href="{{ url('/') }}" class="menu-logo">
                        <img src="{{ asset('assets/img/logo.svg') }}" class="img-fluid" alt="Logo">
                    </a>
                    <a id="menu_close" class="menu-close" href="javascript:void(0);">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
                <ul class="main-nav">
                    <li class="{{ request()->is('/') ? 'active' : '' }}">
                        <a href="{{ url('/') }}">Home</a>
                    </li>
                    @auth
                        <li class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">
                            <a href="{{ route('dashboard') }}">Dashboard</a>
                        </li>
                    @endauth
                </ul>
                <div class="menu-login">
                    @guest
                        <a href="{{ route('login') }}" class="btn btn-primary w-100 mb-2">
                            <i class="isax isax-user me-2"></i>Sign In
                        </a>
                        <a href="{{ route('register') }}" class="btn btn-secondary w-100">
                            <i class="isax isax-user-edit me-2"></i>Register
                        </a>
                    @else
                        <a href="{{ route('dashboard') }}" class="btn btn-primary w-100 mb-2">
                            <i class="isax isax-grid-35 me-2"></i>Dashboard
                        </a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="btn btn-secondary w-100">
                                <i class="isax isax-logout me-2"></i>Logout
                            </button>
                        </form>
                    @endguest
                </div>
            </div>
            <div class="header-btn d-flex align-items-center">
                @guest
                    <a href="{{ route('login') }}" class="btn btn-primary d-inline-flex align-items-center me-2">
                        Sign In
                    </a>
                    <a href="{{ route('register') }}" class="btn btn-secondary me-0">
                        Register
                    </a>
                @else
                    <a href="{{ route('dashboard') }}" class="btn btn-primary d-inline-flex align-items-center me-2">
                        Dashboard
                    </a>
                    <form method="POST" action="{{ route('logout') }}" class="d-inline">
                        @csrf
                        <button type="submit" class="btn btn-secondary me-0">
                            Logout
                        </button>
                    </form>
                @endguest
            </div>
        </div>
    </div>
</header>

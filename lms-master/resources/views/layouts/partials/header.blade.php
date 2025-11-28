<header class="header-two">
    <div class="container">
        <div class="header-nav">
            <div class="navbar-header">
                <a id="mobile_btn" href="javascript:void(0);">
                    <span class="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </a>
                <div class="navbar-logo">
                    <a class="logo-white header-logo" href="{{ url('/') }}">
                        <img src="{{ asset('assets/img/logo.svg') }}" class="logo" alt="Logo">
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
                    <li><a href="{{ url('/') }}">Home</a></li>
                    <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                </ul>
            </div>
            <div class="header-btn d-flex align-items-center">
                <div class="dropdown profile-dropdown">
                    <a href="javascript:void(0);" class="d-flex align-items-center" data-bs-toggle="dropdown">
                        <span class="avatar">
                            <img src="{{ asset('assets/img/user/user-02.jpg') }}" alt="Img" class="img-fluid rounded-circle">
                        </span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                        <div class="profile-header d-flex align-items-center">
                            <div class="avatar">
                                <img src="{{ asset('assets/img/user/user-02.jpg') }}" alt="Img" class="img-fluid rounded-circle">
                            </div>
                            <div>
                                <h6>{{ Auth::user()->name }}</h6>
                                <p>{{ Auth::user()->email }}</p>
                            </div>
                        </div>
                        <ul class="profile-body">
                            <li>
                                <a class="dropdown-item d-inline-flex align-items-center rounded fw-medium" href="{{ route('profile.edit') }}">
                                    <i class="isax isax-security-user me-2"></i>My Profile
                                </a>
                            </li>
                        </ul>
                        <div class="profile-footer">
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100">
                                    <i class="isax isax-logout me-2"></i>Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

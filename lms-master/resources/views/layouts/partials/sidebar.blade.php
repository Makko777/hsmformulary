<div class="settings-sidebar">
    <div>
        <h6 class="mb-3">Main Menu</h6>
        <ul class="mb-3 pb-1">
            <li>
                <a href="{{ route('dashboard') }}" class="d-inline-flex align-items-center {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                    <i class="isax isax-grid-35 me-2"></i>Dashboard
                </a>
            </li>
            <li>
                <a href="{{ route('profile.edit') }}" class="d-inline-flex align-items-center {{ request()->routeIs('profile.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-user me-2"></i>My Profile
                </a>
            </li>
        </ul>
        <h6 class="mb-3">Account Settings</h6>
        <ul>
            <li>
                <a href="{{ route('profile.edit') }}" class="d-inline-flex align-items-center {{ request()->routeIs('profile.*') ? 'active' : '' }}">
                    <i class="isax isax-setting-2 me-2"></i>Settings
                </a>
            </li>
            <li>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="d-inline-flex align-items-center border-0 bg-transparent w-100 text-start p-0">
                        <i class="isax isax-logout me-2"></i>Logout
                    </button>
                </form>
            </li>
        </ul>
    </div>
</div>

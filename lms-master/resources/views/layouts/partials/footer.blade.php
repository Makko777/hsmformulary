<footer class="footer">
    <div class="footer-bg">
        <img src="{{ asset('assets/img/bg/footer-bg-01.png') }}" class="footer-bg-1" alt="">
        <img src="{{ asset('assets/img/bg/footer-bg-02.png') }}" class="footer-bg-2" alt="">
    </div>
    <div class="footer-top">
        <div class="container">
            <div class="row row-gap-4">
                <div class="col-lg-4">
                    <div class="footer-about">
                        <div class="footer-logo">
                            <img src="{{ asset('assets/img/logo.svg') }}" alt="">
                        </div>
                        <p>Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</p>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="row row-gap-4">
                        <div class="col-lg-3">
                            <div class="footer-widget footer-menu">
                                <h5 class="footer-title">For Students</h5>
                                <ul>
                                    <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                                    <li><a href="{{ route('profile.edit') }}">My Profile</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="footer-widget footer-menu">
                                <h5 class="footer-title">Pages</h5>
                                <ul>
                                    <li><a href="{{ url('/') }}">Home</a></li>
                                    <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="footer-widget footer-menu">
                                <h5 class="footer-title">Support</h5>
                                <ul>
                                    <li><a href="javascript:void(0);">Contact</a></li>
                                    <li><a href="javascript:void(0);">Help Center</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="footer-widget footer-menu">
                                <h5 class="footer-title">Company</h5>
                                <ul>
                                    <li><a href="javascript:void(0);">About Us</a></li>
                                    <li><a href="javascript:void(0);">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="container">
            <div class="copyright">
                <div class="row align-items-center">
                    <div class="col-lg-6 col-sm-12">
                        <div class="copyright-text">
                            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
                        </div>
                    </div>
                    <div class="col-lg-6 col-sm-12">
                        <ul class="social-icon d-flex align-items-center justify-content-lg-end">
                            <li class="me-2">
                                <a href="javascript:void(0);"><i class="fa-brands fa-facebook-f"></i></a>
                            </li>
                            <li class="me-2">
                                <a href="javascript:void(0);"><i class="fa-brands fa-instagram"></i></a>
                            </li>
                            <li class="me-2">
                                <a href="javascript:void(0);"><i class="fa-brands fa-x-twitter"></i></a>
                            </li>
                            <li class="me-2">
                                <a href="javascript:void(0);"><i class="fa-brands fa-youtube"></i></a>
                            </li>
                            <li>
                                <a href="javascript:void(0);"><i class="fa-brands fa-linkedin"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

@extends('layouts.welcome')

@section('title', 'Home')

@section('content')
<!-- Banner -->
<section class="banner-section">
    <img class="img-fluid d-none d-lg-flex banner-bg1" src="{{ asset('assets/img/bg/bg-15.png') }}" alt="img">
    <img class="img-fluid d-none d-lg-flex banner-bg2" src="{{ asset('assets/img/bg/bg-16.png') }}" alt="img">
    <img class="img-fluid d-none d-lg-flex banner-bg3" src="{{ asset('assets/img/bg/bg-17.png') }}" alt="img">
    <img class="img-fluid d-none d-lg-flex banner-bg4" src="{{ asset('assets/img/bg/bg-18.png') }}" alt="img">
    <div class="container">
        <div class="row align-items-center justify-content-between">
            <div class="col-xl-7 col-lg-7">
                <div class="banner-content pe-xxl-5">
                    <span class="hero-title">The Leader in Online Learning</span>
                    <h1 class="mb-4 text-white">Find the Best <span>Courses</span> from the Best <span>Mentors</span> Around the World</h1>
                    <p class="fs-lg text-center text-md-start pb-2 pb-md-3 mb-4">Our specialized online courses are designed to bring the classroom experience to you, no matter where you are.</p>

                    <div class="d-flex align-items-center gap-4 justify-content-lg-between justify-content-center flex-wrap">
                        <div class="counter-item">
                            <div class="counter-icon flex-shrink-0">
                                <img src="{{ asset('assets/img/icons/icon-32.svg') }}" alt="img">
                            </div>
                            <div class="count-content">
                                <h5 class="text-purple"><span class="count-digit">10</span>K</h5>
                                <p>Online Courses</p>
                            </div>
                        </div>
                        <div class="counter-item">
                            <div class="counter-icon flex-shrink-0">
                                <img src="{{ asset('assets/img/icons/icon-33.svg') }}" alt="img">
                            </div>
                            <div class="count-content">
                                <h5 class="text-skyblue"><span class="count-digit">6</span>K</h5>
                                <p>Certified Courses</p>
                            </div>
                        </div>
                        <div class="counter-item">
                            <div class="counter-icon flex-shrink-0">
                                <img src="{{ asset('assets/img/icons/icon-34.svg') }}" alt="img">
                            </div>
                            <div class="count-content">
                                <h5 class="text-success"><span class="count-digit">2</span>K</h5>
                                <p>Experienced Tutors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-4 col-lg-5">
                <div class="banner-image">
                    <div class="swiper swiper-slider-banner">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="course-item-two course-item mb-0">
                                    <div class="course-img">
                                        <img src="{{ asset('assets/img/course/course-22.jpg') }}" alt="img" class="img-fluid">
                                        <div class="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2">
                                            <a href="javascript:void(0);" class="fav-icon">
                                                <i class="isax isax-heart"></i>
                                            </a>
                                            <a href="javascript:void(0);" class="brand-icon ms-auto">
                                                <img src="{{ asset('assets/img/icons/course-01.svg') }}" alt="img" class="img-fluid">
                                            </a>
                                        </div>
                                    </div>
                                    <div class="course-content">
                                        <div class="d-flex justify-content-between mb-2">
                                            <div class="d-flex align-items-center">
                                                <a href="javascript:void(0);" class="avatar avatar-sm">
                                                    <img src="{{ asset('assets/img/user/user-50.jpg') }}" alt="img" class="img-fluid avatar avatar-sm rounded-circle">
                                                </a>
                                                <div class="ms-2">
                                                    <a href="javascript:void(0);" class="link-default fs-14">David Benitz</a>
                                                </div>
                                            </div>
                                            <span class="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium">
                                                Productivity
                                            </span>
                                        </div>
                                        <h6 class="mb-2"><a href="javascript:void(0);">The Complete Business and Management Course</a></h6>
                                        <p class="d-flex align-items-center mb-3"><i class="ti ti-star-filled text-warning me-2"></i>5.0 (210 Reviews)</p>
                                        <div class="d-flex align-items-center justify-content-between">
                                            <h6 class="text-secondary fs-16 fw-semi-bold mb-0">$168</h6>
                                            <a href="javascript:void(0);" class="btn btn-dark btn-sm d-inline-flex align-items-center">Add to Cart<i class="isax isax-arrow-right-3 ms-1"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- /Banner -->

<!-- Features Section -->
<section class="section feature-section">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="section-header text-center">
                    <h2 class="header-title">Why Choose DreamsLMS?</h2>
                    <p class="sub-title">Discover the benefits of learning with us</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-6 d-flex">
                <div class="feature-box flex-fill">
                    <div class="feature-icon">
                        <img src="{{ asset('assets/img/icons/icon-32.svg') }}" alt="icon">
                    </div>
                    <div class="feature-content">
                        <h4>Expert Instructors</h4>
                        <p>Learn from industry experts with years of experience in their fields.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 d-flex">
                <div class="feature-box flex-fill">
                    <div class="feature-icon">
                        <img src="{{ asset('assets/img/icons/icon-33.svg') }}" alt="icon">
                    </div>
                    <div class="feature-content">
                        <h4>Flexible Learning</h4>
                        <p>Study at your own pace, anytime and anywhere with our online platform.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 d-flex">
                <div class="feature-box flex-fill">
                    <div class="feature-icon">
                        <img src="{{ asset('assets/img/icons/icon-34.svg') }}" alt="icon">
                    </div>
                    <div class="feature-content">
                        <h4>Certifications</h4>
                        <p>Earn recognized certifications upon course completion to boost your career.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- /Features Section -->

<!-- CTA Section -->
<section class="section cta-section">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-8">
                <div class="cta-content">
                    <h2 class="text-white mb-2">Ready to Start Learning?</h2>
                    <p class="text-white-50">Join thousands of students already learning on DreamsLMS</p>
                </div>
            </div>
            <div class="col-lg-4 text-lg-end">
                @auth
                    <a href="{{ route('dashboard') }}" class="btn btn-white btn-lg">Go to Dashboard</a>
                @else
                    <a href="{{ route('register') }}" class="btn btn-white btn-lg">Get Started Now</a>
                @endauth
            </div>
        </div>
    </div>
</section>
<!-- /CTA Section -->
@endsection

@push('scripts')
<script>
    // Initialize swiper
    if (typeof Swiper !== 'undefined') {
        new Swiper('.swiper-slider-banner', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    }

    // Initialize counter
    if (typeof $('.count-digit').counterUp !== 'undefined') {
        $('.count-digit').counterUp({
            delay: 10,
            time: 2000
        });
    }
</script>
@endpush

# Product Requirements Document (PRD)
# Learning Management System (LMS)

**Version:** 1.0
**Date:** 2025-11-12
**Project:** Multi-Tenant Learning Management System
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Roles & Personas](#user-roles--personas)
4. [Functional Requirements](#functional-requirements)
5. [User Stories](#user-stories)
6. [Feature Specifications](#feature-specifications)
7. [Technical Requirements](#technical-requirements)
8. [Database Schema](#database-schema)
9. [User Interface Requirements](#user-interface-requirements)
10. [Security & Compliance](#security--compliance)
11. [Payment Integration](#payment-integration)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

### Product Vision
Build a multi-tenant Learning Management System (LMS) that enables trainers to monetize their knowledge by creating and selling courses, while providing students with an intuitive platform to discover, purchase, and consume educational content.

### Key Objectives
- Enable trainers to independently manage their courses and revenue streams
- Provide students with seamless course discovery and learning experience
- Give administrators full platform oversight and management capabilities
- Support flexible payment processing with trainer-specific payment gateways

### Success Metrics
- Number of active trainers on the platform
- Total courses published
- Student enrollment rate
- Course completion rate
- Revenue processed through the platform

---

## Product Overview

### What We're Building
A web-based LMS platform with three distinct user roles:
1. **Admin** - Platform administrator with full system access
2. **Trainer** - Course creator who manages content and students
3. **Student** - Learner who purchases and consumes courses

### Core Value Propositions

**For Trainers:**
- Easy course creation and management
- Flexible pricing control
- Direct payment gateway integration
- Student management tools
- Content hosting (videos, PDFs, slides)

**For Students:**
- Wide variety of courses to choose from
- Secure payment processing
- Personal learning library
- Access to purchased content anytime

**For Admins:**
- Complete platform oversight
- Trainer and course management
- System-wide analytics
- Content moderation capabilities

---

## User Roles & Personas

### 1. Admin

**Role Description:**
Platform administrator with supreme access to all system features and data.

**Responsibilities:**
- Manage trainer accounts (create, edit, suspend, delete)
- Oversee all courses across all trainers
- Manage course materials for quality control
- Monitor and manage student accounts
- View platform-wide analytics
- Handle platform settings and configurations

**Permissions:**
- Full CRUD access to trainers
- Full CRUD access to all courses
- Full CRUD access to all course materials
- Full CRUD access to all students
- Access to all reports and analytics
- System configuration access

**Persona Example:**
- Name: Sarah Chen
- Age: 35
- Background: Educational technology manager
- Goals: Maintain platform quality, grow trainer base, ensure student satisfaction

---

### 2. Trainer

**Role Description:**
Course creator and instructor who manages their own educational content and students.

**Responsibilities:**
- Create and manage multiple courses
- Upload course materials (PDFs, slides, videos)
- Set pricing for each course
- Configure payment gateway API keys
- Manage enrolled students
- Track course performance

**Permissions:**
- Create unlimited courses
- Upload materials to own courses only
- Set/modify course pricing
- Configure own payment gateway
- View and manage own students only
- Access own revenue reports

**Persona Example:**
- Name: John Martinez
- Age: 42
- Background: Software development trainer with 15 years experience
- Goals: Monetize expertise, reach more students, track student progress

---

### 3. Student

**Role Description:**
Learner who discovers, purchases, and consumes educational content.

**Responsibilities:**
- Browse and search available courses
- Purchase courses of interest
- Access purchased course materials
- Track own learning progress

**Permissions:**
- View all published courses
- Purchase any available course
- Access own purchased courses only
- View own learning library
- Download materials (if permitted)

**Persona Example:**
- Name: Emily Johnson
- Age: 28
- Background: Junior developer looking to upskill
- Goals: Learn new technologies, advance career, flexible learning schedule

---

## Functional Requirements

### FR-1: User Authentication & Authorization

**FR-1.1:** System shall support registration and login for all user types
**FR-1.2:** System shall implement role-based access control (RBAC)
**FR-1.3:** System shall provide password reset functionality
**FR-1.4:** System shall support email verification
**FR-1.5:** System shall maintain user sessions securely

---

### FR-2: Admin Features

**FR-2.1: Trainer Management**
- Admin can create new trainer accounts
- Admin can view list of all trainers
- Admin can edit trainer information
- Admin can suspend/activate trainer accounts
- Admin can delete trainer accounts
- Admin can view trainer statistics

**FR-2.2: Course Management**
- Admin can view all courses from all trainers
- Admin can edit any course details
- Admin can publish/unpublish courses
- Admin can delete courses
- Admin can view course enrollment statistics

**FR-2.3: Material Management**
- Admin can view all materials for all courses
- Admin can upload/edit/delete materials
- Admin can review materials for compliance
- Admin can set material visibility

**FR-2.4: Student Management**
- Admin can view all registered students
- Admin can edit student information
- Admin can suspend/activate student accounts
- Admin can view student enrollment history
- Admin can manually enroll/unenroll students

**FR-2.5: Analytics & Reporting**
- Admin can view platform-wide statistics
- Admin can generate revenue reports
- Admin can view user growth metrics
- Admin can export data for analysis

---

### FR-3: Trainer Features

**FR-3.1: Course Creation & Management**
- Trainer can create new courses
- Trainer can edit own course details
- Trainer can set course thumbnail/cover image
- Trainer can write course descriptions
- Trainer can define course curriculum/syllabus
- Trainer can publish/unpublish own courses
- Trainer can delete own courses
- Trainer can duplicate courses

**FR-3.2: Material Management**
- Trainer can upload PDF files
- Trainer can upload presentation slides (PPT, PPTX)
- Trainer can upload video files
- Trainer can organize materials into modules/sections
- Trainer can set material order/sequence
- Trainer can set material prerequisites
- Trainer can delete materials
- Trainer can preview materials before publishing

**FR-3.3: Pricing Management**
- Trainer can set course price
- Trainer can change course price anytime
- Trainer can create promotional discounts
- Trainer can set free courses (price = 0)
- Trainer can view pricing history

**FR-3.4: Payment Gateway Configuration**
- Trainer can input payment gateway API keys
- Trainer can select payment provider (Stripe, PayPal, etc.)
- Trainer can test payment configuration
- Trainer can update payment credentials
- Trainer can view payment transaction logs

**FR-3.5: Student Management**
- Trainer can view list of enrolled students per course
- Trainer can see student progress
- Trainer can manually grant/revoke course access
- Trainer can export student lists
- Trainer can communicate with students (optional)

**FR-3.6: Revenue Tracking**
- Trainer can view total earnings
- Trainer can view earnings per course
- Trainer can view transaction history
- Trainer can export financial reports

---

### FR-4: Student Features

**FR-4.1: Course Discovery**
- Student can browse all available courses
- Student can search courses by keyword
- Student can filter courses by category
- Student can filter courses by price range
- Student can filter courses by trainer
- Student can view course details before purchase
- Student can preview course syllabus

**FR-4.2: Course Purchase**
- Student can add courses to cart
- Student can proceed to checkout
- Student can complete payment via trainer's gateway
- Student receives confirmation email after purchase
- Student gets instant access after successful payment

**FR-4.3: Learning Library**
- Student can view all purchased courses
- Student can see course progress
- Student can continue where they left off
- Student can mark lessons as complete
- Student can download materials (if permitted)

**FR-4.4: Course Consumption**
- Student can access course materials
- Student can watch videos with player controls
- Student can download PDFs
- Student can view slides
- Student can navigate between lessons
- Student can bookmark favorite lessons
- Student can track overall progress

**FR-4.5: User Profile**
- Student can update personal information
- Student can change password
- Student can view purchase history
- Student can view certificates (future)

---

## User Stories

### Admin User Stories

**As an Admin, I want to:**

1. **Trainer Management**
   - Create trainer accounts so new instructors can join the platform
   - View all trainers in a list so I can monitor platform growth
   - Edit trainer details so I can keep information accurate
   - Suspend trainer accounts so I can handle policy violations
   - Delete trainer accounts so I can remove fraudulent users

2. **Course Oversight**
   - View all courses so I can monitor content quality
   - Edit any course so I can fix issues or improve content
   - Unpublish courses so I can handle inappropriate content
   - See enrollment numbers so I can understand course popularity

3. **Platform Management**
   - View dashboard with key metrics so I can track platform health
   - Generate reports so I can make data-driven decisions
   - Manage system settings so I can configure the platform

---

### Trainer User Stories

**As a Trainer, I want to:**

1. **Course Creation**
   - Create courses easily so I can share my knowledge
   - Add attractive course images so students are drawn to my content
   - Write detailed descriptions so students know what they'll learn
   - Organize content into modules so learning is structured

2. **Content Management**
   - Upload video lectures so students can watch and learn
   - Upload PDF resources so students have reference materials
   - Upload slides so students can follow along
   - Reorder content so it flows logically

3. **Monetization**
   - Set my own prices so I control my revenue
   - Connect my payment gateway so I receive payments directly
   - View earnings reports so I can track my income
   - Offer discounts so I can attract more students

4. **Student Management**
   - See who enrolled in my courses so I know my audience
   - Track student progress so I can offer support
   - Communicate with students so I can answer questions

---

### Student User Stories

**As a Student, I want to:**

1. **Discovery**
   - Browse courses easily so I can find what interests me
   - Search by keywords so I can find specific topics
   - Filter by price so I can find courses in my budget
   - Preview course content so I know what I'm buying

2. **Purchase**
   - Add courses to cart so I can buy multiple at once
   - Pay securely so my financial data is protected
   - Get instant access so I can start learning immediately
   - Receive confirmation so I have proof of purchase

3. **Learning**
   - Access my courses anytime so I can learn at my pace
   - Watch videos smoothly so my learning isn't interrupted
   - Download materials so I can study offline
   - Track my progress so I stay motivated
   - Resume where I left off so I don't waste time

4. **Organization**
   - See all my courses in one place so I can manage my learning
   - Mark lessons complete so I know what I've finished
   - View my purchase history so I can track spending

---

## Feature Specifications

### 1. Course Management System

**Course Entity Structure:**
```
Course {
  - ID (unique identifier)
  - Title
  - Slug (URL-friendly)
  - Description (rich text)
  - Thumbnail/Cover Image
  - Category
  - Trainer ID (foreign key)
  - Price (decimal)
  - Currency (default: USD)
  - Status (draft, published, archived)
  - Created At
  - Updated At
  - Published At
}
```

**Course Operations:**
- **Create:** Trainer fills form with title, description, category, price
- **Read:** Anyone can view published courses; trainer can view own drafts
- **Update:** Trainer/Admin can edit course details
- **Delete:** Soft delete to preserve enrollment history
- **Publish:** Change status from draft to published
- **Unpublish:** Change status from published to draft/archived

---

### 2. Material Management System

**Material Entity Structure:**
```
Material {
  - ID
  - Course ID (foreign key)
  - Section/Module ID (foreign key)
  - Title
  - Type (video, pdf, slide, text)
  - File Path/URL
  - File Size
  - Duration (for videos)
  - Order/Sequence
  - Is Free Preview (boolean)
  - Created At
  - Updated At
}
```

**Material Types:**
1. **Videos:**
   - Formats: MP4, WebM
   - Max size: 500MB per file
   - Streaming support required
   - Video player with controls (play, pause, seek, fullscreen)

2. **PDFs:**
   - Max size: 50MB per file
   - In-browser preview support
   - Download option (optional)

3. **Slides:**
   - Formats: PPT, PPTX, PDF
   - Max size: 50MB per file
   - Preview support

**Material Organization:**
- Materials organized into Sections/Modules
- Sequential ordering within sections
- Prerequisites support (unlock after completing previous)

---

### 3. Payment Integration System

**Payment Gateway Support:**
- **CHIP** (Primary - Malaysia's digital finance platform)
  - FPX (Online Banking)
  - E-Wallets (Touch 'n Go, Boost, etc.)
  - Over-the-Counter (OTC) payments
  - Bank Negara Malaysia approved

**Trainer Payment Configuration:**
```
TrainerPaymentConfig {
  - Trainer ID
  - Gateway Provider (default: 'chip')
  - Brand ID (CHIP Brand ID - encrypted)
  - Secret Key (CHIP API Secret Key - encrypted)
  - Public Key (for webhook signature verification)
  - Webhook URL
  - Is Active (boolean)
  - Test Mode (boolean - sandbox vs production)
}
```

**CHIP-Specific Configuration:**
- Each trainer must register for a CHIP merchant account
- Obtain Brand ID from CHIP Developer Portal
- Generate Secret Key (API authentication)
- Configure Public Key (webhook verification)
- Set up webhook URL for payment notifications

**Payment Flow (CHIP Integration):**
1. Student selects course and proceeds to checkout
2. System retrieves trainer's CHIP configuration (Brand ID, Secret Key)
3. System creates payment purchase via CHIP API with trainer's credentials
   - POST to CHIP API with Authorization: Bearer {trainer_secret_key}
   - Include purchase details (amount, currency, description)
   - Receive payment URL from CHIP
4. Student redirected to CHIP payment page
5. Student selects payment method (FPX/E-wallet/OTC)
6. Student completes payment through CHIP
7. CHIP sends webhook notification to our system
8. System verifies webhook signature using trainer's Public Key
9. System validates payment status
10. Student enrolled in course automatically
11. Confirmation email sent to student and trainer
12. Transaction logged in system
13. Student redirected back to success page

**Transaction Record:**
```
Transaction {
  - ID
  - Student ID
  - Trainer ID
  - Course ID
  - Amount
  - Currency (MYR - Malaysian Ringgit)
  - Gateway Provider (chip)
  - CHIP Purchase ID (from CHIP API)
  - CHIP Transaction ID (from webhook)
  - Payment Method (fpx, ewallet, otc)
  - Status (pending, completed, failed, refunded, cancelled)
  - Webhook Signature (for verification)
  - Metadata (JSON - additional CHIP data)
  - Created At
  - Updated At
}
```

---

### 4. Enrollment Management

**Enrollment Entity:**
```
Enrollment {
  - ID
  - Student ID
  - Course ID
  - Enrolled At
  - Completed At (nullable)
  - Progress Percentage
  - Last Accessed At
  - Status (active, completed, expired)
}
```

**Progress Tracking:**
```
LessonProgress {
  - ID
  - Enrollment ID
  - Material ID
  - Completed (boolean)
  - Completed At
  - Time Spent (seconds)
  - Last Position (for videos - timestamp)
}
```

**Enrollment Types:**
1. **Paid Enrollment:** Created after successful payment
2. **Manual Enrollment:** Admin/Trainer can manually enroll students
3. **Free Enrollment:** For free courses (price = 0)

---

### 5. User Management

**User Entity:**
```
User {
  - ID
  - Name
  - Email (unique)
  - Password (hashed)
  - Role (admin, trainer, student)
  - Avatar
  - Bio
  - Status (active, suspended, deleted)
  - Email Verified At
  - Created At
  - Updated At
}
```

**Trainer Profile Extension:**
```
TrainerProfile {
  - User ID
  - Professional Title
  - Expertise Areas
  - Total Students
  - Total Courses
  - Average Rating
  - Total Revenue
}
```

**Student Profile Extension:**
```
StudentProfile {
  - User ID
  - Enrolled Courses Count
  - Completed Courses Count
  - Total Learning Hours
  - Join Date
}
```

---

### 6. Search & Filter System

**Search Capabilities:**
- Full-text search on course titles
- Search by course description
- Search by trainer name
- Search by category

**Filter Options:**
- Category filter (multi-select)
- Price range filter (min-max slider)
- Trainer filter (multi-select)
- Rating filter (future)
- Duration filter (future)
- Difficulty level filter (future)

**Sort Options:**
- Newest first
- Price: Low to High
- Price: High to Low
- Most Popular (by enrollments)
- Highest Rated (future)

---

## Technical Requirements

### Technology Stack

**Backend:**
- Framework: Laravel 11.x
- PHP: 8.2+
- Database: MySQL 8.0+
- Queue: Redis (for async jobs)
- Cache: Redis
- Storage: Local filesystem (with S3 option for future)

**Frontend:**
- Template Engine: Blade
- CSS Framework: Tailwind CSS
- JavaScript: Alpine.js / Vanilla JS
- Video Player: Video.js or Plyr

**Development Tools:**
- Version Control: Git
- Dependency Management: Composer (PHP), NPM (JS)
- Build Tool: Vite
- Code Quality: Laravel Pint

---

### System Architecture

**Application Structure:**
```
app/
├── Models/
│   ├── User.php
│   ├── Course.php
│   ├── Material.php
│   ├── Enrollment.php
│   ├── Transaction.php
│   ├── TrainerPaymentConfig.php
│   └── LessonProgress.php
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   ├── Trainer/
│   │   └── Student/
│   ├── Middleware/
│   │   ├── RoleMiddleware.php
│   │   └── CourseAccessMiddleware.php
│   └── Requests/
├── Services/
│   ├── PaymentService.php
│   ├── EnrollmentService.php
│   ├── CourseService.php
│   └── MaterialService.php
└── Policies/
    ├── CoursePolicy.php
    ├── MaterialPolicy.php
    └── EnrollmentPolicy.php
```

---

### Frontend Integration Strategy

**Converting HTML to Laravel Blade:**

The Dreams LMS HTML templates need to be converted to Laravel Blade templates with the following approach:

**1. Asset Organization:**
```
public/
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── style.css
│   │   └── plugins/
│   ├── js/
│   │   ├── jquery.min.js
│   │   ├── bootstrap.bundle.min.js
│   │   └── plugins/
│   ├── img/
│   ├── fonts/
│   └── plugins/
│       ├── summernote/
│       ├── datatables/
│       ├── chart.js/
│       └── video.js/
```

**2. Blade Layout Structure:**
```
resources/views/
├── layouts/
│   ├── app.blade.php (main layout)
│   ├── instructor.blade.php (trainer layout)
│   ├── student.blade.php (student layout)
│   └── admin.blade.php (admin layout)
├── components/
│   ├── header.blade.php
│   ├── footer.blade.php
│   ├── sidebar.blade.php
│   └── course-card.blade.php
├── admin/
│   ├── dashboard.blade.php
│   ├── trainers/
│   └── courses/
├── trainer/
│   ├── dashboard.blade.php
│   ├── courses/
│   ├── materials/
│   └── students/
└── student/
    ├── dashboard.blade.php
    ├── courses/
    └── learning/
```

**3. Asset Loading with Vite:**
- Use Laravel Mix/Vite for asset compilation
- Convert static asset paths to `{{ asset('assets/...') }}`
- Implement lazy loading for images
- Minify CSS and JS for production

**4. Dynamic Data Integration:**
- Replace static content with Blade variables: `{{ $course->title }}`
- Use Blade directives: `@foreach`, `@if`, `@auth`
- Implement CSRF tokens: `@csrf`
- Use route helpers: `{{ route('courses.show', $course) }}`

**5. Component Reusability:**
- Extract common elements as Blade components
- Create reusable course cards, tables, forms
- Use Laravel Livewire for interactive components (optional)

**6. Template Priority (Conversion Order):**
1. Authentication pages (already done with Breeze)
2. Student course browsing and enrollment
3. Course player/viewing interface
4. Trainer dashboard and course management
5. Admin dashboard and management tools

---

### Performance Requirements

**Response Time:**
- Page load: < 2 seconds
- API responses: < 500ms
- Video streaming: < 3 seconds buffer time

**Scalability:**
- Support 10,000+ concurrent users
- Handle 1,000+ course uploads
- Store 100GB+ of course materials initially

**Availability:**
- Uptime: 99.5%
- Scheduled maintenance windows: Off-peak hours

---

### Security Requirements

**Authentication:**
- Secure password hashing (bcrypt)
- Session management
- CSRF protection
- Email verification required

**Authorization:**
- Role-based access control (RBAC)
- Policy-based permissions
- Ownership verification

**Data Protection:**
- Encrypt payment gateway credentials
- Secure file uploads (validation, scanning)
- SQL injection prevention
- XSS protection
- HTTPS only

**Payment Security:**
- PCI DSS compliance (via payment gateways)
- No storage of credit card data
- Encrypted API keys
- Webhook signature verification

---

## Database Schema

### Core Tables

**users**
```sql
id - bigint (PK)
name - varchar(255)
email - varchar(255) unique
email_verified_at - timestamp nullable
password - varchar(255)
role - enum('admin', 'trainer', 'student')
avatar - varchar(255) nullable
bio - text nullable
status - enum('active', 'suspended', 'deleted') default 'active'
remember_token - varchar(100) nullable
created_at - timestamp
updated_at - timestamp
```

**trainer_profiles**
```sql
id - bigint (PK)
user_id - bigint (FK -> users.id)
professional_title - varchar(255) nullable
expertise_areas - json nullable
total_students - integer default 0
total_courses - integer default 0
average_rating - decimal(3,2) default 0
total_revenue - decimal(10,2) default 0
created_at - timestamp
updated_at - timestamp
```

**student_profiles**
```sql
id - bigint (PK)
user_id - bigint (FK -> users.id)
enrolled_courses_count - integer default 0
completed_courses_count - integer default 0
total_learning_hours - integer default 0
created_at - timestamp
updated_at - timestamp
```

**courses**
```sql
id - bigint (PK)
trainer_id - bigint (FK -> users.id)
title - varchar(255)
slug - varchar(255) unique
description - text
thumbnail - varchar(255) nullable
category - varchar(100) nullable
price - decimal(10,2) default 0
currency - varchar(3) default 'MYR'
status - enum('draft', 'published', 'archived') default 'draft'
published_at - timestamp nullable
created_at - timestamp
updated_at - timestamp
deleted_at - timestamp nullable
```

**course_sections**
```sql
id - bigint (PK)
course_id - bigint (FK -> courses.id)
title - varchar(255)
description - text nullable
order - integer default 0
created_at - timestamp
updated_at - timestamp
```

**materials**
```sql
id - bigint (PK)
course_id - bigint (FK -> courses.id)
section_id - bigint (FK -> course_sections.id) nullable
title - varchar(255)
type - enum('video', 'pdf', 'slide', 'text')
file_path - varchar(500) nullable
file_size - bigint nullable
duration - integer nullable (seconds for videos)
order - integer default 0
is_free_preview - boolean default false
created_at - timestamp
updated_at - timestamp
```

**enrollments**
```sql
id - bigint (PK)
student_id - bigint (FK -> users.id)
course_id - bigint (FK -> courses.id)
enrolled_at - timestamp
completed_at - timestamp nullable
progress_percentage - decimal(5,2) default 0
last_accessed_at - timestamp nullable
status - enum('active', 'completed', 'expired') default 'active'
created_at - timestamp
updated_at - timestamp

unique(student_id, course_id)
```

**lesson_progress**
```sql
id - bigint (PK)
enrollment_id - bigint (FK -> enrollments.id)
material_id - bigint (FK -> materials.id)
completed - boolean default false
completed_at - timestamp nullable
time_spent - integer default 0 (seconds)
last_position - integer default 0 (for videos)
created_at - timestamp
updated_at - timestamp

unique(enrollment_id, material_id)
```

**trainer_payment_configs**
```sql
id - bigint (PK)
trainer_id - bigint (FK -> users.id)
gateway_provider - varchar(50) default 'chip'
brand_id - varchar(255) (encrypted) - CHIP Brand ID
secret_key - text (encrypted) - CHIP Secret Key
public_key - text nullable - CHIP Public Key for webhook verification
webhook_url - varchar(500) nullable
is_active - boolean default true
test_mode - boolean default true - Sandbox vs Production
created_at - timestamp
updated_at - timestamp

unique(trainer_id)
```

**transactions**
```sql
id - bigint (PK)
student_id - bigint (FK -> users.id)
trainer_id - bigint (FK -> users.id)
course_id - bigint (FK -> courses.id)
amount - decimal(10,2)
currency - varchar(3) default 'MYR'
gateway_provider - varchar(50) default 'chip'
chip_purchase_id - varchar(255) nullable - CHIP Purchase ID
chip_transaction_id - varchar(255) nullable - CHIP Transaction ID from webhook
payment_method - varchar(50) nullable - fpx, ewallet, otc
status - enum('pending', 'completed', 'failed', 'refunded', 'cancelled')
webhook_signature - text nullable - for verification
metadata - json nullable - additional CHIP data
created_at - timestamp
updated_at - timestamp

index(chip_purchase_id)
index(chip_transaction_id)
```

---

### Database Relationships

**User Relationships:**
- User hasOne TrainerProfile (if role = trainer)
- User hasOne StudentProfile (if role = student)
- User hasMany Courses (as trainer)
- User hasMany Enrollments (as student)
- User hasMany Transactions (as student)
- User hasMany Transactions (as trainer)

**Course Relationships:**
- Course belongsTo User (trainer)
- Course hasMany CourseSections
- Course hasMany Materials
- Course hasMany Enrollments
- Course hasMany Transactions

**Enrollment Relationships:**
- Enrollment belongsTo User (student)
- Enrollment belongsTo Course
- Enrollment hasMany LessonProgress

**Material Relationships:**
- Material belongsTo Course
- Material belongsTo CourseSection (nullable)
- Material hasMany LessonProgress

---

## User Interface Requirements

### UI Template & Assets

**Template:** Dreams LMS - Online Course & Education Bootstrap Template
- **Version:** 1.1.6
- **Framework:** Bootstrap 5
- **Total Pages:** 96 pre-built HTML pages
- **Location:** `dev_resources/html/html/template/`
- **Documentation:** `dev_resources/documentation/laravel.html`

**Key Features:**
- Fully responsive design (mobile, tablet, desktop)
- Modern and clean UI/UX
- Dark mode support
- RTL (Right-to-Left) support
- Multiple layout variations
- Pre-built components and widgets
- Font Awesome icons
- Summernote WYSIWYG editor for course content
- Chart.js for analytics
- DataTables for data management

**Template Assets:**
All assets have been copied to the project and include:
- CSS files (Bootstrap, plugins, custom styles)
- JavaScript files (jQuery, plugins, custom scripts)
- Images and icons
- Fonts (Font Awesome, custom fonts)
- Plugins (video players, sliders, charts, etc.)

### Design Principles
- Clean and modern interface
- Mobile-responsive design (Bootstrap 5)
- Intuitive navigation
- Consistent color scheme across all pages
- Accessible (WCAG 2.1 Level AA compliant)
- Fast loading with optimized assets

### Color Scheme (From Template)
- Primary: #FF875A (Orange)
- Secondary: #3F51B5 (Indigo)
- Success: #10B981 (Green)
- Danger: #DC3545 (Red)
- Warning: #FFC107 (Amber)
- Background: #F5F7FA (Light Gray)
- Text: #212529 (Dark)

---

### Page Layouts (Based on Dreams LMS Template)

**1. Admin Dashboard**
- Reference Template: `instructor-dashboard.html` (to be customized for admin)
- Metrics cards (total trainers, courses, students, revenue)
- Recent activity feed
- Charts (user growth, revenue trends)
- Quick actions (add trainer, view reports)

**2. Trainer Dashboard**
- Reference Template: `instructor-dashboard.html`
- My courses overview (published, drafts, enrollments)
- Revenue summary (based on `instructor-earnings.html`)
- Recent enrollments
- Quick actions (create course, upload material)

**3. Student Dashboard**
- Reference Template: `student-dashboard.html`
- Continue learning section (last accessed courses)
- My courses grid (based on `student-courses.html`)
- Recommended courses
- Learning statistics

**4. Course Listing Pages**
- Reference Templates:
  - `course-grid.html` - Grid view
  - `course-list.html` - List view
  - `course-category.html` - Category view
- Search bar with filters
- Course cards (thumbnail, title, trainer, price)
- Pagination
- Sort options dropdown

**5. Course Detail Page**
- Reference Templates:
  - `course-details.html`
  - `course-details-2.html`
- Hero section (thumbnail, title, price, enroll button)
- Course description
- What you'll learn section
- Course curriculum (expandable sections)
- Trainer info (based on `instructor-details.html`)
- Reviews section

**6. Course Player Page**
- Reference Template: `course-watch.html`
- Video/content player (main area)
- Sidebar with course content list
- Progress indicator
- Previous/Next lesson buttons
- Notes section

**7. Trainer Course Management**
- Reference Templates:
  - `instructor-course.html` - Course list
  - `instructor-course-grid.html` - Grid view
  - `add-course.html` - Create/edit course
- Course list table (title, status, enrollments, revenue)
- Actions (edit, view, delete)
- Filters (status, date)
- Bulk actions

**8. Material Upload Interface**
- Reference Template: `add-course.html` (materials section)
- Drag-and-drop upload area
- Progress indicators
- File type validation messages
- Preview after upload

**9. Payment & Checkout**
- Reference Templates:
  - `cart.html` - Shopping cart
  - `checkout.html` - Checkout page (to be integrated with CHIP)
- Course summary
- Price breakdown
- CHIP payment integration

**10. Authentication Pages**
- Reference Templates:
  - `login.html` - Login page
  - `register.html` - Registration
  - `forgot-password.html` - Password reset
- Integrated with Laravel Breeze (already installed)

**Additional Available Templates:**
- `instructor-announcements.html` - Course announcements
- `instructor-assignment.html` - Assignments management
- `instructor-certificate.html` - Certificate generation
- `instructor-earnings.html` - Revenue tracking
- `instructor-edit-profile.html` - Profile editing
- `instructor-messages.html` - Messaging system
- `instructor-notification.html` - Notifications
- `instructor-orders.html` - Order management
- `instructor-reviews.html` - Review management
- `instructor-students.html` - Student management
- `instructor-wishlist.html` - Wishlist feature
- `student-profile.html` - Student profile
- `student-courses.html` - Enrolled courses
- `student-settings.html` - Account settings

---

### Navigation Structure

**Admin Navigation:**
- Dashboard
- Trainers
- Courses
- Materials
- Students
- Reports
- Settings

**Trainer Navigation:**
- Dashboard
- My Courses
- Students
- Revenue
- Settings

**Student Navigation:**
- Browse Courses
- My Learning
- Purchase History
- Profile

---

## Security & Compliance

### Data Privacy
- GDPR compliance (for EU users)
- Privacy policy required
- Terms of service required
- Cookie consent
- Data deletion requests support

### Content Moderation
- Automated file scanning for malware
- Manual review option for admin
- Reporting system for inappropriate content
- Trainer content guidelines
- DMCA compliance

### Access Control Matrix

| Feature | Admin | Trainer | Student |
|---------|-------|---------|---------|
| View all courses | ✓ | ✗ (own only) | ✓ (published only) |
| Create course | ✓ | ✓ | ✗ |
| Edit any course | ✓ | ✗ (own only) | ✗ |
| Delete any course | ✓ | ✗ (own only) | ✗ |
| Upload materials | ✓ | ✓ (own courses) | ✗ |
| View all students | ✓ | ✗ (enrolled only) | ✗ |
| Manage trainers | ✓ | ✗ | ✗ |
| Set payment config | ✓ | ✓ (own) | ✗ |
| Enroll in course | ✓ | ✓ | ✓ |
| Access course content | ✓ | ✓ | ✓ (if enrolled) |

---

## Payment Integration

### Supported Gateway

**CHIP (Malaysia's Digital Finance Platform)**

**Why CHIP:**
- Bank Negara Malaysia approved payment gateway
- Designed specifically for Malaysian businesses
- Supports multiple local payment methods
- No setup fees
- ISO/IEC 27017:2015 and ISO/IEC 27001:2022 certified
- Fast settlements
- Developer-friendly API with comprehensive documentation

**Configuration Requirements:**
- **Brand ID:** Unique identifier for trainer's CHIP account
- **Secret Key:** API authentication key (encrypted storage)
- **Public Key:** For webhook signature verification (RSA-based)
- **Test Mode:** Sandbox environment for testing before going live

**Supported Payment Methods:**
1. **FPX (Online Banking):**
   - All major Malaysian banks
   - Real-time bank transfers
   - Instant payment confirmation

2. **E-Wallets:**
   - Touch 'n Go eWallet
   - Boost
   - ShopeePay
   - GrabPay
   - Other supported e-wallets

3. **Over-the-Counter (OTC):**
   - 7-Eleven
   - 99 Speedmart
   - Cash payment at physical locations

**Webhook Events:**
- `purchase.paid` - Payment successfully completed
- `purchase.refund` - Payment refunded
- `purchase.cancelled` - Payment cancelled by user

**Security Features:**
- RSA signature verification on all webhooks
- Encrypted credential storage
- PCI DSS compliant (via CHIP)
- SSL/TLS encrypted API communication

**API Documentation:**
- Official Docs: https://docs.chip-in.asia/chip-collect/
- PHP Library: Available via Composer
- REST API: Full RESTful interface

### Payment Flow Diagram (CHIP Integration)

```
Student                    LMS System                    CHIP
   |                           |                           |
   |--[Select Course]--------->|                           |
   |                           |                           |
   |<--[Checkout Page]---------|                           |
   |                           |                           |
   |--[Confirm Purchase]------>|                           |
   |                           |                           |
   |                           |--[Create Purchase]------->|
   |                           |  (with trainer's creds)   |
   |                           |                           |
   |                           |<--[Payment URL]-----------|
   |                           |  (purchase_id)            |
   |                           |                           |
   |<--[Redirect to CHIP]------|                           |
   |                                                       |
   |--[Choose Payment Method]--------------------------->|
   |   (FPX/E-wallet/OTC)                                 |
   |                                                       |
   |--[Complete Payment]--------------------------------->|
   |                                                       |
   |<--[Payment Confirmation]----------------------------|
   |                                                       |
   |--[Return to LMS]--------->|                           |
   |                           |                           |
   |                           |<--[Webhook: purchase.paid]|
   |                           |  (with signature)         |
   |                           |                           |
   |                           |--[Verify Signature]       |
   |                           |--[Validate Payment]       |
   |                           |--[Create Enrollment]      |
   |                           |--[Send Notifications]     |
   |                           |                           |
   |<--[Success Page]----------|                           |
   |   (Course Access)         |                           |
```

**Key Steps Explained:**

1. **Purchase Creation:** LMS creates a purchase via CHIP API using trainer's Brand ID and Secret Key
2. **Payment Redirect:** Student redirected to CHIP payment page with unique purchase ID
3. **Payment Method Selection:** Student chooses FPX, e-wallet, or OTC
4. **Payment Processing:** CHIP handles the payment securely
5. **Webhook Notification:** CHIP sends `purchase.paid` webhook with RSA signature
6. **Signature Verification:** LMS verifies webhook using trainer's Public Key
7. **Enrollment Creation:** Student automatically enrolled after successful verification
8. **Notifications:** Both student and trainer receive confirmation emails

### Refund Policy
- **Refund Window:** 7 days from purchase date
- **Refund Processing:** Initiated via CHIP API using trainer's credentials
- **Refund Method:** Returned to original payment method (FPX, e-wallet, etc.)
- **Trainer Notification:** Email alert when refund is initiated
- **Automatic Access Revocation:** Student loses course access immediately upon refund
- **Webhook Handling:** System processes `purchase.refund` webhook from CHIP
- **Transaction Update:** Transaction status updated to 'refunded' in database

---

### Trainer CHIP Account Setup Guide

**Prerequisites:**
Trainers must complete these steps before accepting payments on the platform.

**Step 1: Register CHIP Account**
1. Visit https://www.chip-in.asia/
2. Click "Sign Up" or "Register"
3. Complete business registration form
4. Verify email address
5. Complete KYC (Know Your Customer) verification
6. Wait for account approval from CHIP

**Step 2: Access Developer Portal**
1. Log in to CHIP dashboard
2. Navigate to Developer section
3. Access API credentials area

**Step 3: Obtain Credentials**
1. **Brand ID:**
   - Find in Account Settings > Developer > Brand ID
   - Copy the Brand ID value

2. **Secret Key:**
   - Generate API Secret Key from Developer Portal
   - Keep this key secure (never share publicly)
   - Copy for LMS configuration

3. **Public Key:**
   - Obtain Public Key for webhook verification
   - This is used to verify CHIP's webhook signatures

**Step 4: Configure in LMS**
1. Log in to LMS trainer account
2. Navigate to Settings > Payment Configuration
3. Enter CHIP credentials:
   - Paste Brand ID
   - Paste Secret Key
   - Paste Public Key (optional, for webhook verification)
4. Select Environment (Sandbox for testing, Production for live)
5. Save configuration
6. Test payment flow using test mode

**Step 5: Test Payment**
1. Enable "Test Mode" in LMS payment settings
2. Create a test course with price
3. Use a test student account to purchase
4. Complete payment using CHIP sandbox
5. Verify enrollment created successfully
6. Check webhook received and processed

**Step 6: Go Live**
1. Switch to "Production Mode" in LMS
2. Verify CHIP account is fully approved
3. Ready to accept real payments

**Important Notes:**
- Each trainer needs their own CHIP account
- Payments go directly to trainer's CHIP account
- Platform does not handle money directly
- Trainers responsible for their own tax reporting
- CHIP charges transaction fees (check CHIP pricing)

---

## Future Enhancements

### Phase 2 Features
1. **Certificates**
   - Auto-generated upon course completion
   - Downloadable PDF
   - Verification system

2. **Quizzes & Assessments**
   - Multiple choice questions
   - Graded assignments
   - Passing score requirements

3. **Discussion Forums**
   - Per-course forums
   - Q&A sections
   - Trainer moderation

4. **Live Classes**
   - Webinar integration (Zoom, Teams)
   - Scheduled live sessions
   - Recording availability

5. **Ratings & Reviews**
   - Student course reviews
   - Star ratings
   - Trainer response to reviews

### Phase 3 Features
1. **Mobile Apps**
   - iOS app
   - Android app
   - Offline content download

2. **Advanced Analytics**
   - Detailed learner analytics
   - Engagement metrics
   - A/B testing for course pages

3. **Affiliate System**
   - Referral links
   - Commission structure
   - Affiliate dashboard

4. **Subscription Model**
   - Monthly/annual subscriptions
   - Access to all courses
   - Tiered pricing

5. **AI Features**
   - Course recommendations
   - Auto-generated transcripts
   - Smart search

---

## Success Criteria

### MVP Launch Criteria
- [ ] All three user roles functional
- [ ] Course creation and management working
- [ ] Material upload (video, PDF, slides) working
- [ ] Payment integration (at least Stripe) working
- [ ] Enrollment and access control working
- [ ] Search and filter working
- [ ] Responsive design implemented
- [ ] Security testing passed
- [ ] Performance testing passed

### Post-Launch Metrics (3 months)
- 50+ trainers registered
- 200+ courses published
- 1,000+ student enrollments
- $10,000+ revenue processed
- < 5% refund rate
- 80%+ course completion rate
- 4+ average rating

---

## Assumptions & Constraints

### Assumptions
- Trainers have their own payment gateway accounts
- Content is in English primarily
- Trainers own rights to uploaded content
- Students have stable internet for video streaming

### Constraints
- Budget: Development within available resources
- Timeline: MVP in 3-4 months
- Team: Small development team
- Infrastructure: Shared hosting initially

### Dependencies
- Payment gateway API availability
- Video hosting/streaming infrastructure
- Email service provider
- SSL certificate

---

## Glossary

**LMS:** Learning Management System
**Trainer:** User who creates and sells courses
**Student:** User who purchases and consumes courses
**Admin:** Platform administrator
**Course:** Collection of learning materials
**Material:** Individual learning content (video, PDF, slide)
**Enrollment:** Student's access to a purchased course
**Gateway:** Payment processing service
**RBAC:** Role-Based Access Control
**CRUD:** Create, Read, Update, Delete

---

## Appendix

### API Endpoints (High-Level)

**Authentication:**
- POST /api/register
- POST /api/login
- POST /api/logout
- POST /api/password/reset

**Courses:**
- GET /api/courses (list all published)
- GET /api/courses/{id} (course details)
- POST /api/courses (create - trainer/admin)
- PUT /api/courses/{id} (update - trainer/admin)
- DELETE /api/courses/{id} (delete - trainer/admin)

**Materials:**
- POST /api/courses/{id}/materials (upload)
- GET /api/materials/{id} (get material)
- DELETE /api/materials/{id} (delete)

**Enrollments:**
- POST /api/courses/{id}/enroll (purchase/enroll)
- GET /api/my-courses (student's courses)
- GET /api/enrollments/{id}/progress (get progress)

**Payments:**
- POST /api/payment/initiate
- POST /api/payment/webhook (gateway callback)

**Admin:**
- GET /api/admin/trainers
- POST /api/admin/trainers
- GET /api/admin/students
- GET /api/admin/analytics

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | System | Initial draft |

**Approvals Required:**
- [ ] Product Owner
- [ ] Technical Lead
- [ ] Stakeholders

**Next Review Date:** TBD

---

**End of Document**

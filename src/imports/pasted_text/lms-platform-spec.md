Build a world-class, production-style Learning Management System (LMS) Portal with a modern, minimal, premium UI/UX using light gradient themes only.
The entire project must feel like a real EdTech SaaS platform similar to Coursera/Udemy/Google Classroom — clean, elegant, responsive, smooth animations, no clutter, no junk UI, and fully professional.

Tech Stack:

Frontend: React + Vite + TypeScript

Styling: Tailwind CSS + Framer Motion

Icons: Lucide React

Charts: Recharts

State Management: Context API or Zustand

Database (for now): Static JSON files/local JSON database

Routing: React Router DOM

Authentication: Mock static authentication using JSON users

Theme: ONLY light professional gradients (soft whites, blues, lavender, cyan, subtle glassmorphism)

Fully responsive for desktop, tablet, and mobile

Use reusable components and clean folder structure

Code should be scalable for future backend integration

──────────────────────────────
🎯 CORE FLOW
──────────────────────────────

Landing Page

Sign In / Sign Up

Redirect to Dashboard

Dashboard Sections:

Courses

My Courses

Tasks & Quizzes

Notifications

Activity Tracker

Profile

Admin Dashboard

Analytics

Course Progress System

Module-Based Learning

Daily Learning Reminder System

──────────────────────────────
🎨 UI/UX REQUIREMENTS
──────────────────────────────

The design must:

Look extremely modern and premium

Use soft light gradients throughout

Use glassmorphism cards subtly

Smooth page transitions using Framer Motion

Rounded corners (2xl)

Clean typography

Large whitespace

No dark theme

No unnecessary borders

Elegant hover effects

Animated progress bars

Floating gradient blobs in background

Dashboard should look enterprise-grade

Suggested color palette:

White

Soft Blue (#EAF3FF)

Lavender (#F3E8FF)

Sky Cyan (#DFF9FB)

Soft Indigo accents

Gradient buttons

Very subtle shadows

──────────────────────────────
🚀 LANDING PAGE
──────────────────────────────

Create a premium LMS landing page with:

Navbar:

Logo

Home

Courses

Features

About

Contact

Sign In button

Get Started button

Hero Section:

Large modern headline

Subtitle

CTA buttons

Animated illustration/dashboard preview

Floating stats cards

Sections:

Why Choose Us

Features Grid

Instructor Showcase

Popular Courses

Testimonials

Student Statistics

FAQ

Footer

Add smooth scroll animations.

──────────────────────────────
🔐 AUTHENTICATION
──────────────────────────────

Create:

Sign In page

Sign Up page

Forgot Password page

Remember Me

Password visibility toggle

Validation

Success/Error Toasts

Static JSON-based auth

After login:
→ redirect to Dashboard

Roles:

Student

Admin

──────────────────────────────
📊 STUDENT DASHBOARD
──────────────────────────────

Dashboard must contain:

Sidebar:

Dashboard

Courses

My Courses

Tasks

Quizzes

Certificates

Calendar

Notifications

Settings

Logout

Top Navbar:

Search bar

Notifications bell

User profile avatar

Dropdown menu

Dashboard Cards:

Total Courses

Completed Modules

Pending Tasks

Quiz Performance

Weekly Learning Hours

Certificates Earned

Charts:

Course Progress Graph

Weekly Activity Chart

Quiz Score Analytics

Widgets:

Daily Reminder

Upcoming Quiz

Continue Learning

Recent Activity Timeline

──────────────────────────────
📚 COURSES PAGE
──────────────────────────────

Display courses in premium cards.

Each course card contains:

Thumbnail

Course title

Instructor Name:
"Dr. G. Jayasuma"

Duration

Difficulty

Rating

Students enrolled

Progress bar

Enroll button

Continue Learning button

When opening a course:
Create a detailed course page with:

About course

Learning outcomes

Instructor profile

Modules list

Progress tracker

Notes section

Resources

Announcements

Discussion section

──────────────────────────────
📖 MODULE SYSTEM
──────────────────────────────

Each course contains modules.

Example:

10 modules

Each module must contain:

Video section

PDF Notes section

Assignment

Quiz

Module completion tracker

Download resources

Discussion/comments

Modules should unlock progressively.

──────────────────────────────
📝 QUIZ SYSTEM
──────────────────────────────

Each module has quizzes.

Features:

MCQs

Timer

Progress indicator

Instant scoring

Correct answer review

Leaderboard

Quiz analytics

Retake option

XP points system

──────────────────────────────
📂 NOTES/PDF SYSTEM
──────────────────────────────

Each module contains:

Downloadable PDF notes

PDF viewer modal

Bookmark notes

Mark as completed

Use static PDFs from assets folder.

──────────────────────────────
📈 MY COURSES PAGE
──────────────────────────────

Show enrolled courses with:

Progress percentage

Completed modules

Remaining modules

Last accessed

Continue Learning button

Streak tracker

Estimated completion date

Add animated circular progress indicators.

──────────────────────────────
⏰ DAILY ACTIVITY REMINDER
──────────────────────────────

Implement smart reminders:

Daily learning streak

Notification cards

Motivational messages

Upcoming deadlines

Quiz reminders

Add local notification simulation using static JSON.

──────────────────────────────
🏆 GAMIFICATION FEATURES
──────────────────────────────

Add:

XP system

Learning streaks

Achievement badges

Certificates

Level progression

Leaderboard

Completion rewards

──────────────────────────────
👨‍💼 ADMIN DASHBOARD
──────────────────────────────

Create a separate Admin Panel.

Admin features:

Overview Analytics

Total Students

Total Courses

Active Users

Enrollment Growth

Revenue mock analytics

Quiz Performance Stats

Course Completion Rates

Admin Management:

Add/Edit/Delete Courses

Add Modules

Upload Notes

Manage Quizzes

Manage Users

Send Notifications

View Reports

Analytics:

Interactive charts

Heatmaps

Progress analytics

Student engagement metrics

──────────────────────────────
📁 STATIC JSON DATABASE
──────────────────────────────

Create JSON files for:

users.json

courses.json

modules.json

quizzes.json

progress.json

notifications.json

analytics.json

Simulate backend operations using local storage and JSON.

──────────────────────────────
⚡ ADVANCED FEATURES
──────────────────────────────

Add these premium-level features:

AI-style recommendation section

Smart search

Filter/sort courses

Recently viewed courses

Continue watching

Course wishlist

Discussion forums

Dark overlay modals

Animated loading skeletons

Breadcrumb navigation

Responsive tables

Multi-step forms

Toast notification system

Empty states

Error boundaries

Lazy loading

Performance optimization

Reusable hooks

Protected routes

Role-based access

Modern file structure

──────────────────────────────
📱 RESPONSIVENESS
──────────────────────────────

The website must be:

Fully responsive

Mobile-first optimized

Tablet optimized

Desktop optimized

Smooth animations on all devices

──────────────────────────────
📂 FOLDER STRUCTURE
──────────────────────────────

Generate a professional scalable folder structure:

components

pages

layouts

routes

hooks

context

services

utils

data

assets

styles

admin

student

shared

──────────────────────────────
✨ FINAL EXPECTATIONS
──────────────────────────────

The final output should:

Feel like a premium SaaS LMS

Be visually stunning

Have clean architecture

Use reusable components

Follow industry standards

Be easy to scale to Node.js + MongoDB later

Contain production-level UI

Have smooth animations everywhere

Maintain minimal professional aesthetics

Avoid clutter completely

Include dummy static data for testing

Be deployment-ready

Generate:

Complete project structure

All pages

Reusable components

Static JSON database

Routing setup

Responsive UI

Authentication flow

Dashboard logic

Admin panel

Animations

Mock data

Full professional codebase architecture

The code quality should look like it was built by a senior frontend engineer at a top EdTech company.
# LearnHub - LMS Platform

A modern, production-ready Learning Management System built with React, TypeScript, and Tailwind CSS.

## Features

### Student Features
- **Dashboard**: Comprehensive overview of learning progress, streaks, and achievements
- **Course Catalog**: Browse and filter courses by category and difficulty
- **My Courses**: Track enrolled courses with detailed progress metrics
- **Course Details**: View modules, lessons, and learning outcomes
- **Quiz System**: Interactive quizzes with timer, scoring, and detailed answer review
- **Gamification**: XP points, levels, streaks, and achievements
- **Notifications**: Stay updated with assignments, quizzes, and achievements

### Admin Features
- **Analytics Dashboard**: Monitor platform performance with interactive charts
- **Student Metrics**: Track total students, active users, and engagement
- **Course Performance**: View completion rates and ratings
- **Revenue Tracking**: Monitor platform revenue and growth
- **Quiz Analytics**: Analyze quiz performance and student progress

### Technical Features
- **Authentication**: Secure login/signup with role-based access (Student/Admin)
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile
- **Modern UI**: Light gradient theme with glassmorphism effects
- **Smooth Animations**: Motion animations for enhanced user experience
- **Type Safety**: Built with TypeScript for robust code
- **Static Data**: JSON-based mock database for demonstration

## Tech Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router 7.13.0
- **Animations**: Motion (Framer Motion) 12.23.24
- **Charts**: Recharts 2.15.2
- **Icons**: Lucide React 0.487.0
- **Notifications**: Sonner 2.0.3
- **Language**: TypeScript

## Getting Started

### Demo Credentials

**Student Account:**
- Email: student@lms.com
- Password: password123

**Admin Account:**
- Email: admin@lms.com
- Password: admin123

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   ├── shared/          # Reusable UI components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── courses/         # Course-related components
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   ├── student/         # Student pages
│   │   ├── admin/           # Admin pages
│   │   └── landing/         # Landing page
│   ├── context/             # React context (Auth)
│   ├── data/                # Static JSON data
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── routes.tsx           # Route configuration
│   └── App.tsx              # Main app component
├── styles/
│   ├── theme.css            # Theme variables and custom styles
│   └── fonts.css            # Font imports
```

## Available Routes

### Public Routes
- `/` - Landing page
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/forgot-password` - Password reset

### Student Routes (Protected)
- `/student/dashboard` - Student dashboard
- `/student/courses` - Browse all courses
- `/student/my-courses` - Enrolled courses
- `/student/courses/:id` - Course details
- `/student/courses/:courseId/quiz/:quizId` - Take quiz
- `/student/tasks` - Tasks and assignments
- `/student/achievements` - Achievements and badges
- `/student/notifications` - Notifications
- `/student/settings` - Account settings

### Admin Routes (Protected)
- `/admin/dashboard` - Admin analytics dashboard

## Design System

### Color Palette
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Cyan (#06b6d4)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Gradient Colors
- Soft Blue: #EAF3FF
- Soft Lavender: #F3E8FF
- Soft Cyan: #DFF9FB

### Typography
- Font weights: 400 (normal), 500 (medium)
- Responsive text sizes with Tailwind utilities
- Clean, modern sans-serif font

## Features in Detail

### Course System
- 10+ modules per course
- Video lessons, PDF notes, assignments, and quizzes
- Progressive module unlocking
- Comprehensive progress tracking
- Certificate upon completion

### Quiz System
- Multiple-choice questions
- Countdown timer
- Instant scoring
- Detailed answer review with explanations
- Retake functionality
- XP rewards for passing

### Gamification
- XP points system
- User levels (1-100)
- Daily learning streaks
- Achievement badges
- Leaderboards
- Completion rewards

### Analytics (Admin)
- Monthly enrollment trends
- Category distribution
- Weekly student activity
- Course completion rates
- Quiz performance metrics
- Revenue tracking

## Future Enhancements

- Backend integration (Node.js, MongoDB)
- Real-time notifications
- Video player integration
- Discussion forums
- Live sessions
- Advanced search and filters
- Mobile app (React Native)
- Payment integration
- Certificate generation
- Email notifications

## License

This project is for demonstration purposes.

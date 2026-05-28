import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import RootLayout from './components/layout/RootLayout';
import LandingPage from './pages/landing/LandingPage';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import StudentDashboard from './pages/student/Dashboard';
import CoursesPage from './pages/student/CoursesPage';
import MyCoursesPage from './pages/student/MyCoursesPage';
import CourseDetailPage from './pages/student/CourseDetailPage';
import QuizPage from './pages/student/QuizPage';
import SettingsPage from './pages/student/SettingsPage';
import StudentVideoPlayer from './pages/student/StudentVideoPlayer';
import QuizzesListPage from './pages/student/QuizzesListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Courses from './pages/admin/Courses';
import UploadVideo from './pages/admin/UploadVideo';
import UploadPDF from './pages/admin/UploadPDF';
import UploadQuiz from './pages/admin/UploadQuiz';
import Students from './pages/admin/Students';
import AdminManageUploads from './pages/admin/AdminManageUploads';
import AdminLayout from './components/layout/AdminLayout';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'student',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'courses',
            element: (
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'courses/:courseId',
            element: (
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'courses/:courseId/quiz/:quizId',
            element: (
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'courses/:courseId/video/:videoId',
            element: (
              <ProtectedRoute>
                <StudentVideoPlayer />
              </ProtectedRoute>
            ),
          },
          {
            path: 'my-courses',
            element: (
              <ProtectedRoute>
                <MyCoursesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'quizzes',
            element: (
              <ProtectedRoute>
                <QuizzesListPage />
              </ProtectedRoute>
            ),
          },


          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />,
          },
          {
            path: 'courses',
            element: <Courses />,
          },
          {
            path: 'uploads/video',
            element: <UploadVideo />,
          },
          {
            path: 'uploads/pdf',
            element: <UploadPDF />,
          },
          {
            path: 'uploads/quiz',
            element: <UploadQuiz />,
          },
          {
            path: 'students',
            element: <Students />,
          },
          {
            path: 'manage-uploads',
            element: <AdminManageUploads />,
          },
        ],
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);

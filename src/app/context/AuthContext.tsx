import { API_BASE_URL } from '@/app/config/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import usersData from '../data/users.json';

interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  firstName: string;
  lastName: string;
  avatar: string;
  joinedDate: string;
  streak?: number;
  xp?: number;
  level?: number;
  enrolledCourses?: string[];
  completedCourses?: string[];
  certificates?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  isAuthenticated: boolean;
  localProgress: any[];
  enrollCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [localProgress, setLocalProgress] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedProgress = localStorage.getItem('lms_progress');
    if (storedProgress) {
      setLocalProgress(JSON.parse(storedProgress));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    let foundUser = usersData.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      const localUsers = JSON.parse(localStorage.getItem('lms_registered_users') || '[]');
      foundUser = localUsers.find((u: any) => u.email === email && u.password === password);
    }

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('lms_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
      
      // Update in localUsers array if exists
      const localUsers = JSON.parse(localStorage.getItem('lms_registered_users') || '[]');
      const userIndex = localUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        localUsers[userIndex] = { ...localUsers[userIndex], ...data };
        localStorage.setItem('lms_registered_users', JSON.stringify(localUsers));
      }
      toast.success('Profile updated successfully!');
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    const localUsers = JSON.parse(localStorage.getItem('lms_registered_users') || '[]');
    const existingUser = usersData.find((u) => u.email === email) || localUsers.find((u: any) => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: (usersData.length + 1).toString(),
      email,
      role: 'student',
      firstName,
      lastName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      joinedDate: new Date().toISOString().split('T')[0],
      streak: 0,
      xp: 0,
      level: 1,
      enrolledCourses: [],
      completedCourses: [],
      certificates: [],
    };

    // Save to backend so Admin can see the student!
    try {
      await fetch(`${API_BASE_URL}/api/admin/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${firstName} ${lastName}`, email })
      });
    } catch (e) {
      console.error('Failed to sync student to backend:', e);
    }

    // Save to local storage so they can login later!
    const newUserWithAuth = { ...newUser, password };
    localUsers.push(newUserWithAuth);
    localStorage.setItem('lms_registered_users', JSON.stringify(localUsers));

    setUser(newUser);
    localStorage.setItem('lms_user', JSON.stringify(newUser));
    return true;
  };

  const enrollCourse = (courseId: string) => {
    if (!user) return;
    
    // Check if already enrolled locally
    if (localProgress.find(p => p.courseId === courseId && p.userId === user.id)) {
      return;
    }

    const newProgress = {
      userId: user.id,
      courseId,
      progress: 0,
      completedModules: [],
      completedLessons: [],
      totalTimeSpent: 0,
      lastAccessed: new Date().toISOString(),
      streak: 1
    };

    // Sync to backend so Admin sees it
    try {
      fetch(`${API_BASE_URL}/api/admin/students/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, course_id: courseId })
      }).catch(err => console.error(err));
    } catch(e) {}

    const updatedProgress = [...localProgress, newProgress];
    setLocalProgress(updatedProgress);
    localStorage.setItem('lms_progress', JSON.stringify(updatedProgress));
    
    toast.success('Successfully enrolled in the course!');
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    if (!user) return;
    
    setLocalProgress(prev => {
      const updated = prev.map(p => {
        if (p.courseId === courseId && p.userId === user.id) {
          const completed = p.completedLessons || [];
          if (!completed.includes(lessonId)) {
            toast.success('Lesson completed! Progress noted.');
            return { ...p, completedLessons: [...completed, lessonId], progress: Math.min(100, p.progress + 10) };
          }
        }
        return p;
      });
      localStorage.setItem('lms_progress', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        signup,
        isAuthenticated: !!user,
        localProgress,
        enrollCourse,
        markLessonComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

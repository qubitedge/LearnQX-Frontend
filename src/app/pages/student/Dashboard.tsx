import { API_BASE_URL } from '@/app/config/api';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, Clock, Flame, Target } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import notificationsData from '../../data/notifications.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simple SVG sparkline component for the stat cards
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 30;
  const width = 80;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`-2 -2 ${width + 4} ${height + 4}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function Dashboard() {
  const { user, localProgress } = useAuth();
  const [coursesData, setCoursesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        if (res.ok) {
          const data = await res.json();
          setCoursesData(data);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const userProgress = localProgress.filter((p) => String(p.userId) === String(user?.id) && coursesData.some(c => String(c.id) === String(p.courseId)));
  const totalCourses = userProgress.length;
  const completedModules = userProgress.reduce((sum, p) => sum + (p.completedModules?.length || 0), 0);
  const avgProgress = Math.round(userProgress.reduce((sum, p) => sum + (p.progress || 0), 0) / (totalCourses || 1));
  const totalHours = Math.round(userProgress.reduce((sum, p) => sum + (p.totalTimeSpent || 0), 0) / 60);

  const recentNotifications = coursesData.slice(-3).map(c => ({
    id: c.id,
    title: 'System',
    time: 'Just now',
    message: `New course '${c.title}' is available for enrollment.`
  }));

  return (
    <div className="flex min-h-screen bg-pink-50/30 font-sans">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64 relative">
        {/* Soft background gradient blobs like the design */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-pink-100/80 via-fuchsia-50/80 to-purple-100/80 pointer-events-none -z-10" />

        <StudentHeader />

        <main className="p-8 space-y-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back, {user?.firstName}! <span className="inline-block origin-bottom-right hover:animate-waving-hand">👋</span>
            </h1>
            <p className="text-sm text-gray-500">Here's what's happening with your learning today</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Enrolled Courses */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-between">
              <div className="flex gap-4 items-center">
                 <div className="p-3.5 bg-gradient-to-br from-[#7b61ff] to-[#9d4edd] rounded-2xl shadow-inner text-white">
                   <BookOpen className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-sm text-gray-500 font-medium mb-0.5">Enrolled Courses</h3>
                   <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-gray-900">{totalCourses}</span>
                   </div>
                   <p className="text-xs font-semibold text-emerald-500 mt-1">+2 this month</p>
                 </div>
              </div>
              <Sparkline data={[1, 2, 2, 3, 4, 4, 6]} color="#10b981" />
            </motion.div>

            {/* Completed Modules */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-between">
              <div className="flex gap-4 items-center">
                 <div className="p-3.5 bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] rounded-2xl shadow-inner text-white">
                   <CheckCircle className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-sm text-gray-500 font-medium mb-0.5">Completed Modules</h3>
                   <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-gray-900">{completedModules}</span>
                   </div>
                   <p className="text-xs font-semibold text-emerald-500 mt-1">{avgProgress}% average</p>
                 </div>
              </div>
              <Sparkline data={[2, 3, 5, 4, 7, 8, 12]} color="#8b5cf6" />
            </motion.div>

            {/* Learning Hours */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-between">
              <div className="flex gap-4 items-center">
                 <div className="p-3.5 bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] rounded-2xl shadow-inner text-white">
                   <Clock className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-sm text-gray-500 font-medium mb-0.5">Learning Hours</h3>
                   <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-gray-900">{totalHours}h</span>
                   </div>
                   <p className="text-xs font-semibold text-emerald-500 mt-1">+12h this week</p>
                 </div>
              </div>
              <Sparkline data={[1, 3, 2, 5, 4, 7, 6]} color="#3b82f6" />
            </motion.div>

          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Feed Sidebar replacing Weekly Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Recent Activity Feed</h3>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
                  {coursesData.filter(c => localProgress.some(p => String(p.userId) === String(user?.id) && String(p.courseId) === String(c.id))).slice(0, 5).map((course, idx) => (
                    <div key={course.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx % 2 === 0 ? 'bg-purple-300' : 'bg-blue-300'}`} />
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        You enrolled in the course: <strong>{course.title}</strong> by {course.instructor_name}
                      </p>
                    </div>
                  ))}
                  {userProgress.length === 0 && (
                    <div className="relative pl-6">
                      <p className="text-sm text-gray-500 italic">No recent activity. Enroll in a course to see it here!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Notifications */}
            <div className="space-y-6">

              {/* Recent Notifications */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Recent Notifications</h3>
                  <div className="space-y-4">
                    {recentNotifications.map((notif: any) => (
                      <div key={notif.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-white shadow-sm">
                          <BookOpen className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                             <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Footer inside the app */}
          <div className="pt-6 border-t border-gray-200/60 flex justify-between text-[11px] text-gray-500 font-medium mt-12 pb-4">
            <p>Copyright © 2024 LearnX Inc.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-600">Legal</a>
              <a href="#" className="hover:text-indigo-600">Support</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

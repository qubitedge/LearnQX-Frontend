import { API_BASE_URL } from '@/app/config/api';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Clock, BookOpen, TrendingUp, Trophy, Plus, ChevronDown, MessageCircle, Users, Presentation } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function MyCoursesPage() {
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

  const userProgress = localProgress.filter((p) => p.userId === user?.id);

  const enrolledCourses = userProgress.map((progress) => {
    const course = coursesData.find((c) => c.id.toString() === progress.courseId.toString());
    return { ...course, progress };
  }).filter((c) => c.id);

  return (
    <div className="flex min-h-screen bg-pink-50/30 font-sans">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64 relative">
        {/* Soft background gradient blobs like the design */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-pink-100/80 via-fuchsia-50/80 to-purple-100/80 pointer-events-none -z-10" />

        <StudentHeader />

        <main className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">My Courses</h1>
              <p className="text-sm text-gray-500">Track your learning progress</p>
            </div>
            <Link to="/student/courses">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#7b61ff] text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg transition-all">
                <BookOpen className="w-4 h-4" />
                Browse More Courses
              </button>
            </Link>
          </div>

          {/* Quick Add */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Quick Add
            </button>
            <span className="text-sm text-gray-500">Quick Add: Course via URL</span>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-[#7b61ff] to-[#9d4edd] rounded-xl shadow-inner text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">Total Courses: {enrolledCourses.length}</h3>
                <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="text-emerald-500">▲</span> 10% Trending
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl shadow-inner text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                  Average Progress: {Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress?.progress || 0), 0) / (enrolledCourses.length || 1))}%
                </h3>
                <p className="text-[11px] text-gray-500 leading-tight">(Projected to 25% with 2 more modules)</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-inner text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                  Total Hours: {Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress?.totalTimeSpent || 0), 0) / 60)}h
                </h3>
                <p className="text-[11px] text-gray-500 leading-tight">(Hover for detail: ML theory: 0h Programming: 0h)</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-inner text-white">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">Achievement Badges: 0</h3>
                <p className="text-[11px] text-gray-500 leading-tight">(Explore goals)</p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Your Enrolled Courses</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Courses List */}
              <div className="lg:col-span-2 space-y-6">
                {enrolledCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                  >
                    <Link to={`/student/courses/${course.id}`} className="block">
                      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6">
                          <img
                            src={course.thumbnail_image || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={course.title}
                            className="w-full md:w-40 h-40 rounded-2xl object-cover shadow-sm"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-snug">{course.title}</h3>
                                <span className="text-xs font-bold text-gray-700 bg-yellow-100 px-2 py-1 rounded-md">{course.progress?.progress || 0}%</span>
                              </div>
                            <p className="text-sm text-gray-500 mb-4">by {course.instructor}</p>
                            
                            {/* Progress Bar Area */}
                            <div className="relative w-full h-2 bg-gray-100 rounded-full mb-6 mt-2">
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                                style={{ width: `${course.progress?.progress || 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                              Module Details <ChevronDown className="w-3 h-3 ml-1" />
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 bg-cyan-50/50 border border-cyan-100 rounded-full text-xs font-bold text-cyan-800 hover:bg-cyan-100/50 transition-colors">
                              <MessageCircle className="w-3 h-3" /> Live Peer Chat
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                              <Users className="w-3 h-3" /> Meet with Mentor
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-200 rounded-full text-xs font-bold text-purple-900 hover:shadow-sm transition-all ml-auto">
                              <Presentation className="w-3 h-3" /> Project Showcase
                            </button>
                          </div>

                          {/* Bottom Stats */}
                          <div className="flex justify-between items-end text-sm">
                             <div>
                                <p className="text-gray-500 text-xs mb-1">Completed Modules</p>
                                <p className="font-medium text-gray-900">{course.progress?.completedModules?.length || 0} / {course.modules || 10}</p>
                             </div>
                             <div>
                                <p className="text-gray-500 text-[11px] mb-1">Module 1: <span className="text-orange-500 font-medium">(Pending)</span></p>
                                <p className="text-gray-500 text-[11px]">Module 2: <span className="text-emerald-500 font-medium">(Available)</span></p>
                             </div>
                             <div>
                                <p className="text-gray-500 text-xs mb-1">Time Spent</p>
                                <p className="font-medium text-gray-900">
                                  {Math.round(((course.duration ? parseInt(course.duration) : 10) * 60 * (course.progress?.progress || 0) / 100) / 60)}h 
                                  {Math.round(((course.duration ? parseInt(course.duration) : 10) * 60 * (course.progress?.progress || 0) / 100) % 60)}m
                                </p>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-gray-900 text-base hover:text-indigo-600 transition-colors cursor-pointer">{course.progress?.progress || 0}%</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </Link>
                  </motion.div>
                ))}

                {enrolledCourses.length === 0 && (
                  <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-white">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-500 text-sm mb-6">Start your learning journey by enrolling in a course</p>
                    <Link to="/student/courses">
                      <button className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-md">
                        Browse Courses
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Feed Sidebar */}
              <div className="lg:col-span-1">
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                   <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white h-full">
                     <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Enrolled Courses Feed</h3>
                     
                     <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
                        <div className="relative pl-6">
                           <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-300 border-2 border-white shadow-sm" />
                           <p className="text-sm text-gray-700 leading-relaxed font-medium">
                             John.D joined 'Python for Data Science' study group
                           </p>
                        </div>
                        
                        <div className="relative pl-6">
                           <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-300 border-2 border-white shadow-sm" />
                           <p className="text-sm text-gray-700 leading-relaxed font-medium">
                             A new module 'Deep Learning Optimizers' is now available in ML
                           </p>
                        </div>
                     </div>
                   </div>
                 </motion.div>
              </div>

            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200/60 flex justify-center text-[11px] text-gray-500 font-medium mt-12 pb-4">
            <p>Copyright © 2024 LearnX Inc. All rights reserved.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

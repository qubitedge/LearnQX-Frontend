import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, Star, Users, Clock, BookOpen, ChevronDown, LayoutGrid, BarChart2, MonitorPlay } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import progressData from '../../data/progress.json';
import { useAuth } from '../../context/AuthContext';

export default function CoursesPage() {
  const { user, localProgress } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();
        // Map backend keys to frontend expected keys
        const mappedData = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          thumbnail: c.thumbnail_image,
          category: c.category,
          difficulty: c.skill_level,
          instructor: c.instructor_name,
          rating: 4.8, // default or calculated
          studentsEnrolled: 1200, // default
          duration: c.duration,
          modules: 10
        }));
        setCourses(mappedData);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const allProgress = [...progressData, ...localProgress];

  const categories = ['All', 'Technology', 'Development', 'Data Science', 'Design', 'Cloud', 'Mobile'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="flex min-h-screen bg-pink-50/30 font-sans">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64 relative">
        {/* Soft background gradient blobs like the design */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-pink-100/80 via-fuchsia-50/80 to-purple-100/80 pointer-events-none -z-10" />

        <StudentHeader />

        <main className="p-8 space-y-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Explore Courses</h1>
            <p className="text-sm text-gray-500">Discover new skills and advance your career</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {/* Fake dropdowns matching the mockup pills */}
              <div className="relative">
                 <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-3 bg-indigo-50/50 backdrop-blur-md border border-indigo-100 text-indigo-900 font-bold text-xs uppercase tracking-wider rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:bg-indigo-100/50 transition-colors"
                  >
                    <option value="All">All Categories</option>
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
              </div>

              <div className="relative">
                 <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-3 bg-purple-50/50 backdrop-blur-md border border-purple-100 text-purple-900 font-bold text-xs uppercase tracking-wider rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-sm hover:bg-purple-100/50 transition-colors"
                  >
                    <option value="All">All Levels</option>
                    {difficulties.filter(d => d !== 'All').map((diff) => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                  <BarChart2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 pointer-events-none" />
              </div>

              <div className="relative">
                 <select
                    className="appearance-none pl-10 pr-10 py-3 bg-pink-50/50 backdrop-blur-md border border-pink-100 text-pink-900 font-bold text-xs uppercase tracking-wider rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer shadow-sm hover:bg-pink-100/50 transition-colors"
                  >
                    <option value="All">All Formats</option>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                  </select>
                  <MonitorPlay className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => {
              const userCourseProgress = allProgress.find((p) => p.userId === user?.id && p.courseId === course.id);
              
              return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="h-full p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col relative">
                  {userCourseProgress && (
                     <div className="absolute top-6 left-6 z-10 bg-indigo-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                       ENROLLED
                     </div>
                  )}

                  <div className="aspect-[4/3] rounded-2xl bg-gray-100 mb-5 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-2 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{course.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">by {course.instructor}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 mt-auto">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {(course.studentsEnrolled / 1000).toFixed(1)}K
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </div>
                    </div>

                    <Link to={`/student/courses/${course.id}`} className="mt-auto">
                      <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#7b61ff] to-[#9d4edd] text-white text-sm font-semibold shadow-md shadow-purple-200 hover:shadow-lg transition-all">
                        {userCourseProgress ? "Continue Learning" : "View Course"}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 mb-6 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                <BookOpen className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
          
          <div className="pt-6 border-t border-gray-200/60 flex justify-center text-[11px] text-gray-500 font-medium mt-12 pb-4">
            <p>Copyright © 2024 LearnX Inc. All rights reserved.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor_name: string;
  category: string;
  duration: string;
  skill_level: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const courseData = {
      title: formData.get('title'),
      instructor_name: formData.get('instructor_name'),
      description: formData.get('description'),
      category: formData.get('category'),
      duration: formData.get('duration'),
      skill_level: formData.get('skill_level'),
      thumbnail_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80"
    };

    try {
      if (editingCourse) {
        await fetch(`${API_BASE_URL}/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
      } else {
        await fetch(`${API_BASE_URL}/api/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData)
        });
      }
      setIsAddModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsAddModalOpen(true);
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Course Management</h1>
          <p className="text-sm text-gray-500">Create, edit, and manage your courses</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#7b61ff] to-[#9d4edd] text-white px-6 py-3 rounded-full hover:shadow-lg shadow-md shadow-purple-200 transition-all font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Course
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="p-6 border-b border-gray-100/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7b61ff] text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Info</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-snug">{course.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.duration}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                      course.skill_level === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      course.skill_level === 'Intermediate' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {course.skill_level}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">{course.instructor_name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(course)} className="p-2 text-[#7b61ff] hover:bg-purple-50 rounded-xl transition-colors border border-transparent hover:border-purple-100 shadow-sm hover:shadow">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 shadow-sm hover:shadow">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                    No courses found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-white"
          >
            <form onSubmit={handleCreateCourse}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingCourse(null); }} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Course Title</label>
                    <input name="title" defaultValue={editingCourse?.title || ''} required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900" placeholder="e.g. Python Basics" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Instructor Name</label>
                    <input name="instructor_name" defaultValue={editingCourse?.instructor_name || ''} required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900" placeholder="e.g. John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
                  <textarea name="description" defaultValue={editingCourse?.description || ''} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900 h-28 resize-none" placeholder="Course description..."></textarea>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category</label>
                    <select name="category" defaultValue={editingCourse?.category || 'Technology'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900">
                      <option>Technology</option>
                      <option>Development</option>
                      <option>Data Science</option>
                      <option>Design</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Duration</label>
                    <input name="duration" defaultValue={editingCourse?.duration || ''} required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900" placeholder="e.g. 10 weeks" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Skill Level</label>
                    <select name="skill_level" defaultValue={editingCourse?.skill_level || 'Beginner'} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingCourse(null); }} className="px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-[#7b61ff] to-[#9d4edd] text-white font-bold text-sm rounded-full hover:shadow-lg shadow-md shadow-purple-200 transition-all">
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

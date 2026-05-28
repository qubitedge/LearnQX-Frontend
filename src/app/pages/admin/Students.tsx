import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, User, BookOpen, Award, Edit2, Trash2 } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/students`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      // Optioanlly call backend delete endpoint here
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Student Monitoring</h1>
          <p className="text-sm text-gray-500">Track student progress, enrollments, and quiz scores</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="p-6 border-b border-gray-100/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
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
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Quiz Scores</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {student.enrolled_courses.length > 0 ? (
                      <div className="space-y-2">
                        {student.enrolled_courses.map((course: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-700">{course.title}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              course.progress === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}>
                              {course.progress}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No enrollments</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {student.quiz_scores.length > 0 ? (
                      <div className="space-y-2">
                        {student.quiz_scores.map((quiz: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Award className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-700">{quiz.quiz}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              quiz.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              quiz.score >= 50 ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {quiz.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No quizzes taken</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Student">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500 text-sm">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

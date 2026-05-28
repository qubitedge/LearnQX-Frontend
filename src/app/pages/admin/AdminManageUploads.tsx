import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, FileText, PlayCircle, Loader2, Award } from 'lucide-react';

export default function AdminManageUploads() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
          if (data.length > 0) setSelectedCourseId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchModules(selectedCourseId);
    } else {
      setModules([]);
    }
  }, [selectedCourseId]);

  const fetchModules = async (courseId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      }
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePDF = async (pdfId: number) => {
    if (!window.confirm('Are you sure you want to delete this PDF?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/uploads/pdf/${pdfId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchModules(selectedCourseId);
      } else {
        alert('Failed to delete PDF');
      }
    } catch (err) {
      console.error('Failed to delete PDF:', err);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!window.confirm('Are you sure you want to delete this Video?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/uploads/video/${videoId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchModules(selectedCourseId);
      } else {
        alert('Failed to delete Video');
      }
    } catch (err) {
      console.error('Failed to delete Video:', err);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!window.confirm('Are you sure you want to delete this Quiz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchModules(selectedCourseId);
      } else {
        alert('Failed to delete Quiz');
      }
    } catch (err) {
      console.error('Failed to delete Quiz:', err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Manage Uploads</h1>
        <p className="text-sm text-gray-500">View and delete uploaded notes and videos across all modules</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Select Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#7b61ff] animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-gray-500 font-medium">No modules or uploads found for this course.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {modules.map((mod: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              key={mod.id} 
              className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
            >
              <div className="bg-gradient-to-r from-gray-50/80 to-white/80 px-6 py-5 border-b border-gray-100/50">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{mod.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                {mod.pdfs.length === 0 && mod.videos.length === 0 && mod.quizzes?.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No files or quizzes in this module.</p>
                )}
                
                {mod.pdfs.map((pdf: any) => (
                  <div key={`pdf-${pdf.id}`} className="flex items-center justify-between p-4 bg-white/50 border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center border border-white shadow-sm group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{pdf.title}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">PDF Document</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePDF(pdf.id)} className="p-2.5 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-xl transition-all shadow-sm hover:shadow">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {mod.videos.map((video: any) => (
                  <div key={`vid-${video.id}`} className="flex items-center justify-between p-4 bg-white/50 border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700 rounded-xl flex items-center justify-center border border-white shadow-sm group-hover:scale-105 transition-transform">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{video.title}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Video Lecture</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteVideo(video.id)} className="p-2.5 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-xl transition-all shadow-sm hover:shadow">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {mod.quizzes?.map((quiz: any) => (
                  <div key={`quiz-${quiz.id}`} className="flex items-center justify-between p-4 bg-white/50 border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 rounded-xl flex items-center justify-center border border-white shadow-sm group-hover:scale-105 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{quiz.title}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Quiz Assessment ({quiz.questions_count} questions)</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2.5 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-xl transition-all shadow-sm hover:shadow">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

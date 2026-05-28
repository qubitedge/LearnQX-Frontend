import { API_BASE_URL } from '@/app/config/api';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, X, Film, CheckCircle } from 'lucide-react';

export default function UploadVideo() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<any[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();
        setCourses(data);
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
      setSelectedModuleId('');
    }
  }, [selectedCourseId]);

  const fetchModules = async (courseId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
        if (data.length > 0 && !selectedModuleId) {
          setSelectedModuleId(data[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    }
  };

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim() || !selectedCourseId) return;
    setIsCreatingModule(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: selectedCourseId, title: newModuleTitle })
      });
      if (res.ok) {
        const newMod = await res.json();
        await fetchModules(selectedCourseId);
        setSelectedModuleId(newMod.id.toString());
        setNewModuleTitle('');
      }
    } catch (err) {
      console.error('Failed to create module', err);
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type.includes('video/')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid video file (MP4, AVI, etc.)');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!selectedCourseId || !selectedModuleId) {
      alert('Please select a course and a module before uploading.');
      return;
    }
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', (document.getElementById('titleInput') as HTMLInputElement)?.value || file.name);
    formData.append('description', (document.getElementById('descInput') as HTMLTextAreaElement)?.value || '');
    formData.append('module_id', selectedModuleId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/uploads/video`, {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setFile(null);
          setUploadProgress(0);
          alert('Video uploaded successfully!');
        }, 500);
      } else {
        alert('Failed to upload Video');
        setIsUploading(false);
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Upload Lecture Videos</h1>
        <p className="text-sm text-gray-500">Upload and organize video content for your courses</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Upload Media</h2>
            
            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
                  dragActive ? 'border-[#7b61ff] bg-purple-50/50' : 'border-gray-200 hover:bg-gray-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Drag & drop your video here</h3>
                <p className="text-xs text-gray-500 mb-8 font-medium">or click to browse from your computer (MP4, AVI, MOV)</p>
                <input 
                  ref={inputRef}
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  onChange={handleChange}
                />
                <button 
                  onClick={() => inputRef.current?.click()}
                  className="bg-white border border-gray-200 text-gray-700 font-bold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-sm"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-3xl p-6 bg-white/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm">
                      <Film className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{file.name}</h4>
                      <p className="text-xs font-medium text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button onClick={() => setFile(null)} className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 border border-gray-100 rounded-full transition-colors shadow-sm">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="text-[#7b61ff]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200/50">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#7b61ff] to-[#d946ef] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Video Details</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Course</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Module</label>
                <div className="flex gap-2">
                  <select 
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900"
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    disabled={!selectedCourseId}
                  >
                    <option value="">Select a module</option>
                    {modules.map(mod => (
                      <option key={mod.id} value={mod.id}>{mod.title}</option>
                    ))}
                  </select>
                </div>
                {selectedCourseId && (
                  <div className="flex gap-2 mt-3">
                    <input 
                      type="text" 
                      placeholder="New module title..." 
                      className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                    />
                    <button 
                      onClick={handleCreateModule}
                      disabled={isCreatingModule || !newModuleTitle.trim()}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      {isCreatingModule ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Lecture Title</label>
                <input id="titleInput" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900" placeholder="Enter title" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
                <textarea id="descInput" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900 h-28 resize-none" placeholder="Brief description of the lecture..."></textarea>
              </div>
              <button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  !file || isUploading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                    : 'bg-gradient-to-r from-[#7b61ff] to-[#9d4edd] text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01]'
                }`}
              >
                {isUploading ? 'Uploading...' : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    Publish Lecture
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

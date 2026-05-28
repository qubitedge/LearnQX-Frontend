import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadQuiz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<any[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  
  const [quizTitle, setQuizTitle] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [questions, setQuestions] = useState<any[]>([
    { question: '', options: ['', '', '', ''], correct_answer: '' }
  ]);
  const [isPublishing, setIsPublishing] = useState(false);

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
        toast.success('Module created successfully');
      }
    } catch (err) {
      console.error('Failed to create module', err);
      toast.error('Failed to create module');
    } finally {
      setIsCreatingModule(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct_answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].question = text;
    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, val: string) => {
    const updated = [...questions];
    updated[qIndex].correct_answer = val;
    setQuestions(updated);
  };

  const handlePublish = async () => {
    if (!selectedCourseId) {
      toast.error('Please select a course first.');
      return;
    }
    if (!selectedModuleId) {
      toast.error('Please select or create a module first.');
      return;
    }
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is missing text.`);
        return;
      }
      if (q.options.some((opt: string) => !opt.trim())) {
        toast.error(`Question ${i + 1} has empty options.`);
        return;
      }
      if (!q.correct_answer) {
        toast.error(`Question ${i + 1} needs a correct answer selected.`);
        return;
      }
    }

    setIsPublishing(true);
    try {
      const formattedQuestions = questions.map(q => ({
        question: q.question,
        options: JSON.stringify(q.options),
        correct_answer: q.correct_answer
      }));

      const res = await fetch(`${API_BASE_URL}/api/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module_id: selectedModuleId,
          title: quizTitle,
          timer_minutes: timerMinutes,
          questions: formattedQuestions
        })
      });

      if (res.ok) {
        toast.success('Quiz published successfully!');
        setQuizTitle('');
        setQuestions([{ question: '', options: ['', '', '', ''], correct_answer: '' }]);
      } else {
        toast.error('Failed to publish quiz.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error publishing quiz.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Quiz</h1>
        <p className="text-gray-500 mt-2">Publish interactive assessments to modules.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Course/Module Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h3 className="font-semibold text-gray-900">Placement Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Course</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Module</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors"
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

            <div className="pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Or Create New Module</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="New module title..." 
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  disabled={!selectedCourseId}
                />
                <button 
                  onClick={handleCreateModule}
                  disabled={!selectedCourseId || isCreatingModule || !newModuleTitle.trim()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isCreatingModule ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h3 className="font-semibold text-gray-900">Quiz Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quiz Title</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g. Midterm Assessment"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time Limit (Minutes)</label>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <input 
                  type="number" 
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Quiz Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#7b61ff]" />
                Questions Builder
              </h3>
              <button 
                onClick={addQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#7b61ff] bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4 relative group">
                  {questions.length > 1 && (
                    <button 
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Question {qIndex + 1}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#7b61ff]"
                      placeholder="Enter question text..."
                      value={q.question}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correct_answer === opt && opt !== ''}
                          onChange={() => setCorrectAnswer(qIndex, opt)}
                          className="w-4 h-4 text-[#7b61ff] focus:ring-[#7b61ff]"
                        />
                        <input 
                          type="text" 
                          className={`w-full px-3 py-2 bg-white border ${q.correct_answer === opt && opt !== '' ? 'border-[#7b61ff] bg-purple-50/30' : 'border-gray-200'} rounded-lg focus:outline-none focus:border-[#7b61ff] text-sm`}
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#4f46e5] to-[#7b61ff] text-white font-semibold rounded-full shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-70"
              >
                {isPublishing ? 'Publishing...' : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Publish Quiz to Module
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

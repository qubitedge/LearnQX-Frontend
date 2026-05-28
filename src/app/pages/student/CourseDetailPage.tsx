import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  BookOpen,
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
  Award,
  Target,
} from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import ProgressBar from '../../components/shared/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import progressData from '../../data/progress.json';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const { user, localProgress, enrollCourse, markLessonComplete } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();
        const found = data.find((c: any) => c.id.toString() === courseId);
        if (found) {
          setCourse({
            id: found.id.toString(),
            title: found.title,
            description: found.description,
            thumbnail: found.thumbnail_image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
            instructor: found.instructor_name,
            difficulty: found.skill_level || 'Beginner',
            duration: found.duration || 'N/A',
            category: found.category || 'General',
            rating: 4.8,
            studentsEnrolled: 1200,
            tags: [found.category],
            instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            price: 49.99,
            totalLessons: 10
          });
        }
        
        // Fetch real modules for this course
        const modRes = await fetch(`${API_BASE_URL}/api/modules/${courseId}`);
        if (modRes.ok) {
          const mods = await modRes.json();
          // Transform backend module structure to frontend expected structure
          const transformedMods = mods.map((m: any) => {
            const lessons = [
              ...m.videos.map((v: any, index: number) => ({
                id: `vid-${v.id}`,
                title: v.title,
                type: 'video',
                duration: `${10 + (index * 2)}:${(15 + (index * 13)) % 60 < 10 ? '0' : ''}${(15 + (index * 13)) % 60}`, // generate a pseudo-random duration like 12:45
                file_path: `${API_BASE_URL}/static/uploads/videos/${v.file_path}` // Add full path if it's just filename
              })),
              ...m.pdfs.map((p: any) => ({
                id: `pdf-${p.id}`,
                title: p.title,
                type: 'document',
                duration: '10 mins read',
                file_path: `${API_BASE_URL}/static/uploads/pdfs/${p.file_path}`
              }))
            ];
            return {
              ...m,
              quiz: m.quizzes && m.quizzes.length > 0 ? {
                id: m.quizzes[0].id,
                title: m.quizzes[0].title,
                questions: m.quizzes[0].questions_count || 5,
                duration: m.quizzes[0].timer_minutes || 10
              } : null,
              unlocked: true,
              lessons
            };
          });
          setModules(transformedMods);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, [courseId]);
  
  const allProgress = [...progressData, ...localProgress];
  const userProgress = allProgress.find((p) => p.userId === user?.id && p.courseId === courseId);

  if (!course) {
    return <div>Loading course details...</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'modules', label: 'Modules' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'notes', label: 'Notes' },
  ];

  const allNotes = modules.flatMap(m => 
    m.lessons.filter((l: any) => l.type === 'document')
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64">
        <StudentHeader />

        <main className="p-6 space-y-6">
          <Link to="/student/courses" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card gradient>
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-4 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary">{course.category}</Badge>
                  <Badge
                    variant={
                      course.difficulty === 'Beginner'
                        ? 'success'
                        : course.difficulty === 'Intermediate'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {course.difficulty}
                  </Badge>
                </div>

                <h1 className="text-3xl text-gray-900 mb-3">{course.title}</h1>

                <div className="flex items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5" />
                    <span>{course.studentsEnrolled.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-5 h-5" />
                    <span>{modules.length} modules</span>
                  </div>
                </div>

                {userProgress && (
                  <div className="mb-6 p-4 bg-indigo-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-700">Your Progress</p>
                      <p className="text-sm text-indigo-600">{userProgress.progress}%</p>
                    </div>
                    <ProgressBar value={userProgress.progress} showLabel={false} />
                  </div>
                )}

                <div className="border-b border-gray-200 mb-6">
                  <div className="flex gap-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 transition-colors ${
                          activeTab === tab.id
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg text-gray-900 mb-3">About this course</h3>
                      <p className="text-gray-600">{course.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg text-gray-900 mb-3">What you'll learn</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {["Understand core concepts", "Build practical projects"].map((outcome, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700">{outcome}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag: string) => (
                          <Badge key={tag} variant="info">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'modules' && (
                  <div className="space-y-6">
                    {!userProgress && (
                      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                        <p className="text-sm text-indigo-700 font-medium flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Please enroll in the course to access the modules and lessons.
                        </p>
                      </div>
                    )}
                    {modules.map((module, idx) => (
                      <Card key={idx} className="overflow-hidden border border-gray-100">
                        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-indigo-600">Module {idx + 1}</span>
                              {module.completed && <Badge variant="success" size="sm">Completed</Badge>}
                            </div>
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                          </div>
                        </div>

                        {(module.unlocked && userProgress) ? (
                          <div className="space-y-2 p-4">
                            {module.lessons.map((lesson: any) => {
                              const isCompleted = userProgress?.completedLessons?.includes(lesson.id);
                              return (
                                <div key={lesson.id}>
                                  {lesson.type === 'video' ? (
                                    <Link
                                      to={`/student/courses/${courseId}/video/${lesson.id}`}
                                      className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                      {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <PlayCircle className="w-5 h-5 text-indigo-600" />
                                      )}
                                      <div className="flex-1">
                                        <p className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{lesson.title}</p>
                                        <p className="text-xs text-gray-600">{lesson.duration}</p>
                                      </div>
                                    </Link>
                                  ) : (
                                    <a
                                      href={lesson.file_path}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={() => {
                                        if (courseId) {
                                          markLessonComplete(courseId, lesson.id);
                                        }
                                      }}
                                      className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                      {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                      )}
                                      <div className="flex-1">
                                        <p className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{lesson.title}</p>
                                        <p className="text-xs text-gray-600">{lesson.duration}</p>
                                      </div>
                                    </a>
                                  )}
                                </div>
                              );
                            })}

                            {module.quiz && (
                              <Link to={`/student/courses/${courseId}/quiz/${module.quiz.id}`}>
                                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer">
                                  <Award className="w-5 h-5 text-indigo-600" />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">{module.quiz.title}</p>
                                    <p className="text-xs text-gray-600">
                                      {module.quiz.questions} questions • {module.quiz.duration} min
                                    </p>
                                  </div>
                                  <Target className="w-5 h-5 text-indigo-600" />
                                </div>
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-gray-500 bg-gray-50/50">
                            <Lock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-medium">Content Locked</p>
                            <p className="text-xs mt-1">Enroll in the course to unlock this module</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-20 h-20 rounded-full bg-indigo-100"
                      />
                      <div>
                        <h3 className="text-xl text-gray-900 mb-1">{course.instructor}</h3>
                        <p className="text-gray-600 mb-3">Expert Instructor & Industry Professional</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>4.9 Instructor Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>45,000+ Students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>12 Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      {course.instructor} is a renowned expert in the field with over 15 years of industry experience.
                      They have worked with leading tech companies and have a passion for teaching and mentoring students.
                      Their courses are known for practical, real-world applications and hands-on learning approach.
                    </p>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <h3 className="text-lg text-gray-900 mb-4">Course Notes & Materials</h3>
                    {allNotes.length === 0 ? (
                      <p className="text-gray-500">No notes available for this course.</p>
                    ) : (
                      <div className="grid gap-4">
                        {allNotes.map((note: any, idx: number) => (
                          <a
                            key={idx}
                            href={note.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                          >
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{note.title}</h4>
                              <p className="text-sm text-gray-500">PDF Document</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card gradient>
                {userProgress ? (
                  <>
                    <h3 className="text-lg text-gray-900 mb-4">Continue Learning</h3>
                    <Button variant="gradient" fullWidth>
                      <PlayCircle className="w-5 h-5" />
                      Resume Course
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="gradient" fullWidth onClick={() => {
                      if (courseId) {
                        enrollCourse(courseId);
                      }
                    }}>
                      Enroll Now
                    </Button>
                  </>
                )}
              </Card>

              <Card gradient>
                <h3 className="text-lg text-gray-900 mb-4">Course Includes</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-indigo-600" />
                    <span>{course.totalLessons} video lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

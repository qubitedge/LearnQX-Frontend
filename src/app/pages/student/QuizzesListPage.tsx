import { API_BASE_URL } from '@/app/config/api';
import { Link } from 'react-router';
import { Target, Clock, Award, PlayCircle, CheckCircle, FileText } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { useState, useEffect } from 'react';

export default function QuizzesListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/quizzes`);
        if (res.ok) {
          const data = await res.json();
          const mappedQuizzes = data.map((q: any) => ({
            id: q.id,
            courseId: q.course_id,
            title: q.title,
            course: q.course,
            questions: q.questions,
            duration: q.timer_minutes,
            status: 'pending', // By default pending unless we fetch user quiz attempts
            dueDate: 'No due date',
          }));
          setQuizzes(mappedQuizzes);
        }
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      }
    };
    fetchQuizzes();
  }, []);

  const completedQuizzes = quizzes.filter(q => q.status === 'completed');
  const pendingQuizzes = quizzes.filter(q => q.status === 'pending');
  const avgScore = completedQuizzes.length 
    ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length)
    : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64">
        <StudentHeader />

        <main className="p-6 space-y-6 max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2 font-bold tracking-tight">Your Quizzes</h1>
            <p className="text-gray-600">Test your knowledge and track your progress</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming & Available</h2>
              
              {pendingQuizzes.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No pending quizzes</p>
                </div>
              ) : (
                pendingQuizzes.map(quiz => (
                  <Card key={quiz.id} className="p-6 bg-white/80 backdrop-blur-sm border-white hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={quiz.status === 'pending' ? 'warning' : 'default'}>
                            {quiz.status === 'pending' ? 'Pending' : 'Locked'}
                          </Badge>
                          <span className="text-sm font-medium text-gray-500">{quiz.course}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {quiz.duration} mins
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            {quiz.questions} Questions
                          </div>
                        </div>
                      </div>
                      <div>
                        {quiz.status === 'pending' ? (
                          <Link to={`/student/courses/${quiz.courseId}/quiz/${quiz.id}`}>
                            <Button variant="gradient" className="w-full md:w-auto">
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Quiz
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" disabled className="w-full md:w-auto">
                            Locked
                          </Button>
                        )}
                    </div>
                  </div>
                </Card>
                ))
              )}

              <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Completed Quizzes</h2>
              
              {completedQuizzes.length === 0 ? (
                <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No completed quizzes</p>
                </div>
              ) : (
                completedQuizzes.map(quiz => (
                  <Card key={quiz.id} className="p-6 bg-white/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="success">Completed</Badge>
                          <span className="text-sm font-medium text-gray-500">{quiz.course}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Done {quiz.completedDate}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center md:block gap-4">
                        <div className="text-center bg-green-50 px-4 py-2 rounded-xl mb-2">
                          <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Score</p>
                          <p className="text-2xl font-black text-green-700">{quiz.score}%</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 w-full md:w-auto">
                          Review Answers
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="space-y-6">
              <Card gradient className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quiz Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-700">Completed</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{completedQuizzes.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Target className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">Pending</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{pendingQuizzes.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Avg. Score</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{avgScore}%</span>
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

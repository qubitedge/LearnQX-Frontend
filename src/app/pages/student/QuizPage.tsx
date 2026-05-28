import { API_BASE_URL } from '@/app/config/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Clock, CheckCircle, XCircle, Trophy, ArrowLeft, Award } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Badge from '../../components/shared/Badge';
import quizzesData from '../../data/quizzes.json';
import { toast } from 'sonner';

export default function QuizPage() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
        } else {
          let mockQuiz = quizzesData.find((q) => String(q.id) === String(quizId));
          setQuiz(mockQuiz || quizzesData[0]);
        }
      } catch (err) {
        let mockQuiz = quizzesData.find((q) => String(q.id) === String(quizId));
        setQuiz(mockQuiz || quizzesData[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quiz && quizStarted) {
      setTimeLeft(quiz.duration * 60);
      setAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz, quizStarted]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft, showResults]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50 items-center justify-center">
        <div className="text-xl text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1]);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(newAnswers[currentQuestion - 1]);
    }
  };

  const checkIsCorrect = (question: any, answerValue: number | null) => {
    if (answerValue === null) return false;
    if (typeof question.correctAnswer === 'number') {
      return answerValue === question.correctAnswer;
    }
    return question.options[answerValue] === question.correctAnswer;
  };

  const isOptionCorrect = (question: any, optIdx: number) => {
    if (typeof question.correctAnswer === 'number') return optIdx === question.correctAnswer;
    return question.options[optIdx] === question.correctAnswer;
  };

  const calculateScoreWithAnswers = (currentAnswers: (number | null)[]) => {
    let correct = 0;
    quiz.questions.forEach((q: any, idx: number) => {
      if (checkIsCorrect(q, currentAnswers[idx])) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const calculateScore = () => calculateScoreWithAnswers(answers);

  const handleSubmitQuiz = (finalAnswers = answers) => {
    const newAnswers = [...finalAnswers];
    if (selectedAnswer !== null) {
      newAnswers[currentQuestion] = selectedAnswer;
    }

    setAnswers(newAnswers);
    setShowResults(true);
    toast.success('Quiz submitted successfully!');
    
    const localUser = JSON.parse(localStorage.getItem('lms_user') || 'null');
    if (localUser && quiz) {
      const score = calculateScoreWithAnswers(newAnswers);
      const quizResults = JSON.parse(localStorage.getItem('lms_quiz_results') || '[]');
      const existing = quizResults.findIndex((q: any) => String(q.userId) === String(localUser.id) && String(q.quizId) === String(quiz.id));
      if (existing >= 0) {
        quizResults[existing].score = score;
      } else {
        quizResults.push({
          userId: localUser.id,
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: score
        });
      }
      localStorage.setItem('lms_quiz_results', JSON.stringify(quizResults));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
        <StudentSidebar />

        <div className="flex-1 lg:ml-64">
          <StudentHeader />

          <main className="p-6">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => navigate(`/student/courses/${courseId}`)}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Course
              </button>

              <Card gradient className="text-center">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl w-fit mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-3xl text-gray-900 mb-3">{quiz.title}</h1>
                <p className="text-gray-600 mb-6">Test your knowledge and track your progress</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Questions</p>
                    <p className="text-2xl text-gray-900">{quiz.questions.length}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-2xl text-gray-900">{quiz.duration} min</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Passing Score</p>
                    <p className="text-2xl text-gray-900">{quiz.passingScore}%</p>
                  </div>
                </div>

                <div className="text-left bg-yellow-50 p-4 rounded-2xl mb-6">
                  <h3 className="text-sm text-yellow-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• You have {quiz.duration} minutes to complete the quiz</li>
                    <li>• You can navigate between questions using Previous/Next buttons</li>
                    <li>• Once submitted, you cannot change your answers</li>
                    <li>• You need {quiz.passingScore}% to pass this quiz</li>
                  </ul>
                </div>

                <Button variant="gradient" size="lg" fullWidth onClick={() => setQuizStarted(true)}>
                  Start Quiz
                </Button>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;
    const correctCount = quiz.questions.filter((q, idx) => checkIsCorrect(q, answers[idx])).length;

    return (
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
        <StudentSidebar />

        <div className="flex-1 lg:ml-64">
          <StudentHeader />

          <main className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card gradient className="text-center">
                <div
                  className={`p-4 ${
                    passed
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gradient-to-br from-red-500 to-rose-600'
                  } rounded-2xl w-fit mx-auto mb-6`}
                >
                  {passed ? (
                    <Trophy className="w-12 h-12 text-white" />
                  ) : (
                    <XCircle className="w-12 h-12 text-white" />
                  )}
                </div>

                <h1 className="text-3xl text-gray-900 mb-3">
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>
                <p className="text-gray-600 mb-6">
                  {passed
                    ? 'You passed the quiz! Great job!'
                    : 'You need more practice. Review the material and try again.'}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Your Score</p>
                    <p className="text-3xl text-gray-900">{score}%</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Correct</p>
                    <p className="text-3xl text-green-600">{correctCount}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Incorrect</p>
                    <p className="text-3xl text-red-600">{quiz.questions.length - correctCount}</p>
                  </div>
                </div>

                {passed && (
                  <div className="p-4 bg-green-50 rounded-2xl mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-green-600" />
                    <p className="text-green-700">You earned 50 XP for passing this quiz!</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(`/student/courses/${courseId}`)}
                  >
                    Back to Course
                  </Button>
                  <Button
                    variant="gradient"
                    fullWidth
                    onClick={() => {
                      setQuizStarted(false);
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setSelectedAnswer(null);
                      setAnswers([]);
                    }}
                  >
                    Retake Quiz
                  </Button>
                </div>
              </Card>

              <Card gradient>
                <h2 className="text-xl text-gray-900 mb-4">Answer Review</h2>
                <div className="space-y-4">
                  {quiz.questions.map((question, idx) => {
                    const isCorrect = checkIsCorrect(question, answers[idx]);
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-2xl ${
                          isCorrect ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="text-gray-900 mb-2">
                              {idx + 1}. {question.question}
                            </p>
                            <div className="space-y-2">
                              {question.options.map((option, optIdx) => (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded-xl ${
                                    isOptionCorrect(question, optIdx)
                                      ? 'bg-green-100 border-2 border-green-600'
                                      : optIdx === answers[idx] && !isCorrect
                                      ? 'bg-red-100 border-2 border-red-600'
                                      : 'bg-white'
                                  }`}
                                >
                                  <p className="text-sm text-gray-700">{option}</p>
                                </div>
                              ))}
                            </div>
                            {question.explanation && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                💡 {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-[#EAF3FF] to-[#F3E8FF]">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64">
        <StudentHeader />

        <main className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-lg">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span className="text-lg text-gray-900">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <Card gradient>
              <h2 className="text-2xl text-gray-900 mb-6">{question.question}</h2>

              <div className="space-y-3 mb-8">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full p-4 text-left rounded-2xl transition-all ${
                      selectedAnswer === idx
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === idx
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAnswer === idx && (
                          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  Previous
                </Button>
                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    variant="gradient"
                    onClick={() => handleSubmitQuiz()}
                    className="flex-1"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={handleNextQuestion} className="flex-1">
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

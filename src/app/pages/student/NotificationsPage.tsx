import { Bell, BookOpen, Award, MessageSquare, CheckCircle } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import Card from '../../components/shared/Card';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'course',
      icon: BookOpen,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      title: 'New module available',
      message: 'Module 4: Advanced React Patterns is now available in your Advanced Web Development course.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'achievement',
      icon: Award,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      title: 'Achievement Unlocked!',
      message: 'Congratulations! You just earned the "Fast Learner" badge for completing 3 modules in one day.',
      time: 'Yesterday',
      read: false,
    },
    {
      id: 3,
      type: 'system',
      icon: Bell,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: 'Platform Maintenance',
      message: 'LearnX will undergo scheduled maintenance this Sunday from 2 AM to 4 AM UTC.',
      time: '2 days ago',
      read: true,
    },
    {
      id: 4,
      type: 'discussion',
      icon: MessageSquare,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      title: 'New reply to your question',
      message: 'Instructor Sarah Johnson replied to your question in the UX Design fundamentals forum.',
      time: '1 week ago',
      read: true,
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64">
        <StudentHeader />

        <main className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2 font-bold tracking-tight">Notifications</h1>
              <p className="text-gray-600">Stay updated with your courses and achievements</p>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-5 transition-all ${notification.read ? 'opacity-70 bg-white' : 'bg-indigo-50/30 border-indigo-100 shadow-md shadow-indigo-100/50'}`}
                hover={!notification.read}
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 h-fit ${notification.iconBg}`}>
                    <notification.icon className={`w-6 h-6 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>
                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

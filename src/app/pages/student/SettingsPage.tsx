import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Eye } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: 'Avid learner and software enthusiast.',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    courseUpdates: true,
    promotions: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      updateUser({ avatar: imageUrl });
    }
  };

  const handleSaveProfile = () => {
    updateUser({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    });
  };

  return (
    <div className="flex min-h-screen bg-pink-50/30 font-sans">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64 relative">
        {/* Soft background gradient blobs like the design */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-pink-100/80 via-fuchsia-50/80 to-purple-100/80 pointer-events-none -z-10" />

        <StudentHeader />

        <main className="p-8 space-y-8 max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Settings</h1>
            <p className="text-sm text-gray-500">Manage your account preferences and profile details</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold ${
                    activeTab === tab.id
                      ? 'bg-[#7b61ff] text-white shadow-md shadow-purple-200'
                      : 'text-gray-500 hover:bg-white hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8"
              >
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                      <img 
                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=LearnX'} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Picture</h3>
                        <p className="text-xs text-gray-500 mb-4">PNG, JPG or GIF up to 5MB</p>
                        <div className="flex gap-3">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload} 
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                          >
                            Upload New
                          </button>
                          <button 
                            onClick={() => updateUser({ avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}` })}
                            className="px-4 py-2 bg-red-50/50 border border-red-100 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Bio</label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7b61ff] focus:bg-white transition-colors text-sm font-medium text-gray-900 resize-none"
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button 
                          onClick={handleSaveProfile}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#7b61ff] to-[#a855f7] text-white rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] transition-all hover:-translate-y-0.5"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Email Alerts</p>
                          <p className="text-xs text-gray-500 mt-0.5">Receive daily summary emails.</p>
                        </div>
                        <button 
                          onClick={() => handleToggle('emailAlerts')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings.emailAlerts ? 'bg-[#7b61ff]' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notificationSettings.emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Course Updates</p>
                          <p className="text-xs text-gray-500 mt-0.5">Get notified about new course content.</p>
                        </div>
                        <button 
                          onClick={() => handleToggle('courseUpdates')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings.courseUpdates ? 'bg-[#7b61ff]' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notificationSettings.courseUpdates ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Promotions</p>
                          <p className="text-xs text-gray-500 mt-0.5">Receive marketing and promotional offers.</p>
                        </div>
                        <button 
                          onClick={() => handleToggle('promotions')}
                          className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings.promotions ? 'bg-[#7b61ff]' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notificationSettings.promotions ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

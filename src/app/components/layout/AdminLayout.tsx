import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
  { icon: Video, label: 'Upload Lectures', path: '/admin/uploads/video' },
  { icon: FileText, label: 'Upload Notes', path: '/admin/uploads/pdf' },
  { icon: HelpCircle, label: 'Create Quiz', path: '/admin/uploads/quiz' },
  { icon: Settings, label: 'Manage Uploads', path: '/admin/manage-uploads' },
  { icon: Users, label: 'Students', path: '/admin/students' },
];

import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-pink-50/30 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-pink-100/80 via-fuchsia-50/80 to-purple-100/80 pointer-events-none -z-10" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-gray-200/50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100/50">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Admin<span className="text-[#7b61ff]">X</span></span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-1 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-bold ${
                  isActive 
                    ? 'bg-[#7b61ff] text-white shadow-md shadow-purple-200' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100/50">
          <button 
            onClick={() => {
              logout();
              navigate('/signin');
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="hidden md:block text-gray-500 font-medium text-sm">
                Control Panel
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 pl-4 border-l border-gray-200/60">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-200">
                  A
                </div>
                <div className="hidden md:block">
                   <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Admin</p>
                </div>
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

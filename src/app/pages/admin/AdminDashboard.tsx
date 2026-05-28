import { API_BASE_URL } from '@/app/config/api';
import { motion } from 'motion/react';
import { Users, BookOpen, Activity, DollarSign, Target, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';

// Simple SVG sparkline component for the stat cards
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 30;
  const width = 80;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`-2 -2 ${width + 4} ${height + 4}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#7b61ff', '#d946ef', '#06b6d4', '#10b981', '#f59e0b'];

  if (!analyticsData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Monitor platform performance and analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-between">
          <div className="flex gap-4 items-center">
             <div className="p-3.5 bg-gradient-to-br from-[#7b61ff] to-[#9d4edd] rounded-2xl shadow-inner text-white">
               <Users className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-sm text-gray-500 font-medium mb-0.5">Total Students</h3>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalStudents.toLocaleString()}</span>
               </div>
               <p className="text-xs font-semibold text-emerald-500 mt-1">+{analyticsData.overview.enrollmentGrowth}% this month</p>
             </div>
          </div>
          <Sparkline data={[1, 2, 2, 3, 4, 4, 6]} color="#10b981" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-between">
          <div className="flex gap-4 items-center">
             <div className="p-3.5 bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] rounded-2xl shadow-inner text-white">
               <BookOpen className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-sm text-gray-500 font-medium mb-0.5">Total Courses</h3>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalCourses}</span>
               </div>
               <p className="text-xs font-semibold text-emerald-500 mt-1">12 new courses</p>
             </div>
          </div>
          <Sparkline data={[2, 3, 5, 4, 7, 8, 12]} color="#d946ef" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-between">
          <div className="flex gap-4 items-center">
             <div className="p-3.5 bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] rounded-2xl shadow-inner text-white">
               <Activity className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-sm text-gray-500 font-medium mb-0.5">Active Users</h3>
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeUsers.toLocaleString()}</span>
               </div>
               <p className="text-xs font-semibold text-emerald-500 mt-1">{analyticsData.overview.completionRate}% completion rate</p>
             </div>
          </div>
          <Sparkline data={[1, 3, 2, 5, 4, 7, 6]} color="#06b6d4" />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Monthly Enrollments</h3>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">+18.5%</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyEnrollments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="url(#colorGradient)"
                  strokeWidth={4}
                  dot={{ fill: '#7b61ff', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7b61ff" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.categoryDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Top Performing Courses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Enrollments</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {analyticsData.topCourses.map((course: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <p className="font-bold text-gray-900 text-sm">{course.title}</p>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {course.enrollments.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

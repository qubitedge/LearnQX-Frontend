import { Link } from 'react-router';
import { motion } from 'motion/react';
import { GraduationCap, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-900 bg-[#f8fafc]">
      
      {/* Super clean, light background gradient exactly like the image */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-cyan-50 pointer-events-none"></div>

      {/* --- Navigation --- */}
      <nav className="relative z-20 px-8 py-6 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0f172a] tracking-tight">LearnX</span>
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative z-10 flex-1 flex items-start pt-4 lg:pt-8 pb-24 min-h-[85vh]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-start">
            
            {/* Left Content (Typography & CTAs) */}
            <div className="max-w-[600px] pt-4 pb-12 relative z-20">
              <h1 className="text-5xl lg:text-[4.5rem] leading-[1.1] font-extrabold text-[#0f172a] mb-8 tracking-tight">
                Master New Skills <br />
                with <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                  World-Class
                </span> <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                  Courses
                </span>
              </h1>
              
              <p className="text-sm text-slate-500 mb-10 leading-loose font-medium max-w-[420px]">
                Join thousands of learners building their future with expert-led <br/>
                courses in technology, business, design, and more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white font-bold text-base shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)] transition-all"
                  >
                    <Zap className="w-5 h-5 text-white" /> 
                    <span>Start Learning Free</span>
                  </motion.button>
                </Link>

                <Link to="/signup" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center w-full px-8 py-4 rounded-xl border-2 border-indigo-100 text-indigo-600 bg-white font-bold text-base hover:border-indigo-200 transition-all shadow-sm"
                  >
                    Explore Courses
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image Illustration in White Card */}
            <div className="relative flex items-start justify-center pointer-events-none perspective-[1200px] w-full pt-12 lg:pt-16">
              
              {/* White Container Card with Thick Padding */}
              <motion.div 
                animate={{ 
                  y: [-12, 12, -12],
                  rotateX: [2, -2, 2],
                  rotateY: [-2, 2, -2]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white p-4 lg:p-6 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 w-full max-w-[550px] aspect-[4/3] flex items-center justify-center overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src="/hero-image.png" 
                  alt="World Class Courses" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

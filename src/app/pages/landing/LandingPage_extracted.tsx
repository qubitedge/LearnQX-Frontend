Created At: 2026-05-27T09:22:01Z
Completed At: 2026-05-27T09:22:01Z
File Path: `file:///d:/LMS-JS/LMS-JS/src/app/pages/landing/LandingPage.tsx`
Total Lines: 393
Total Bytes: 19462
Showing lines 1 to 393
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import { Link } from 'react-router';
2: import { motion } from 'motion/react';
3: import {
4:   GraduationCap,
5:   BookOpen,
6:   Users,
7:   Trophy,
8:   Clock,
9:   Star,
10:   CheckCircle,
11:   Zap,
12:   Globe,
13:   Shield,
14:   Award,
15:   Mail,
16:   Twitter,
17:   Linkedin,
18:   Github,
19:   Instagram
20: } from 'lucide-react';
21: import Button from '../../components/shared/Button';
22: import Card from '../../components/shared/Card';
23: import coursesData from '../../data/courses.json';
24: 
25: export default function LandingPage() {
26:   const popularCourses = coursesData.slice(0, 3);
27: 
28:   return (
29:     <div className="min-h-screen">
30:       <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
31:         <div className="max-w-7xl mx-auto px-6 py-4">
32:           <div className="flex items-center justify-between">
33:             <Link to="/" className="flex items-center gap-2">
34:               <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
35:                 <GraduationCap className="w-6 h-6 text-white" />
36:               </div>
37:               <span className="text-xl font-bold text-gray-900 tracking-tight">LearnX</span>
38:             </Link>
39: 
40:             <div className="hidden md:flex items-center gap-8">
41:               <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
42:                 Features
43:               </a>
44:               <a href="#courses" className="text-sm fo
<truncated 17751 bytes>
:text-indigo-400 transition-colors">Contact</a></li>
359:             </ul>
360:           </div>
361:           
362:           <div>
363:             <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Subscribe</h4>
364:             <p className="text-gray-400 text-sm mb-4">Get the latest updates and course offers directly in your inbox.</p>
365:             <div className="flex flex-col space-y-3">
366:               <div className="relative">
367:                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
368:                 <input 
369:                   type="email" 
370:                   placeholder="Your email address" 
371:                   className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-gray-500 transition-all"
372:                 />
373:               </div>
374:               <Button variant="gradient" className="w-full justify-center shadow-none text-sm py-2.5">
375:                 Subscribe
376:               </Button>
377:             </div>
378:           </div>
379:         </div>
380:         
381:         <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
382:           <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} LearnX Inc. All rights reserved.</p>
383:           <div className="flex gap-6 text-sm text-gray-500">
384:             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
385:             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
386:             <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
387:           </div>
388:         </div>
389:       </footer>
390:     </div>
391:   );
392: }
393: 
The above content shows the entire, complete file contents of the requested file.

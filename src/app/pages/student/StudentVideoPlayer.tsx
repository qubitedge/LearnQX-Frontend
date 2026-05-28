import { API_BASE_URL } from '@/app/config/api';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import Card from '../../components/shared/Card';

import { useAuth } from '../../context/AuthContext';

export default function StudentVideoPlayer() {
  const { courseId, videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const { markLessonComplete } = useAuth();

  useEffect(() => {
    // Fetch the module/video details to find the video URL
    const fetchVideo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/modules/${courseId}`);
        if (res.ok) {
          const modules = await res.json();
          // Remove the 'vid-' prefix if it exists in the URL
          const cleanVideoId = videoId?.replace('vid-', '') || videoId;
          // Find the video across all modules
          for (const mod of modules) {
            const found = mod.videos.find((v: any) => v.id.toString() === cleanVideoId);
            if (found) {
              setVideo(found);
              break;
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch video:', err);
      }
    };
    fetchVideo();
  }, [courseId, videoId]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64">
        <StudentHeader />

        <main className="p-6 space-y-6 max-w-5xl mx-auto">
          <button 
            onClick={() => navigate(`/student/courses/${courseId}`)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </button>

          <Card className="p-6">
            {video ? (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-indigo-600" />
                  {video.title}
                </h1>
                <div className="aspect-video bg-black rounded-xl overflow-hidden w-full max-w-4xl mx-auto">
                  <video 
                    src={`${API_BASE_URL}/static/uploads/videos/${video.file_path}`} 
                    controls 
                    className="w-full h-full"
                    controlsList="nodownload"
                    autoPlay
                    onEnded={() => {
                      if (courseId && videoId) {
                        markLessonComplete(courseId, videoId);
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                Loading video player...
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}

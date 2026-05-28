import { Construction } from 'lucide-react';
import StudentSidebar from '../../components/layout/StudentSidebar';
import StudentHeader from '../../components/layout/StudentHeader';
import Card from '../../components/shared/Card';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <StudentSidebar />

      <div className="flex-1 lg:ml-64">
        <StudentHeader />

        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <Card gradient className="text-center py-12">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl w-fit mx-auto mb-6">
                <Construction className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl text-gray-900 mb-3">{title}</h1>
              <p className="text-gray-600">{description}</p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

import { Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <Outlet />
    </div>
  );
}

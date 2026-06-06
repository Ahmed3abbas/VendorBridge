import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSocket } from '../../hooks/useSocket';

export default function AppLayout() {
  useSocket(); // Connect socket.io for the authenticated session

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[240px]">
        <Topbar />
        <main className="flex-1 pt-[56px]">
          <div className="p-8 max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

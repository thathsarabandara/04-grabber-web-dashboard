import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">

      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-32 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


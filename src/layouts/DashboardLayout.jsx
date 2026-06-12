import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Video, 
  Map, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export function DashboardLayout() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Gamepad2, label: 'Control Panel', path: '/dashboard/control' },
    { icon: Video, label: 'Telemetry & Camera', path: '/dashboard/telemetry' },
    { icon: Map, label: 'Path Drawing', path: '/dashboard/path-draw' },
    { icon: Calendar, label: 'Task Scheduler', path: '/dashboard/tasks' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 transition-colors duration-500 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } glass-sidebar p-4 flex flex-col transition-all duration-300 ease-in-out fixed h-full z-50 lg:relative lg:z-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'lg:justify-center'}`}>
            <img src="/logo.png" alt="Grabber Logo" className="w-10 h-10 object-contain" />
            {sidebarOpen && (
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-secondary">
                Grabber
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-brand-accent/10 text-brand-accent shadow-sm'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <item.icon size={20} className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
              {!sidebarOpen && isActive(item.path) && (
                <div className="absolute left-0 w-1 h-6 bg-brand-accent rounded-r-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-slate-200/50 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-full mt-4 p-2 hover:bg-slate-100 rounded-xl transition text-slate-400"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-20 glass-card !rounded-none !border-t-0 !border-x-0 px-6 sm:px-10 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold tracking-tight hidden sm:block">
              {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-brand-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/20">
                {(user?.name || 'U')[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div 
          ref={contentRef} 
          className="flex-1 overflow-y-auto p-6 sm:p-10 scroll-smooth relative"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 pattern-grid opacity-[0.3] pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto relative">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

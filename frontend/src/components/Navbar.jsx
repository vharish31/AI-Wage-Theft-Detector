import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Mic, 
  FileCheck, 
  AlertTriangle, 
  LogIn, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Shield, 
  Users, 
  BarChart3, 
  FileText, 
  Settings 
} from 'lucide-react';

export default function Navbar({ workData, auditResult }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // User Role Navbar Links
  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/voice-log', label: 'Voice Log', icon: Mic },
    { path: '/verification', label: 'Verify Payment', icon: FileCheck },
    { path: '/report', label: 'Theft Report', icon: AlertTriangle }
  ];

  // Admin Role Navbar Links
  const adminNavItems = [
    { path: '/admin', label: 'Admin Panel', icon: Shield },
    { path: '/admin?tab=users', label: 'Users', icon: Users },
    { path: '/admin?tab=reports', label: 'Reports Audit', icon: FileText },
    { path: '/admin?tab=analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin?tab=database', label: 'Wage Rules', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & Tagline */}
          <Link 
            to={isAuthenticated ? (role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} 
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  AI Wage Theft Detector
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border hidden sm:inline-block ${
                  role === 'ADMIN'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {role === 'ADMIN' ? 'Admin Portal' : 'Worker Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                Every Hour Counted. Every Rupee Protected.
              </p>
            </div>
          </Link>

          {/* Dynamic Role-Based Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            
            {isAuthenticated ? (
              <>
                {/* ADMIN ROLE NAVBAR TABS */}
                {role === 'ADMIN' ? (
                  <>
                    {adminNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === '/admin' && (item.path === '/admin' ? !location.search : location.search.includes(item.path.split('?')[1]));

                      return (
                        <Link
                          key={item.label}
                          to={item.path}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden md:inline">{item.label}</span>
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  /* USER ROLE NAVBAR TABS */
                  <>
                    {userNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-md'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="hidden md:inline">{item.label}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 ${
                    location.pathname === '/profile' ? 'border border-slate-700 bg-slate-800/60' : ''
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${role === 'ADMIN' ? 'text-amber-400' : 'text-cyan-400'}`} />
                  <span className="hidden lg:inline">{user?.name || 'Profile'}</span>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              /* UNAUTHENTICATED PUBLIC NAVBAR */
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/60 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
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
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  History
} from 'lucide-react';

export default function Sidebar({ workData, auditResult }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // User Role Navigation Links
  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/verify-method', label: 'Verify Method', icon: Sparkles },
    { path: '/history', label: 'History', icon: History }
  ];

  // Admin Role Navigation Links
  const adminNavItems = [
    { path: '/admin', label: 'Admin Panel', icon: Shield },
    { path: '/admin?tab=users', label: 'Users', icon: Users },
    { path: '/admin?tab=reports', label: 'Reports Audit', icon: FileText },
    { path: '/admin?tab=analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const currentNavItems = role === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <>
      {/* MOBILE TOP HEADER BAR */}
      <header className="md:hidden sticky top-0 z-50 bg-[#080e1e]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link 
          to={isAuthenticated ? (role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} 
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">AI Wage Theft Detector</span>
            <span className="text-[10px] text-cyan-400 font-semibold">{role === 'ADMIN' ? 'Admin Portal' : 'Worker Portal'}</span>
          </div>
        </Link>

        {/* Mobile menu toggle button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* BACKDROP OVERLAY FOR MOBILE */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm"
        />
      )}

      {/* DESKTOP STICKY SIDEBAR / MOBILE SLIDE-OUT PANEL */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 lg:w-72 bg-[#080e1e] border-r border-slate-800/90 flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Logo & Brand Header */}
          <Link 
            to={isAuthenticated ? (role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-900/60 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-0.5">
              <img src="/favicon.png" alt="AI Wage Theft Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  AI Wage Theft
                </span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-block ${
                role === 'ADMIN'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              }`}>
                {role === 'ADMIN' ? 'Admin Portal' : 'Worker Protection'}
              </span>
            </div>
          </Link>

          {/* Navigation Menu Header Label */}
          <div className="px-3 pt-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              {role === 'ADMIN' ? 'System Navigation' : 'Wage Audit Gateway'}
            </span>
          </div>

          {/* Vertical Menu Navigation Items */}
          <nav className="space-y-1.5">
            {isAuthenticated ? (
              currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = role === 'ADMIN' 
                  ? location.pathname === '/admin' && (item.path === '/admin' ? !location.search : location.search.includes(item.path.split('?')[1]))
                  : location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? role === 'ADMIN'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-950/40 font-bold'
                          : 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/40 font-extrabold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-900 text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-700 group-hover:text-slate-400'
                    }`} />
                  </Link>
                );
              })
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/60"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Portal</span>
              </Link>
            )}
          </nav>

        </div>

        {/* User Profile & Logout Bottom Section */}
        {isAuthenticated && (
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                location.pathname === '/profile'
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="truncate max-w-[120px]">
                  <span className="text-xs font-bold block truncate">{user?.name || 'Worker'}</span>
                  <span className="text-[10px] text-slate-400 block capitalize">{role?.toLowerCase() || 'user'}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}

      </aside>
    </>
  );
}

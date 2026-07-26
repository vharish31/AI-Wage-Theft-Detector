import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminAnalyticsAPI, getAdminUsersAPI, getAdminReportsAPI, manageUserAPI, actOnReportAPI } from '../services/authApi';
import { ShieldCheck, Users, FileText, AlertTriangle, CheckCircle2, IndianRupee, BarChart3, Settings, ShieldAlert, Check, X, Search, RefreshCw, Layers, Clock, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'reports' | 'database'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['analytics', 'users', 'reports', 'database'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const [analytics, setAnalytics] = useState(null);
  const [userList, setUserList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await getAdminAnalyticsAPI(token);
      const usersData = await getAdminUsersAPI(token);
      const reportsData = await getAdminReportsAPI(token);

      setAnalytics(analyticsData);
      setUserList(usersData);
      setReportList(reportsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  const handleToggleUserRole = async (uId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    await manageUserAPI({ userId: uId, role: newRole }, token);
    setUserList(prev => prev.map(u => u.id === uId ? { ...u, role: newRole } : u));
  };

  const handleToggleUserStatus = async (uId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await manageUserAPI({ userId: uId, status: newStatus }, token);
    setUserList(prev => prev.map(u => u.id === uId ? { ...u, status: newStatus } : u));
  };

  const handleReportAction = async (reportId, action) => {
    await actOnReportAPI(reportId, action, token);
    setReportList(prev => prev.map(r => r.id === reportId ? { ...r, admin_action: action } : r));
  };

  const filteredUsers = userList.filter(u => 
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 animate-fadeIn">
      
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5" /> SYSTEM ADMINISTRATION PANEL
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Administrator, <span className="text-amber-400">{user?.name || 'Admin'}</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Monitor system analytics, manage worker accounts, audit legal complaints, and supervise statutory wage database rules.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh System Data
        </button>
      </div>

      {/* DASHBOARD CARDS GRID (Step 6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Registered Users</p>
          <p className="text-xl font-extrabold text-white">{analytics?.totalRegisteredUsers || 142}</p>
          <p className="text-[10px] text-emerald-400 font-semibold">Active accounts</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase font-bold text-cyan-400">Total Work Logs</p>
          <p className="text-xl font-extrabold text-cyan-300">{analytics?.totalWorkLogs || 1140}</p>
          <p className="text-[10px] text-slate-500">Recorded shifts</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
          <p className="text-[10px] uppercase font-bold text-amber-400">Pending Complaints</p>
          <p className="text-xl font-extrabold text-amber-300">{analytics?.pendingComplaints || 18}</p>
          <p className="text-[10px] text-amber-400/80">Awaiting labor board</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
          <p className="text-[10px] uppercase font-bold text-emerald-400">Resolved Complaints</p>
          <p className="text-xl font-extrabold text-emerald-300">{analytics?.resolvedComplaints || 42}</p>
          <p className="text-[10px] text-emerald-400/80">Wages recovered</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] uppercase font-bold text-rose-400">Total Wage Theft</p>
          <p className="text-xl font-extrabold text-rose-400 flex items-center">
            <IndianRupee className="w-4 h-4 mr-0.5" />
            {analytics?.totalWageTheftAmount ? (analytics.totalWageTheftAmount / 100000).toFixed(2) + 'L' : '48.5L'}
          </p>
          <p className="text-[10px] text-slate-400">Underpayment detected</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Active Users</p>
          <p className="text-xl font-extrabold text-white">{analytics?.activeUsers || 138}</p>
          <p className="text-[10px] text-slate-500">Today online</p>
        </div>
      </div>

      {/* ADMIN FEATURE NAVIGATION TAB BAR */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> System Analytics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4" /> Manage Users ({userList.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <FileText className="w-4 h-4" /> Reports & Complaints ({reportList.length})
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'database'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/40'
          }`}
        >
          <Settings className="w-4 h-4" /> Statutory Wage Benchmarks
        </button>
      </div>

      {/* TAB CONTENT 1: SYSTEM ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Job Category Wage Theft Distribution Chart */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Wage Theft by Job Category
              </h3>
              <div className="space-y-3 pt-2">
                {analytics?.jobDistribution?.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="font-semibold">{item.role}</span>
                      <span className="font-mono text-cyan-400">₹{(item.amount / 100000).toFixed(2)} Lakhs ({item.cases} cases)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (item.amount / 2000000) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State Jurisdiction Breakdown */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                State Wage Rule Jurisdiction Cases
              </h3>
              <div className="space-y-3 pt-2">
                {analytics?.stateDistribution?.map((st, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{st.state}</p>
                      <p className="text-[10px] text-slate-400">{st.cases} Wage Audit Filings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-amber-400 font-mono">₹{(st.amount / 100000).toFixed(2)} L</p>
                      <p className="text-[10px] text-slate-500">Total Underpayment</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Activity Log */}
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              Live System Activity Feed
            </h3>
            <div className="divide-y divide-slate-800/60 text-xs">
              {analytics?.recentActivity?.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{act.user}</span>
                    <span className="text-slate-400"> ({act.role}) — </span>
                    <span className="text-cyan-400">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                User Account Management
              </h3>
              <p className="text-xs text-slate-400">Manage worker accounts, toggle role privileges, or suspend user access</p>
            </div>

            <div className="relative flex items-center w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">User Details</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Location / Phone</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{u.state}</div>
                      <div className="text-[10px] text-slate-500">{u.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[10px]">
                      {new Date(u.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 border border-slate-700 transition-all cursor-pointer"
                      >
                        Toggle {u.role === 'ADMIN' ? 'to User' : 'to Admin'}
                      </button>

                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border-rose-800'
                            : 'bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: REPORTS & COMPLAINTS AUDIT */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                All System Reports & Complaints Audit
              </h3>
              <p className="text-xs text-slate-400">Review worker filings, verify statutory minimum wages, and approve/reject complaints</p>
            </div>
          </div>

          <div className="space-y-3">
            {reportList.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{r.job_type}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                      {r.riskLevel || 'Medium Risk'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{r.id}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Paid: <strong className="text-white">₹{r.actualPay}</strong> | Expected: <strong className="text-cyan-400">₹{r.expectedPay}</strong> | Shortfall: <strong className="text-rose-400">₹{r.wageTheftAmount}</strong>
                  </p>
                  <p className="text-[10px] text-slate-500">{r.calculation_method || 'Statutory minimum wage audit'}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {r.admin_action === 'APPROVED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : r.admin_action === 'REJECTED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Rejected Fake
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReportAction(r.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Approve Report
                      </button>

                      <button
                        onClick={() => handleReportAction(r.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Reject Fake
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SHIFT ACTIVITY & VERIFICATION AUDIT LOG TABLE (ADMIN ONLY) */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Recent Work Logs & Verification Audit History
              </h3>
              <span className="text-xs text-slate-400">System Wage Audits</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-semibold">Job / Platform</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Shift Hours / Tasks</th>
                    <th className="py-3 px-4 font-semibold">Received vs Expected</th>
                    <th className="py-3 px-4 font-semibold">Shortfall</th>
                    <th className="py-3 px-4 font-semibold">Risk Level</th>
                    <th className="py-3 px-4 font-semibold text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      Painter (Construction)
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">Chennai</td>
                    <td className="py-3.5 px-4 text-slate-300">8.0 hrs</td>
                    <td className="py-3.5 px-4 font-mono">
                      ₹600 / <span className="text-cyan-400 font-bold">₹900</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-400">-₹300.00</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                        High Risk
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs font-bold text-amber-400">
                      Pending Action
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      Delivery Partner (Swiggy)
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">Chennai</td>
                    <td className="py-3.5 px-4 text-slate-300">25 Deliveries</td>
                    <td className="py-3.5 px-4 font-mono">
                      ₹720 / <span className="text-cyan-400 font-bold">₹875</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-400">-₹155.00</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        Medium Risk
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs font-bold text-emerald-400">
                      Complaint Generated
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      Electrician
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">Chennai</td>
                    <td className="py-3.5 px-4 text-slate-300">8.0 hrs</td>
                    <td className="py-3.5 px-4 font-mono">
                      ₹950 / <span className="text-cyan-400 font-bold">₹950</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">₹0.00</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        No Issue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs font-bold text-slate-400">
                      Verified Compliant
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: STATUTORY WAGE BENCHMARKS */}
      {activeTab === 'database' && (
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-5 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              Statutory Minimum Wage Benchmarks Dataset
            </h3>
            <p className="text-xs text-slate-400">Official Gazette statutory daily wage rates under Tamil Nadu & Indian labor notifications</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-xs font-bold text-white">Construction Worker / Laborer</p>
              <p className="text-lg font-black text-cyan-400 mt-1">₹850.00 / shift</p>
              <p className="text-[10px] text-slate-500 mt-1">Minimum Wages Act, 1948</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-xs font-bold text-white">Painter & Mason</p>
              <p className="text-lg font-black text-cyan-400 mt-1">₹900.00 / shift</p>
              <p className="text-[10px] text-slate-500 mt-1">Skilled Statutory Schedule</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-xs font-bold text-white">Gig Delivery Partner</p>
              <p className="text-lg font-black text-cyan-400 mt-1">₹35.00 / order base</p>
              <p className="text-[10px] text-slate-500 mt-1">Code on Social Security, 2020</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

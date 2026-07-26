import apiClient from './api';

/**
 * Login user via backend API with fallback for demo credentials
 */
export const loginAPI = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.warn('Backend login endpoint offline, using local authentication fallback:', error.message);
    const cleanEmail = (email || '').trim().toLowerCase();
    
    if (cleanEmail === 'admin@wagedetector.com' && password === 'Admin@123') {
      return {
        userId: 'usr-admin-01',
        name: 'Administrator',
        email: 'admin@wagedetector.com',
        role: 'ADMIN',
        token: 'mock-jwt-token-admin-2026',
        phone: '+91 98765 43210',
        state: 'Tamil Nadu',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
    } else if ((cleanEmail === 'user@wagedetector.com' || cleanEmail === 'harish@wagedetector.com') && (password === 'User@123' || password === 'Harish@123')) {
      return {
        userId: 'usr-worker-01',
        name: 'Harish',
        email: 'user@wagedetector.com',
        role: 'USER',
        token: 'mock-jwt-token-user-2026',
        phone: '+91 91234 56789',
        state: 'Tamil Nadu',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
    } else if ((cleanEmail === 'shwetha@wagedetector.com' || cleanEmail === 'shwetha@example.com') && (password === 'User@123' || password === 'Shwetha@123')) {
      return {
        userId: 'usr-worker-03',
        name: 'Shwetha',
        email: 'shwetha@wagedetector.com',
        role: 'USER',
        token: 'mock-jwt-token-shwetha-2026',
        phone: '+91 98888 77777',
        state: 'Tamil Nadu',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
    } else {
      throw new Error(error.response?.data?.detail || 'Invalid email or password.');
    }
  }
};

/**
 * Register new user
 */
export const registerAPI = async (userData) => {
  try {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.warn('Backend register API offline, using local fallback:', error.message);
    return {
      userId: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'USER',
      token: `mock-jwt-token-${Date.now()}`,
      phone: userData.phone || '+91 98765 43210',
      state: userData.state || 'Tamil Nadu',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
  }
};

/**
 * Logout session
 */
export const logoutAPI = async () => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (err) {
    console.warn('Backend logout call skipped:', err.message);
  }
};

/**
 * Get profile data
 */
export const getProfileAPI = async (token) => {
  try {
    const response = await apiClient.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

/**
 * Update profile data
 */
export const updateProfileAPI = async (userData, token) => {
  try {
    const response = await apiClient.put('/api/auth/profile', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.warn('Backend profile update offline, using local update:', error.message);
    return { message: 'Profile updated locally', user: userData };
  }
};

/**
 * Admin: Get System Analytics
 */
export const getAdminAnalyticsAPI = async (token) => {
  try {
    const response = await apiClient.get('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.warn('Backend admin analytics offline, using fallback data:', error.message);
    return {
      totalRegisteredUsers: 142,
      activeUsers: 138,
      totalWorkLogs: 1140,
      pendingComplaints: 18,
      resolvedComplaints: 42,
      totalWageTheftCases: 384,
      totalWageTheftAmount: 4850000.0,
      jobDistribution: [
        { role: 'Delivery Partner', cases: 1420, amount: 1850000 },
        { role: 'Construction Worker', cases: 980, amount: 1420000 },
        { role: 'Painter', cases: 540, amount: 680000 },
        { role: 'Electrician', cases: 420, amount: 490000 }
      ],
      stateDistribution: [
        { state: 'Tamil Nadu', cases: 1850, amount: 2200000 },
        { state: 'Maharashtra', cases: 920, amount: 1150000 },
        { state: 'Karnataka', cases: 610, amount: 820000 }
      ],
      recentActivity: [
        { id: 'act-1', user: 'Harish', action: 'Submitted Verification', role: 'Construction Worker', time: '10 mins ago' },
        { id: 'act-2', user: 'Shwetha', action: 'Generated Gig Complaint', role: 'Delivery Partner', time: '25 mins ago' }
      ]
    };
  }
};

/**
 * Admin: Get All Users
 */
export const getAdminUsersAPI = async (token) => {
  try {
    const response = await apiClient.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return [
      { id: 'usr-worker-01', name: 'Harish', email: 'user@wagedetector.com', role: 'USER', phone: '+91 91234 56789', state: 'Tamil Nadu', status: 'ACTIVE', created_at: '2026-07-05T10:15:00Z' },
      { id: 'usr-worker-03', name: 'Shwetha', email: 'shwetha@wagedetector.com', role: 'USER', phone: '+91 98888 77777', state: 'Tamil Nadu', status: 'ACTIVE', created_at: '2026-07-12T09:30:00Z' }
    ];
  }
};

/**
 * Admin: Manage User Status or Role
 */
export const manageUserAPI = async (payload, token) => {
  try {
    const response = await apiClient.post('/api/admin/users/manage', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { status: 'ok', message: 'User updated locally' };
  }
};

/**
 * Admin: Get All Reports
 */
export const getAdminReportsAPI = async (token) => {
  try {
    const response = await apiClient.get('/api/admin/reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return [
      { id: 'wt-1001', job_type: 'Delivery Partner (Swiggy)', expectedPay: 1075, actualPay: 850, wageTheftAmount: 225, riskLevel: 'Medium Risk', status: 'Possible Wage Theft', admin_action: 'PENDING', createdAt: '2026-07-20T10:00:00Z' },
      { id: 'wt-1002', job_type: 'Construction Worker', expectedPay: 850, actualPay: 600, wageTheftAmount: 250, riskLevel: 'High Risk', status: 'Possible Wage Theft', admin_action: 'APPROVED', createdAt: '2026-07-21T14:30:00Z' }
    ];
  }
};

/**
 * Admin: Approve or Reject Report
 */
export const actOnReportAPI = async (reportId, action, token) => {
  try {
    const response = await apiClient.post('/api/admin/reports/action', { reportId, action }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { status: action, reportId };
  }
};

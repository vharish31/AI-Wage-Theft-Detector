// Helper functions to manage verification history in localStorage

const STORAGE_KEY = 'verification_history';

/**
 * Get active user from localStorage/sessionStorage helper
 */
export const getActiveUserFromStorage = () => {
  try {
    const saved = localStorage.getItem('wt_user') || sessionStorage.getItem('wt_user');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse active user from storage:', e);
  }
  // Default to demo user Harish
  return {
    userId: 'usr-worker-01',
    name: 'Harish',
    email: 'user@wagedetector.com',
    role: 'USER'
  };
};

/**
 * Get verification history scoped to the logged-in user
 */
export const getVerificationHistory = (activeUser = null) => {
  const user = activeUser || getActiveUserFromStorage();
  const userId = user?.userId || 'usr-worker-01';
  const userName = (user?.name || 'Harish').toLowerCase();
  const userRole = user?.role || 'USER';

  let allHistory = [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        allHistory = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading verification history:', e);
  }

  // If empty, generate default initial sample records for Harish
  if (allHistory.length === 0) {
    const defaultHistory = [
      {
        id: 'hist-101',
        userId: 'usr-worker-01',
        user_name: 'Harish',
        date: '26 Jul 2026, 02:30 PM',
        timestamp: Date.now() - 3600000,
        verification_method: 'Upload Payslip (AI OCR)',
        job_type: 'Construction Worker',
        location: 'Chennai, TN',
        hours_worked: 8.0,
        expected_wage: 855.0,
        received_amount: 600.0,
        difference: 255.0,
        risk_level: 'High Risk',
        risk_score: 29.8,
        is_underpaid: true,
        legal_ref: 'Tamil Nadu Minimum Wages Act - Building & Construction',
        fullResult: {
          job_type: 'Construction Worker',
          location: 'Chennai',
          state: 'Tamil Nadu',
          expected_wage: 855.0,
          received_amount: 600.0,
          difference: 255.0,
          risk_score: 29.8,
          risk_level: 'High',
          is_underpaid: true,
          hourly_rate_expected: 106.87,
          hourly_rate_received: 75.00,
          worker_name: 'Harish',
          legal_ref: 'Tamil Nadu Minimum Wages Act - Building & Construction',
          verification_method: 'Upload Payslip (AI OCR)'
        }
      },
      {
        id: 'hist-102',
        userId: 'usr-worker-01',
        user_name: 'Harish',
        date: '25 Jul 2026, 11:15 AM',
        timestamp: Date.now() - 86400000,
        verification_method: 'Voice Verification',
        job_type: 'Painter',
        location: 'Chennai, TN',
        hours_worked: 8.0,
        expected_wage: 900.0,
        received_amount: 700.0,
        difference: 200.0,
        risk_level: 'Medium Risk',
        risk_score: 22.2,
        is_underpaid: true,
        legal_ref: 'Minimum Wages Act, 1948',
        fullResult: {
          job_type: 'Painter',
          location: 'Chennai',
          state: 'Tamil Nadu',
          expected_wage: 900.0,
          received_amount: 700.0,
          difference: 200.0,
          risk_score: 22.2,
          risk_level: 'Medium',
          is_underpaid: true,
          hourly_rate_expected: 112.50,
          hourly_rate_received: 87.50,
          worker_name: 'Harish',
          legal_ref: 'Minimum Wages Act, 1948',
          verification_method: 'Voice Verification'
        }
      },
      {
        id: 'hist-103',
        userId: 'usr-worker-01',
        user_name: 'Harish',
        date: '24 Jul 2026, 06:45 PM',
        timestamp: Date.now() - 172800000,
        verification_method: 'Gig Platform Audit',
        job_type: 'Swiggy Delivery Partner',
        location: 'Chennai, TN',
        hours_worked: 8.0,
        expected_wage: 875.0,
        received_amount: 720.0,
        difference: 155.0,
        risk_level: 'Medium Risk',
        risk_score: 17.7,
        is_underpaid: true,
        legal_ref: 'Code on Social Security, 2020 (Gig Workers)',
        fullResult: {
          is_gig: true,
          platform: 'Swiggy',
          task_type: 'Delivery',
          completed_tasks: 25,
          rate_per_task: 35,
          job_type: 'Swiggy Delivery Partner',
          location: 'Chennai',
          state: 'Tamil Nadu',
          net_expected_payment: 875.0,
          actual_payment: 720.0,
          expected_wage: 875.0,
          received_amount: 720.0,
          difference: 155.0,
          risk_score: 17.7,
          risk_level: 'Medium',
          is_underpaid: true,
          worker_name: 'Harish',
          legal_ref: 'Code on Social Security, 2020 (Gig Workers)',
          verification_method: 'Gig Platform Audit'
        }
      }
    ];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHistory));
    } catch (e) {
      console.error('Error writing default history:', e);
    }
    allHistory = defaultHistory;
  }

  // Admin users can see all verifications
  if (userRole === 'ADMIN') {
    return allHistory;
  }

  // Normal users see ONLY their own records matching userId or user_name
  return allHistory.filter((item) => {
    if (item.userId && item.userId === userId) return true;
    if (item.user_name && item.user_name.toLowerCase() === userName) return true;
    // Default fallback for Harish if userId is not stamped
    if (userName === 'harish' && (!item.userId || item.userId === 'usr-worker-01')) return true;
    return false;
  });
};

/**
 * Save a verification audit record strictly tied to the logged-in user
 */
export const saveVerificationToHistory = (auditResult, methodLabel = 'Manual Verification', activeUser = null) => {
  if (!auditResult) return [];
  try {
    const user = activeUser || getActiveUserFromStorage();
    const userId = user?.userId || 'usr-worker-01';
    const userName = user?.name || 'Harish';

    // Retrieve full raw history list
    let rawHistory = [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) rawHistory = JSON.parse(data);
    } catch (e) {
      console.error('Error reading raw history:', e);
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const expected = auditResult.net_expected_payment || auditResult.expected_wage || 0;
    const received = auditResult.actual_payment || auditResult.received_amount || 0;
    const difference = auditResult.difference !== undefined ? auditResult.difference : Math.max(0, expected - received);

    let riskLvl = auditResult.risk_level || 'Low Risk';
    if (!riskLvl.includes('Risk') && !riskLvl.includes('Issue')) {
      riskLvl = `${riskLvl} Risk`;
    }

    const newItem = {
      id: `hist_${Date.now()}`,
      userId: userId,
      user_name: userName,
      date: formattedDate,
      timestamp: Date.now(),
      verification_method: methodLabel,
      job_type: auditResult.is_gig 
        ? `${auditResult.platform || 'Gig'} ${auditResult.task_type || 'Task'}` 
        : (auditResult.job_type || 'Worker'),
      location: auditResult.location || 'Chennai',
      hours_worked: auditResult.hours_worked || auditResult.working_hours || 8,
      expected_wage: expected,
      received_amount: received,
      difference: difference,
      risk_level: riskLvl,
      risk_score: auditResult.risk_score || 0,
      is_underpaid: auditResult.is_underpaid ?? difference > 0,
      legal_ref: auditResult.legal_ref || 'Minimum Wages Act, 1948',
      fullResult: {
        ...auditResult,
        worker_name: userName,
        verification_method: methodLabel
      }
    };

    const updatedAll = [newItem, ...rawHistory];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
    
    // Return user-scoped list
    return getVerificationHistory(user);
  } catch (e) {
    console.error('Error saving verification to history:', e);
    return [];
  }
};

/**
 * Delete a specific record
 */
export const deleteHistoryItem = (id, activeUser = null) => {
  try {
    const user = activeUser || getActiveUserFromStorage();
    let rawHistory = [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) rawHistory = JSON.parse(data);
    } catch (e) {
      console.error('Error reading raw history:', e);
    }

    const updatedAll = rawHistory.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));

    return getVerificationHistory(user);
  } catch (e) {
    console.error('Error deleting history item:', e);
    return [];
  }
};

/**
 * Clear history scoped to the logged-in user only
 */
export const clearVerificationHistory = (activeUser = null) => {
  try {
    const user = activeUser || getActiveUserFromStorage();
    const userId = user?.userId || 'usr-worker-01';
    const userName = (user?.name || 'Harish').toLowerCase();
    const userRole = user?.role || 'USER';

    if (userRole === 'ADMIN') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    let rawHistory = [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) rawHistory = JSON.parse(data);
    } catch (e) {
      console.error('Error reading raw history:', e);
    }

    // Preserve other users' records
    const remaining = rawHistory.filter(item => {
      if (item.userId && item.userId === userId) return false;
      if (item.user_name && item.user_name.toLowerCase() === userName) return false;
      return true;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    return [];
  } catch (e) {
    console.error('Error clearing history:', e);
    return [];
  }
};


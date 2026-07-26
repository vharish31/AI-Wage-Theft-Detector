import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

export function useVerificationRouter() {
  const navigate = useNavigate();

  const selectAndRoute = (method) => {
    // 1. Remember in localStorage for instant preselection upon next login
    localStorage.setItem('last_verification_method', method);

    // 2. Fire-and-forget background log to backend (non-blocking)
    apiClient.post('/verification-method/select', {
      selected_method: method,
      user_id: 'user-01',
      timestamp: new Date().toISOString()
    }).catch((err) => {
      console.warn('Backend method select log skipped:', err.message);
    });

    // 3. Route INSTANTLY to target verification flow
    if (method === 'payslip') {
      navigate('/verification?mode=payslip');
    } else if (method === 'voice') {
      navigate('/voice-log');
    } else {
      navigate('/verification?mode=manual');
    }
  };

  return { selectAndRoute };
}

export default function VerificationRouter({ children }) {
  return <>{children}</>;
}

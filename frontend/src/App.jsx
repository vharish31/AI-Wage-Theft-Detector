import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VoiceLog from './pages/VoiceLog';
import Verification from './pages/Verification';
import Report from './pages/Report';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [workData, setWorkData] = useState(null);
  const [auditResult, setAuditResult] = useState(null);

  const isStep1Unlocked = Boolean(hasStarted || workData);
  const isStep1Complete = Boolean(workData && workData.job_type && workData.hours_worked && workData.location);
  const isStep2Complete = Boolean(auditResult);

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#0b1329] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        <div>
          <Navbar hasStarted={hasStarted} workData={workData} auditResult={auditResult} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home onStartDetection={() => setHasStarted(true)} />} />
              <Route 
                path="/voice-log" 
                element={
                  isStep1Unlocked ? (
                    <VoiceLog workData={workData} setWorkData={setWorkData} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/verification" 
                element={
                  isStep1Complete ? (
                    <Verification workData={workData} setAuditResult={setAuditResult} />
                  ) : (
                    <Navigate to={isStep1Unlocked ? "/voice-log" : "/"} replace />
                  )
                } 
              />
              <Route 
                path="/report" 
                element={
                  isStep2Complete ? (
                    <Report auditResult={auditResult} />
                  ) : (
                    <Navigate to={isStep1Complete ? "/verification" : (isStep1Unlocked ? "/voice-log" : "/")} replace />
                  )
                } 
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

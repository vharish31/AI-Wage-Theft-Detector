import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VoiceLog from './pages/VoiceLog';
import Verification from './pages/Verification';
import Report from './pages/Report';

export default function App() {
  const [workData, setWorkData] = useState(null);

  const [auditResult, setAuditResult] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#0b1329] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/voice-log" 
                element={<VoiceLog workData={workData} setWorkData={setWorkData} />} 
              />
              <Route 
                path="/verification" 
                element={<Verification workData={workData} setAuditResult={setAuditResult} />} 
              />
              <Route 
                path="/report" 
                element={<Report auditResult={auditResult} />} 
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

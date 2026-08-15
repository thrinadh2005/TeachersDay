import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SubmissionForm } from './components/SubmissionForm';
import { VotingWall } from './components/VotingWall';
import { FunWall } from './components/FunWall';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { api } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'register' | 'vote' | 'memories' | 'admin'
  const [showcaseData, setShowcaseData] = useState(null);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    fundsCollected: 0,
    totalVotes: 0
  });

  const loadShowcaseData = async () => {
    try {
      const res = await api.getShowcase();
      if (res.success && res.data) {
        setShowcaseData(res.data);
        const teachersRes = await api.getTeachers();
        const totalVotes = teachersRes.success
          ? teachersRes.data.reduce((acc, t) => acc + (t.votes || 0), 0)
          : 0;

        setStats({
          totalParticipants: res.data.totalParticipants || 0,
          fundsCollected: res.data.fundsCollected || 0,
          totalVotes: totalVotes
        });
      }
    } catch (err) {
      console.error('Failed to load showcase data:', err);
    }
  };

  useEffect(() => {
    loadShowcaseData();
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionCompleted = () => {
    loadShowcaseData();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabSwitch} />

      {/* Main Content Area */}
      <main className="flex-grow pb-mobile-nav md:pb-0">
        
        {/* PAGE 1: HOME */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            <HeroSection setActiveTab={handleTabSwitch} stats={stats} />
          </div>
        )}

        {/* PAGE 2: MULTI-STEP REGISTRATION, VOTING & PAYMENT (FULL PAGE) */}
        {activeTab === 'register' && (
          <div className="animate-fadeIn py-4">
            <SubmissionForm onSubmissionCompleted={handleSubmissionCompleted} />
          </div>
        )}

        {/* PAGE 3: GRAND AWARD RESULTS CEREMONY */}
        {activeTab === 'vote' && (
          <div className="animate-fadeIn">
            <VotingWall setActiveTab={handleTabSwitch} />
          </div>
        )}

        {/* PAGE 4: CRAZY THINGS ABOUT FACULTY (ADMIN APPROVED & ANONYMOUS) */}
        {activeTab === 'memories' && (
          <div className="animate-fadeIn">
            <FunWall setActiveTab={handleTabSwitch} />
          </div>
        )}

        {/* PAGE 5: ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <div className="animate-fadeIn">
            <AdminDashboard />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabSwitch} />

    </div>
  );
}

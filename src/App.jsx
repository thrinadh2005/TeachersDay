import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PaymentSection } from './components/PaymentSection';
import { VotingSection } from './components/VotingSection';
import { VotingWall } from './components/VotingWall';
import { FunWall } from './components/FunWall';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { api } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'pay' | 'vote-faculty' | 'vote' | 'memories' | 'admin'
  const [voterRoll, setVoterRoll] = useState('');
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

    // Check URL hash or query param for tab routing
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab') || searchParams.get('page');
    const path = window.location.pathname.toLowerCase();

    if (hash === 'admin' || tabParam === 'admin' || path.includes('/admin')) {
      setActiveTab('admin');
    } else if (['pay', 'register', 'vote-faculty', 'vote', 'awards', 'memories'].includes(hash)) {
      setActiveTab(hash === 'register' ? 'pay' : hash === 'awards' ? 'vote' : hash);
    } else if (['pay', 'register', 'vote-faculty', 'vote', 'awards', 'memories'].includes(tabParam)) {
      setActiveTab(tabParam === 'register' ? 'pay' : tabParam === 'awards' ? 'vote' : tabParam);
    }
  }, []);

  const handleTabSwitch = (tab) => {
    const targetTab = tab === 'register' ? 'pay' : tab === 'awards' ? 'vote' : tab;
    setActiveTab(targetTab);
    if (targetTab === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionCompleted = () => {
    loadShowcaseData();
  };

  const handleProceedToVoting = (roll) => {
    if (roll) {
      setVoterRoll(roll);
    }
    setActiveTab('vote-faculty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* OPTION 1: DEDICATED PAYMENT & CONTRIBUTION (CSE 2nd & 3rd Year) */}
        {activeTab === 'pay' && (
          <div className="animate-fadeIn py-4">
            <PaymentSection 
              onSubmissionCompleted={handleSubmissionCompleted} 
              onProceedToVoting={handleProceedToVoting}
            />
          </div>
        )}

        {/* OPTION 2: DEDICATED FACULTY VOTING & ANONYMOUS STORIES */}
        {activeTab === 'vote-faculty' && (
          <div className="animate-fadeIn py-4">
            <VotingSection 
              initialRollNumber={voterRoll}
              setActiveTab={handleTabSwitch}
            />
          </div>
        )}

        {/* PAGE 4: GRAND AWARD RESULTS CEREMONY */}
        {activeTab === 'vote' && (
          <div className="animate-fadeIn">
            <VotingWall setActiveTab={handleTabSwitch} />
          </div>
        )}

        {/* PAGE 5: CRAZY THINGS ABOUT FACULTY (APPROVED STORIES WALL) */}
        {activeTab === 'memories' && (
          <div className="animate-fadeIn">
            <FunWall setActiveTab={handleTabSwitch} />
          </div>
        )}

        {/* PAGE 6: ADMIN PORTAL */}
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

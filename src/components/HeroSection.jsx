import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Vote, 
  MessageSquare, 
  Code,
  CreditCard,
  ChevronRight,
  GraduationCap,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Users,
  Coins,
  Award,
  ArrowRight
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { fireFestiveConfetti, fireTrophyConfetti } from '../utils/confetti';

export const HeroSection = ({ setActiveTab, stats }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const [paidRoll, setPaidRoll] = useState('');

  useEffect(() => {
    try {
      const roll = localStorage.getItem('teachers_day_paid_roll');
      if (roll) {
        setPaidRoll(roll);
        setHasPaid(true);
      }
    } catch (e) {}
  }, []);

  const handleGoToPay = () => {
    fireFestiveConfetti();
    setActiveTab('pay');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToVote = () => {
    fireTrophyConfetti();
    setActiveTab('vote-faculty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      
      {/* Background Floating Warm Gold & Indigo Ambient Halos */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-amber-500/15 to-yellow-500/15 blur-[140px] pointer-events-none -z-10 rounded-full animate-pulse-glow"></div>
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
      <div className="absolute top-1/2 -right-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-float"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top CSE Festive Tag */}
        <div className="flex justify-center">
          <div 
            onClick={fireFestiveConfetti}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:border-amber-400/50 cursor-pointer transition-all hover:scale-105 touch-press group shadow-xl border border-slate-200 dark:border-white/10 animate-float bg-white dark:bg-slate-950"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <Code className="w-4 h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300">
              CSE Department • 2nd & 3rd Years (Sections 2A-2D, 3A-3D)
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Hero Main Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.15] text-slate-900 dark:text-white drop-shadow-sm">
            Honouring Our <span className="gradient-text-gold">CSE Teachers</span> & Mentors
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed px-2">
            Exclusively for <span className="text-amber-600 dark:text-amber-400 font-extrabold">CSE 2nd & 3rd Year Students</span>. Complete your ₹50 celebration pass or cast your confidential faculty votes across 5 superlative categories below.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🔥 TWO DISTINCT TRACKS: 1. PAYMENT & PASS vs 2. VOTING & STORIES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pt-4">
          
          {/* TRACK 1: 💳 PAYMENT & CELEBRATION PASS */}
          <div 
            onClick={handleGoToPay}
            className="glass-card-glow rounded-3xl p-6 sm:p-8 border-2 border-amber-400 hover:border-amber-300 transition-all cursor-pointer hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-6 group touch-press bg-white dark:bg-slate-950 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center border border-amber-400/40">
                  1
                </span>
                <span className="text-[11px] uppercase font-black tracking-wider px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  {hasPaid ? '✓ Pass Active' : 'Step 1 • ₹50 Contribution'}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>💳 Payment & Celebration Pass</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                  {hasPaid 
                    ? `Celebration pass for ${paidRoll} is active & verified. Click to view or print your digital slip.`
                    : 'Enter your 10-digit JNTU Roll Number and Section (2A-2D, 3A-3D) to contribute ₹50 and get your Official Digital Pass.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Eligibility</span>
                  <span className="font-bold text-slate-900 dark:text-white">CSE 2nd & 3rd Year</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Pass Receipt</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> QR Verified Slip
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl touch-press ${
                hasPaid
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <span>{hasPaid ? 'View / Print Celebration Pass' : 'Pay ₹50 & Get Celebration Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* TRACK 2: 🗳️ VOTE FACULTY & CRAZY STORIES */}
          <div 
            onClick={handleGoToVote}
            className="glass-card-glow rounded-3xl p-6 sm:p-8 border-2 border-purple-400 hover:border-purple-300 transition-all cursor-pointer hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-6 group touch-press bg-white dark:bg-slate-950 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-700 dark:text-purple-300 font-black text-sm flex items-center justify-center border border-purple-400/40">
                  2
                </span>
                <span className="text-[11px] uppercase font-black tracking-wider px-3 py-1 rounded-full bg-purple-600 text-white shadow-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Secret & Anonymous
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span>🗳️ Vote Faculty & Stories</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                  Cast confidential secret ballot votes across 5 award categories for all 39 faculty members and submit 100% anonymous classroom memories!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Superlatives</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">5 Award Categories</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Faculty Roster</span>
                  <span className="font-bold text-slate-900 dark:text-white">39 Professors Nominated</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-purple-500/25 touch-press"
            >
              <span>Cast Secret Votes & Stories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Live Quick Links Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => { setActiveTab('vote'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-amber-400 shadow-sm transition-all touch-press hover:scale-[1.02]"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Award Reveal Ceremony</span>
          </button>

          <button
            onClick={() => { setActiveTab('memories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-pink-400 shadow-sm transition-all touch-press hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4 text-pink-500" />
            <span>Read Crazy Stories Wall</span>
          </button>
        </div>

        {/* Countdown Timer Component */}
        <CountdownTimer />

      </div>
    </section>
  );
};

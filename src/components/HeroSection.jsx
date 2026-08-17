import React from 'react';
import { 
  Sparkles, 
  Vote, 
  MessageSquare, 
  Code,
  CreditCard,
  ChevronRight,
  GraduationCap,
  Trophy,
  ShieldCheck
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { fireFestiveConfetti, fireTrophyConfetti } from '../utils/confetti';

export const HeroSection = ({ setActiveTab }) => {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top CSE Festive Tag */}
        <div className="flex justify-center mb-6">
          <div 
            onClick={fireFestiveConfetti}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:border-amber-400/50 cursor-pointer transition-all hover:scale-105 touch-press group shadow-xl border border-white/10 animate-float"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <Code className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-amber-400 group-hover:text-amber-300">
              CSE Department • 2nd & 3rd Years (Sections 2A-2D, 3A-3D)
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Hero Main Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.15] drop-shadow-sm">
            Honouring Our <span className="gradient-text-gold">CSE Teachers</span> & Mentors
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed px-2">
            Exclusively for <span className="text-amber-400 font-extrabold">CSE 2nd & 3rd Year Students</span>: Choose an option below to complete your <span className="text-amber-400 font-bold">₹50 payment</span> or cast your <span className="text-purple-300 font-bold">confidential faculty votes</span>!
          </p>
        </div>

        {/* DUAL PROMINENT ACTION BUTTONS */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          
          {/* OPTION 1: PAYMENT */}
          <button
            onClick={handleGoToPay}
            className="w-full sm:w-1/2 relative group inline-flex items-center justify-between p-4 sm:p-5 rounded-3xl text-left text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all duration-300 ring-4 ring-amber-400/30 touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-black tracking-wider text-slate-900/80">Option 1</div>
                <div className="text-sm sm:text-base font-black leading-tight">Payment (₹50)</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* OPTION 2: VOTING & STORIES */}
          <button
            onClick={handleGoToVote}
            className="w-full sm:w-1/2 relative group inline-flex items-center justify-between p-4 sm:p-5 rounded-3xl text-left text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl shadow-purple-500/30 hover:scale-105 transition-all duration-300 ring-4 ring-purple-500/30 touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-black tracking-wider text-purple-200">Option 2</div>
                <div className="text-sm sm:text-base font-black leading-tight">Vote Faculty & Stories</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

        {/* Secondary Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-6">
          <button
            onClick={() => { setActiveTab('vote'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 glass-card hover:border-amber-400/40 hover:bg-white/5 transition-all touch-press hover:scale-[1.02]"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Award Reveal Ceremony</span>
          </button>

          <button
            onClick={() => { setActiveTab('memories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 glass-card hover:border-pink-400/40 hover:bg-white/5 transition-all touch-press hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4 text-pink-400" />
            <span>Read Crazy Stories Wall</span>
          </button>
        </div>

        {/* 2 MAIN DEDICATED OPTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-10">
          
          {/* Card 1 */}
          <div 
            onClick={handleGoToPay}
            className="glass-card p-6 rounded-3xl border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all hover:scale-[1.02] touch-press group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                Direct Contribution
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Option 1: Payment & Registration</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your Roll Number & Section (`CSE 2A..2D`, `CSE 3A..3D`), choose optional speech interest, and pay ₹50 to get your instant Official Acknowledgement Receipt.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={handleGoToVote}
            className="glass-card p-6 rounded-3xl border border-white/10 hover:border-purple-400/40 cursor-pointer transition-all hover:scale-[1.02] touch-press group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-400/20">
                100% Secret & Anonymous
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
              <Vote className="w-4 h-4 text-purple-400" />
              <span>Option 2: Vote Faculty & Crazy Stories</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vote across 5 award categories for all 39 faculty members (33 CSE + 6 Allied Professors) under secret ballot, and share 100% anonymous classroom memories!
            </p>
          </div>

        </div>

        {/* Countdown Timer Component */}
        <CountdownTimer />

      </div>
    </section>
  );
};

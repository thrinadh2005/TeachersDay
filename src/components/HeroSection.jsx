import React from 'react';
import { 
  Sparkles, 
  Vote, 
  MessageSquare, 
  Code,
  Play,
  ChevronRight,
  GraduationCap,
  Award
} from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { fireFestiveConfetti } from '../utils/confetti';

export const HeroSection = ({ setActiveTab }) => {
  const handleStart = () => {
    fireFestiveConfetti();
    setActiveTab('register');
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
              CSE Department • 2nd, 3rd & 4th Years (Sec A, B, C, D)
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
            Exclusively for <span className="text-amber-400 font-extrabold">CSE 2nd, 3rd & 4th Year Students (Sections A, B, C, D)</span>: Vote for your favorite faculty, share classroom memories, and complete your <span className="text-amber-400 font-bold">₹50 celebration contribution</span>!
          </p>
        </div>

        {/* ULTRA-PROMINENT START BUTTON & ACTION BAR */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-4">
          
          <button
            onClick={handleStart}
            className="relative group inline-flex items-center gap-3.5 sm:gap-4 px-8 sm:px-11 py-4 sm:py-5 rounded-3xl text-base sm:text-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all duration-300 ring-4 ring-amber-400/30 touch-press"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900/80">
                Click to Contribute
              </div>
              <div className="text-sm sm:text-lg font-black tracking-tight leading-tight">
                CONTRIBUTE YOUR PART (₹50)
              </div>
            </div>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Secondary Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={() => { setActiveTab('vote'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 glass-card hover:border-amber-400/40 hover:bg-white/5 transition-all touch-press hover:scale-[1.02]"
            >
              <Vote className="w-4 h-4 text-amber-400" />
              <span>View Voting Results</span>
            </button>

            <button
              onClick={() => { setActiveTab('memories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 glass-card hover:border-amber-400/40 hover:bg-white/5 transition-all touch-press hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Read Crazy Things About Faculty</span>
            </button>
          </div>

        </div>

        {/* 3-STEP QUICK FLOW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 max-w-5xl mx-auto mt-10">
          
          <div 
            onClick={handleStart}
            className="glass-card p-5 rounded-3xl border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all hover:scale-[1.02] touch-press group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                CSE 2nd, 3rd, 4th Year
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Step 1: Enter CSE Details
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Select your Year (2nd, 3rd, 4th) and Section (A, B, C, D) with your college roll number.
            </p>
          </div>

          <div 
            onClick={handleStart}
            className="glass-card p-5 rounded-3xl border border-white/10 hover:border-indigo-400/40 cursor-pointer transition-all hover:scale-[1.02] touch-press group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-400/20">
                Secret Ballot
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Step 2: Faculty Superlative Voting
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Vote across 5 award categories for 33 CSE faculty members under strict secret ballot.
            </p>
          </div>

          <div 
            onClick={handleStart}
            className="glass-card p-5 rounded-3xl border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all hover:scale-[1.02] touch-press group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
                ₹50 Pay
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Step 3: ₹50 Contribution & Done
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Complete your ₹50 contribution securely via Instant UPI (GPay, PhonePe, Paytm, QR Code).
            </p>
          </div>

        </div>

        {/* Countdown Timer Component */}
        <CountdownTimer />

      </div>
    </section>
  );
};

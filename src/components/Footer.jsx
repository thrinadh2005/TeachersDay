import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  ShieldCheck,
  Code
} from 'lucide-react';
import { fireFestiveConfetti } from '../utils/confetti';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer className="relative mt-8 sm:mt-16 border-t border-white/10 glass-nav text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        
        {/* DESKTOP RICH 4-COLUMN FOOTER */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-base font-black text-white font-display">
                GURU<span className="gradient-text-festive">UTSAV</span> 2026
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official platform for CSE Department (2nd, 3rd & 4th Years, Sections A-D). Celebrating our faculty with gratitude, awards, and tributes.
            </p>
            <div className="pt-1">
              <button
                onClick={fireFestiveConfetti}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-[11px] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Confetti 🎉</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Contribute (₹50)</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('vote'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Grand Award Results
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('memories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Crazy Things About Faculty
                </button>
              </li>
            </ul>
          </div>

          {/* Contribution */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">CSE Contribution</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official celebration contribution for all CSE 2nd, 3rd & 4th Year students across Sections A, B, C, and D for Teachers' Day 2026.
            </p>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified via Secure UPI Transfer</span>
            </div>
          </div>

          {/* Coordination Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">CSE Committee</h4>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Teachers' Day • September 5, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>GMRIT • CSE Department</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                <span>CSE 2nd, 3rd & 4th Year Coordinators</span>
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE COMPACT SLIM FOOTER */}
        <div className="md:hidden flex flex-col items-center justify-center text-center space-y-2 pb-2">
          <div 
            onDoubleClick={() => {
              fireFestiveConfetti();
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <span className="text-sm font-black text-white font-display">
              GURU<span className="gradient-text-festive">UTSAV</span> 2026
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            GMRIT • CSE Department (2nd, 3rd & 4th Years)
          </p>
          <div 
            onDoubleClick={() => {
              fireFestiveConfetti();
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[10px] text-slate-500 pt-1 border-t border-white/5 w-full cursor-pointer select-none"
          >
            © 2026 GMRIT CSE • Built with gratitude for our Teachers
          </div>
        </div>

        {/* DESKTOP BOTTOM COPYRIGHT */}
        <div className="hidden md:flex border-t border-white/10 pt-6 flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div 
            onDoubleClick={() => {
              fireFestiveConfetti();
              setActiveTab('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer select-none"
          >
            © 2026 GMR Institute of Technology • Computer Science & Engineering Department.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with gratitude for our beloved CSE Professors.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

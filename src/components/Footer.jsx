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
    <footer className="relative mt-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5">
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
                  <span>Contribute Your Part (₹50)</span>
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
              <li>
                <button onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
                  Admin Portal (PIN: 2026)
                </button>
              </li>
            </ul>
          </div>

          {/* Contribution */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">CSE Celebration Contribution</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Mandatory ₹50 contribution for all CSE 2nd, 3rd & 4th Year students across Sections A, B, C, and D for Teachers' Day 2026.
            </p>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified via Razorpay Gateway</span>
            </div>
          </div>

          {/* Coordination Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">CSE Student Committee</h4>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Teachers' Day Celebration • September 5, 2026</span>
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

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
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

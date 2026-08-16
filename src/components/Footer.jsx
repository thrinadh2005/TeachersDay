import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  ShieldCheck,
  Code,
  FileText,
  RotateCcw,
  Mail,
  Ticket,
  MapPin
} from 'lucide-react';
import { fireFestiveConfetti } from '../utils/confetti';
import { PolicyModal } from './PolicyModal';

export const Footer = ({ setActiveTab }) => {
  const [policyTab, setPolicyTab] = useState(null);

  const openPolicy = (tab) => {
    setPolicyTab(tab);
  };

  return (
    <>
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
                Official Event Registration & Student Delegate Pass Portal for CSE Department (2nd, 3rd & 4th Years, Sections A-D). Celebrating our faculty with gratitude, awards, and tributes.
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
                    <span>Event Pass (₹50)</span>
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

            {/* Mandatory Legal & Policies (Razorpay Compliance) */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Legal & Policies</h4>
              <ul className="space-y-1.5">
                <li>
                  <button 
                    onClick={() => openPolicy('terms')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terms & Conditions</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('privacy')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('refund')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Refund & Cancellation</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('pricing')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5 text-slate-400" />
                    <span>Event Pass Pricing (₹50)</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openPolicy('contact')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Us & Support</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Event & Coordination Contacts */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Event Coordination</h4>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Teachers' Day • September 5, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-purple-400" />
                  <span>GMRIT • CSE Department</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rajam, Andhra Pradesh - 532127</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure Razorpay Gateway</span>
                </div>
              </div>
            </div>

          </div>

          {/* MOBILE COMPACT SLIM FOOTER */}
          <div className="md:hidden flex flex-col items-center justify-center text-center space-y-3 pb-2">
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

            {/* Mobile Policy Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-white/5 w-full">
              <button onClick={() => openPolicy('terms')} className="hover:text-amber-300">Terms</button>
              <span>•</span>
              <button onClick={() => openPolicy('privacy')} className="hover:text-amber-300">Privacy</button>
              <span>•</span>
              <button onClick={() => openPolicy('refund')} className="hover:text-amber-300">Refunds</button>
              <span>•</span>
              <button onClick={() => openPolicy('pricing')} className="hover:text-amber-300">Pass (₹50)</button>
              <span>•</span>
              <button onClick={() => openPolicy('contact')} className="hover:text-amber-300">Contact</button>
            </div>

            <div 
              onDoubleClick={() => {
                fireFestiveConfetti();
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[10px] text-slate-500 pt-1 cursor-pointer select-none"
            >
              © 2026 GMRIT CSE • Official Event Delegate Pass Portal
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
            <div className="flex items-center gap-3 text-slate-400">
              <button onClick={() => openPolicy('terms')} className="hover:text-white">Terms & Conditions</button>
              <span>•</span>
              <button onClick={() => openPolicy('privacy')} className="hover:text-white">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => openPolicy('refund')} className="hover:text-white">Refund Policy</button>
              <span>•</span>
              <button onClick={() => openPolicy('contact')} className="hover:text-white">Contact Us</button>
            </div>
          </div>

        </div>
      </footer>

      {/* POLICY MODAL */}
      {policyTab && (
        <PolicyModal initialTab={policyTab} onClose={() => setPolicyTab(null)} />
      )}
    </>
  );
};

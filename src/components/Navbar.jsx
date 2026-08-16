import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  ShieldCheck, 
  Menu, 
  X, 
  Sun,
  Moon,
  CreditCard,
  MessageSquare,
  Home
} from 'lucide-react';
import { fireFestiveConfetti } from '../utils/confetti';
import { getInitialTheme, applyTheme } from '../utils/theme';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'register', label: 'Event Pass (₹50)', icon: CreditCard, isHighlight: true },
    { id: 'vote', label: 'Grand Awards', icon: Trophy },
    { id: 'memories', label: 'Crazy Things', icon: MessageSquare },
  ];

  const handleNavClick = (id) => {
    if (id === 'register') {
      fireFestiveConfetti();
    }
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Secret Admin Triggers: Double-click / double-tap tracking & Keyboard shortcut (Ctrl+Shift+A)
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleSecretAdminTrigger = () => {
    fireFestiveConfetti();
    setActiveTab('admin');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        handleSecretAdminTrigger();
        return 0;
      }
      setTimeout(() => setLogoClickCount(0), 500);
      return next;
    });
    handleNavClick('home');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret combo: Ctrl + Shift + A (or Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleSecretAdminTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <>
      {/* TOP DESKTOP & MOBILE HEADER */}
      <header className="sticky top-0 z-50 glass-nav border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & Title with Secret Double-Click / Double-Tap for Admin */}
            <div 
              onClick={handleLogoClick}
              onDoubleClick={handleSecretAdminTrigger}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
              title="GURU UTSAV 2026 (Double-click logo for Admin Portal)"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-2xl font-black font-display tracking-tight text-white group-hover:text-purple-300 transition-colors">
                    GURU<span className="gradient-text-festive font-black">UTSAV</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold bg-amber-400/15 text-amber-400 border border-amber-400/30 rounded-md">
                    CSE 2026
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 hidden xs:block">
                  CSE 2nd, 3rd, 4th Year (Sections A-D)
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                if (item.isHighlight) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all touch-press active:scale-95 ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/50 scale-105'
                          : 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 touch-press ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Theme Switcher Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light Royal' : 'Midnight Dark'} Mode`}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300 transition-all touch-press hover:scale-105 ml-1"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-500" />
                ) : (
                  <Moon className="w-4 h-4 text-purple-400 hover:-rotate-12 transition-transform duration-500" />
                )}
              </button>
            </nav>

            {/* Mobile Header Quick Actions */}
            <div className="flex items-center md:hidden gap-1.5">
              {/* Theme Toggle (Mobile) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-400 touch-press"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-purple-400" />}
              </button>

              {/* Quick Contribute Button */}
              <button
                onClick={() => handleNavClick('register')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md touch-press"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>₹50</span>
              </button>

              {/* Drawer Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 touch-press"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-nav border-b border-white/10 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all touch-press ${
                    item.isHighlight && isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : isActive
                        ? 'bg-purple-600/30 text-white border border-purple-500/30'
                        : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ==========================================================
          📱 FLOATING MOBILE BOTTOM NAVIGATION BAR (Instant 1-Thumb Touch)
          ========================================================== */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="glass-card rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all touch-press ${
                  item.isHighlight && isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                    : item.isHighlight
                      ? 'text-amber-400 font-bold hover:bg-amber-400/10'
                      : isActive
                        ? 'bg-purple-600/30 text-white border border-purple-500/30'
                        : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isHighlight && isActive ? 'text-slate-950' : isActive ? 'text-amber-400' : ''}`} />
                <span className="text-[10px] font-bold mt-0.5 leading-none">
                  {item.id === 'home' ? 'Home' : item.id === 'register' ? 'Event Pass' : item.id === 'vote' ? 'Awards' : 'Stories'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

export const CountdownTimer = () => {
  // Target: Teachers' Day - September 5, 2026
  const targetDate = new Date('2026-09-05T00:00:00+05:30').getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEventDay: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isEventDay: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, color: 'from-amber-400 to-amber-600' },
    { label: 'HOURS', value: timeLeft.hours, color: 'from-rose-400 to-rose-600' },
    { label: 'MINUTES', value: timeLeft.minutes, color: 'from-purple-400 to-purple-600' },
    { label: 'SECONDS', value: timeLeft.seconds, color: 'from-indigo-400 to-indigo-600' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-pink-500/30 to-purple-500/30 shadow-2xl">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Countdown to Teachers' Day
              </span>
              <h3 className="text-lg font-black text-white font-display">
                Teachers' Day • September 5, 2026
              </h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Registrations & Contributions Open
          </div>
        </div>

        {timeLeft.isEventDay ? (
          <div className="text-center py-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text-festive animate-bounce">
              🎉 HAPPY TEACHERS' DAY 2026! 🎉
            </h2>
            <p className="text-slate-300 mt-2">Celebrating our beloved CSE Professors!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {timeUnits.map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className={`text-3xl sm:text-5xl font-black bg-gradient-to-br ${unit.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-widest mt-1.5 uppercase">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Mic, 
  Award, 
  Users, 
  ArrowRight,
  Code,
  Music,
  Heart,
  Ticket
} from 'lucide-react';

export const EventShowcase = ({ showcaseData, setActiveTab }) => {
  const speakers = showcaseData?.speakers || [];

  const scheduleHighlights = [
    {
      time: '09:00 AM - 09:30 AM',
      title: 'CSE Lamp Lighting & Floral Tributes',
      desc: 'Inauguration by CSE HOD & faculty members with traditional lamp lighting and Dr. Sarvepalli Radhakrishnan tribute.'
    },
    {
      time: '09:30 AM - 11:15 AM',
      title: 'Student Speeches & Faculty Felicitations',
      desc: 'Registered students from 2nd, 3rd, and 4th Years (Sections A, B, C, D) presenting tributes, memories, and appreciation.'
    },
    {
      time: '11:15 AM - 12:30 PM',
      title: 'Student Choice Faculty Awards & Superlative Ceremony',
      desc: 'Presentation of 2026 Student Choice Faculty Trophies based on confidential student votes across award categories.'
    },
    {
      time: '12:30 PM - 02:00 PM',
      title: 'Grand Faculty High-Tea & Refreshments',
      desc: 'Celebratory refreshments, photo sessions, and distribution of commemorative gifts included with student delegate passes.'
    }
  ];

  return (
    <section className="space-y-16 py-8">
      
      {/* SECTION: Student Stage Speeches Lineup (Only shown if students have registered to speak) */}
      {speakers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                <Mic className="w-4 h-4" /> Live Stage Tributes
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
                Registered Student <span className="gradient-text-festive">Speeches & Tributes</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                CSE 2nd, 3rd & 4th Year students sharing words about their mentors on stage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {speakers.map((sp, idx) => (
              <div
                key={sp.id || idx}
                className="glass-card rounded-3xl p-6 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                    <Mic className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Speaker #{idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-300 px-2 py-0.5 rounded bg-purple-500/10">
                      {sp.year} • {sp.section}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                    Tribute to {sp.speechTeacher}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed italic">
                    "{sp.speechTopic}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">{sp.studentName}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">✓ Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Celebration Schedule Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400 flex items-center justify-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4" /> Celebration Roadmap
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
              CSE Celebration Schedule • Sept 5, 2026
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              CSE Department Seminar Hall & Main Auditorium • GMR Institute of Technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scheduleHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3 relative group hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Registration CTA */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600/20 text-purple-300 rounded-xl border border-purple-500/30">
                <Ticket className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Get Your Official Entry Pass</h4>
                <p className="text-xs text-slate-400">₹50 official delegate pass covers student entry badge, mementos & refreshments.</p>
              </div>
            </div>

            <button
              onClick={() => { setActiveTab('submit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              <span>Register Now (₹50 Pass)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

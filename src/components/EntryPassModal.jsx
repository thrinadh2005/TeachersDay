import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  X, 
  Sparkles, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Ticket,
  Printer,
  Mic,
  Code
} from 'lucide-react';
import { fireFestiveConfetti } from '../utils/confetti';

export const EntryPassModal = ({ submission, onClose, onDelete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const passRef = useRef(null);

  useEffect(() => {
    if (submission) {
      fireFestiveConfetti();
      const qrData = JSON.stringify({
        ticket: submission.ticketNumber,
        name: submission.name,
        roll: submission.rollNumber,
        dept: 'CSE',
        year: submission.year,
        section: submission.section,
        speaker: submission.interestedInSpeaking === 'Yes' ? 'YES' : 'NO',
        status: submission.payment?.status || 'verified',
        amount: submission.payment?.amount || 50,
        event: 'TeachersDay2026_CSE'
      });

      QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    }
  }, [submission]);

  if (!submission) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      <div className="relative w-full max-w-lg my-8 bg-slate-900 rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
        
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 p-4 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 mx-auto mb-2 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display">
            CSE Registration Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">
            Official Teachers' Day Celebration 2026 Entry Pass
          </p>
        </div>

        {/* Digital Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6" ref={passRef}>
          
          {/* Card Border Preview */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 p-5 border border-amber-400/30 shadow-inner">
            
            {/* Header Badge */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-400">
                  CSE DEPARTMENT PASS • ₹{submission.payment?.amount || 50} PAID
                </span>
                <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  GURU UTSAV 2026 (CSE)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono">PASS NO</span>
                <div className="text-sm font-mono font-bold text-amber-300">
                  {submission.ticketNumber}
                </div>
              </div>
            </div>

            {/* Student Meta Details */}
            <div className="grid grid-cols-2 gap-4 my-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Student Name</span>
                <span className="font-bold text-white text-base">{submission.name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">JNTU Roll Number</span>
                <span className="font-bold text-purple-300 font-mono">{submission.rollNumber}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Year & Section</span>
                <span className="font-bold text-slate-100 bg-white/5 px-2 py-0.5 rounded">
                  {submission.year} • {submission.section}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Stage Speaker</span>
                <span className={`font-bold flex items-center gap-1 ${
                  submission.interestedInSpeaking === 'Yes' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {submission.interestedInSpeaking === 'Yes' ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>Stage Speaker</span>
                    </>
                  ) : (
                    <span>Attendee</span>
                  )}
                </span>
              </div>
            </div>

            {submission.interestedInSpeaking === 'Yes' && submission.speechTopic && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <span className="font-bold text-amber-400 block mb-0.5">Speaking Topic:</span>
                "{submission.speechTopic}"
              </div>
            )}

            {/* Event Details */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-white/5 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Saturday, September 5, 2026 • 09:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>CSE Seminar Hall & Main Auditorium</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-5 pt-4 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-bold">
                  <Sparkles className="w-3 h-3" /> CSE ADMIT PASS
                </div>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Show at CSE registration desk for celebration badge and refreshments.
                </p>
              </div>

              {qrCodeUrl && (
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <img src={qrCodeUrl} alt="Entry Pass QR" className="w-24 h-24" />
                </div>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-sm text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Pass</span>
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  onDelete(submission.id, submission.name, submission.ticketNumber);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
                title="Delete this pass"
              >
                <span>Delete Pass</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

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
  FileText,
  Printer,
  Mic,
  Code,
  ShieldCheck,
  Check,
  Copy,
  Heart,
  Award
} from 'lucide-react';
import { fireFestiveConfetti } from '../utils/confetti';

export const AcknowledgementModal = ({ submission, onClose, onDelete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (submission) {
      fireFestiveConfetti();
      const qrData = JSON.stringify({
        ackNo: submission.acknowledgementNumber || submission.ticketNumber || `GMRIT-CSE-ACK-${submission.id}`,
        name: submission.name,
        roll: submission.rollNumber,
        dept: 'CSE',
        year: submission.year,
        section: submission.section,
        amount: submission.payment?.amount || 50,
        status: submission.payment?.status || 'verified',
        txn: submission.payment?.transactionId || 'N/A',
        event: 'TeachersDay2026_CSE_Celebration'
      });

      QRCode.toDataURL(qrData, {
        width: 220,
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

  const handleCopyReceipt = () => {
    const text = `🎓 CSE Teachers' Day 2026 Contribution Acknowledgement\nReceipt No: ${submission.acknowledgementNumber || submission.ticketNumber}\nStudent: ${submission.name} (${submission.rollNumber})\nAmount: ₹${submission.payment?.amount || 50} (PAID & VERIFIED)\nDept: Computer Science & Engineering - GMRIT`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const receiptId = submission.acknowledgementNumber || submission.receiptNumber || submission.ticketNumber || `GMRIT-CSE-ACK-${submission.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      <div className="relative w-full max-w-xl my-6 bg-slate-900 rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-900 p-4 sm:p-6 text-white text-center relative border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 mx-auto mb-2 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg animate-float-soft">
            <CheckCircle2 className="w-7 h-7 text-emerald-200" />
          </div>

          <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-emerald-400/20 text-emerald-200 px-3 py-0.5 rounded-full border border-emerald-300/30 inline-block mb-1">
            OFFICIAL CONTRIBUTION RECEIPT
          </span>
          
          <h2 className="text-xl sm:text-2xl font-black font-display text-white">
            Celebration Contribution Acknowledged!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
            Thank you for being part of CSE Teachers' Day Celebration 2026
          </p>
        </div>

        {/* Printable Official Acknowledgement Body */}
        <div className="p-4 sm:p-6 space-y-5 print-acknowledgement-slip" ref={receiptRef}>
          
          {/* Official Document Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 border border-emerald-500/30 shadow-xl space-y-4">
            
            {/* Institution Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 p-0.5 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white font-display leading-tight">
                    GMR INSTITUTE OF TECHNOLOGY
                  </h3>
                  <p className="text-[11px] text-purple-300 font-semibold">
                    Department of Computer Science & Engineering
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Acknowledgement No</span>
                <span className="text-xs font-mono font-bold text-amber-400 select-all">
                  {receiptId}
                </span>
              </div>
            </div>

            {/* Student & Contribution Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Student Name</span>
                <span className="font-bold text-white text-sm truncate block mt-0.5">{submission.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">JNTU Roll Number</span>
                <span className="font-mono font-bold text-amber-300 text-sm block mt-0.5">{submission.rollNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Class & Section</span>
                <span className="font-semibold text-slate-200 block mt-0.5">{submission.year} • {submission.section}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Contribution Status</span>
                <span className="font-black text-emerald-300 text-sm block mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ₹{submission.payment?.amount || 50}.00 (PAID)
                </span>
              </div>
            </div>

            {/* Payment Verification Stamp & UTR */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payment: <strong className="text-white">Razorpay Verified Merchant UPI</strong></span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  UTR / Txn Ref: <span className="text-amber-300 font-semibold select-all">{submission.payment?.transactionId || 'Verified'}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono sm:text-right">
                {submission.createdAt ? new Date(submission.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Verified'}
              </div>
            </div>

            {/* Event & QR Verification Area */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-md shrink-0 border border-emerald-400/50">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Verification QR" className="w-24 h-24 rounded object-contain" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center text-slate-800 text-xs">Loading...</div>
                )}
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>September 5, 2026 • 09:30 AM</span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CSE Quadrangle Stage, GMRIT Campus</span>
                </div>
                {submission.interestedInSpeaking === 'Yes' && (
                  <div className="text-[11px] text-amber-300 font-semibold flex items-center justify-center sm:justify-start gap-1">
                    <Mic className="w-3 h-3" />
                    <span>Registered to speak about: {submission.speechTeacher || 'Faculty'}</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 leading-tight">
                  Present this verified digital acknowledgement slip upon arrival at the celebration venue.
                </p>
              </div>
            </div>

          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Slip</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReceipt}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Details!' : 'Copy Info'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg transition-all"
            >
              Done & Close
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};


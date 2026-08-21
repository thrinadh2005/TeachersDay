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
  Copy
} from 'lucide-react';
import { fireFestiveConfetti } from '../utils/confetti';

export const AcknowledgementModal = ({ submission, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (submission) {
      fireFestiveConfetti();
      const receiptNum = submission.acknowledgementNumber || submission.receiptNumber || submission.ticketNumber || `GMRIT-CSE-ACK-${submission.id || Date.now()}`;
      const qrData = JSON.stringify({
        ackNo: receiptNum,
        name: submission.name || `Student (${submission.rollNumber})`,
        roll: submission.rollNumber,
        dept: 'CSE',
        year: submission.year || 'CSE',
        section: submission.section || 'CSE',
        amount: submission.payment?.amount || submission.amount || 50,
        status: submission.payment?.status || submission.paymentStatus || 'verified',
        txn: submission.payment?.transactionId || submission.transactionId || 'Verified',
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
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [submission]);

  if (!submission) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptId = submission.acknowledgementNumber || submission.receiptNumber || submission.ticketNumber || `GMRIT-CSE-ACK-${submission.id || Date.now()}`;
  const amountPaid = submission.payment?.amount || submission.amount || 50;
  const transactionId = submission.payment?.transactionId || submission.transactionId || 'Verified';

  const handleCopyReceipt = () => {
    const text = `🎓 CSE Teachers' Day 2026 Contribution Acknowledgement\nReceipt No: ${receiptId}\nStudent: ${submission.name || submission.rollNumber} (${submission.rollNumber})\nAmount: ₹${amountPaid} (PAID & VERIFIED)\nDept: Computer Science & Engineering - GMRIT`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      <div className="relative w-full max-w-xl my-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden animate-scaleUp text-slate-900 dark:text-slate-100">
        
        {/* Top Header Banner (Always Dark for high contrast) */}
        <div className="bg-slate-950 p-4 sm:p-6 text-white text-center relative border-b border-emerald-500/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-colors border border-white/15 touch-press"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 mx-auto mb-2 bg-emerald-500/20 rounded-2xl flex items-center justify-center border-2 border-emerald-400 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>

          <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-emerald-400 text-slate-950 px-3 py-0.5 rounded-full shadow-sm inline-block mb-1">
            OFFICIAL CONTRIBUTION RECEIPT
          </span>
          
          <div className="text-xl sm:text-2xl font-black text-white leading-tight" style={{ color: '#ffffff' }}>
            Celebration Contribution Acknowledged!
          </div>
          <p className="text-xs sm:text-sm text-emerald-300 mt-0.5" style={{ color: '#6ee7b7' }}>
            Thank you for being part of CSE Teachers' Day Celebration 2026
          </p>
        </div>

        {/* Printable Official Acknowledgement Body */}
        <div className="p-4 sm:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 print-acknowledgement-slip" ref={receiptRef}>
          
          {/* Official Document Card */}
          <div className="relative rounded-2xl bg-white dark:bg-slate-950 p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            
            {/* Institution Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 p-0.5 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                    GMR INSTITUTE OF TECHNOLOGY
                  </h3>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">
                    Department of Computer Science & Engineering
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-bold">Acknowledgement No</span>
                <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-400 select-all">
                  {receiptId}
                </span>
              </div>
            </div>

            {/* Student & Contribution Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Student Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm truncate block mt-0.5">{submission.name || `Student (${submission.rollNumber})`}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">JNTU Roll Number</span>
                <span className="font-mono font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded text-xs inline-block mt-0.5 shadow-sm">{submission.rollNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Class & Section</span>
                <span className="font-bold text-teal-800 dark:text-teal-300 block mt-0.5">{submission.year || 'CSE'} • {submission.section || 'CSE'}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500/40">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block uppercase font-bold">Contribution Status</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm block mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ₹{amountPaid}.00 (PAID)
                </span>
              </div>
            </div>

            {/* Payment Verification Stamp & UTR */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Payment Gateway: <strong className="text-slate-900 dark:text-white">Official Razorpay Gateway</strong></span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  Payment Ref: <span className="text-amber-700 dark:text-amber-300 font-bold select-all">{transactionId}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono sm:text-right font-semibold">
                {submission.createdAt ? new Date(submission.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Verified'}
              </div>
            </div>

            {/* Event & QR Verification Area */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 bg-white rounded-xl shadow-md shrink-0 border-2 border-emerald-400">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Verification QR" className="w-24 h-24 rounded object-contain" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center text-slate-800 text-xs">Loading...</div>
                )}
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>September 5, 2026 • 09:30 AM</span>
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>CSE Seminar Hall, GMRIT Campus</span>
                </div>
                {submission.interestedInSpeaking === 'Yes' && (
                  <div className="text-[11px] text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center sm:justify-start gap-1">
                    <Mic className="w-3 h-3" />
                    <span>Registered to speak about: {submission.speechTeacher || 'Faculty'}</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
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
                className="px-4 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-600/30 hover:bg-purple-200 dark:hover:bg-purple-600/50 border border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm touch-press"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Slip</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReceipt}
                className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all touch-press"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Details!' : 'Copy Info'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg transition-all touch-press"
            >
              Done & Close
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

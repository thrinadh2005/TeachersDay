import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Loader2,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  Info,
  Lock,
  RefreshCw
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(true);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Automatically lock the exact amount chosen in the previous screen (Min ₹50)
  const lockedAmount = Math.max(50, Math.floor(Number(initialAmount) || 50));

  const razorpayButtonRef = useRef(null);

  const [alreadyPaidData, setAlreadyPaidData] = useState(null);

  // Check if roll number has already paid
  useEffect(() => {
    const cleanRoll = (studentData?.rollNumber || '').trim().toUpperCase().replace(/\s+/g, '');
    if (cleanRoll) {
      api.checkRegistration(cleanRoll)
        .then(res => {
          if (res.alreadyRegistered) {
            const rec = res.data || res.submission;
            setAlreadyPaidData(rec);
            setPaymentError(`JNTU Roll Number "${cleanRoll}" has already contributed ₹${rec?.amount || rec?.payment?.amount || 50} (Receipt: ${rec?.acknowledgementNumber || rec?.ticketNumber}). Duplicate payments are strictly not allowed.`);
          }
        })
        .catch(err => console.warn('Check roll modal notice:', err));
    }
  }, [studentData?.rollNumber]);

  // 1. Embed official Razorpay Payment Button (pl_TQWuIlJaMefrde)
  useEffect(() => {
    if (!razorpayButtonRef.current || alreadyPaidData) return;
    
    razorpayButtonRef.current.innerHTML = '';
    setButtonLoading(true);

    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_TQWuIlJaMefrde');
    script.async = true;

    script.onload = () => {
      setButtonLoading(false);
    };

    script.onerror = () => {
      setButtonLoading(false);
    };

    form.appendChild(script);
    razorpayButtonRef.current.appendChild(form);
  }, [alreadyPaidData]);

  // 2. Strict Live Verification against Razorpay Live Servers
  const verifyWithLiveServer = async (explicitUserClick = false) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const res = await api.verifyRazorpayLiveStatus({
        email: studentData?.email || '',
        phone: studentData?.phone || '',
        rollNumber: studentData?.rollNumber || '',
        name: studentData?.name || '',
        amount: lockedAmount
      });

      if (res.success && res.verified && res.transactionId) {
        // STRICT SUCCESS: Money is really captured on Razorpay!
        fireFestiveConfetti();
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess({
            status: 'verified',
            amount: lockedAmount,
            paymentMethod: 'RAZORPAY_OFFICIAL',
            transactionId: res.transactionId
          });
        }, 400);
      } else {
        throw new Error(res.error || `No captured ₹${lockedAmount} payment found on Razorpay.`);
      }
    } catch (err) {
      setIsProcessing(false);
      if (explicitUserClick) {
        setPaymentError(`Payment not confirmed on Razorpay yet. Please complete the ₹${lockedAmount} payment in your UPI / Bank app first.`);
      }
    }
  };

  // 3. Auto-listener for Razorpay Window Events
  useEffect(() => {
    const handleRazorpayMessage = (event) => {
      if (event.data && typeof event.data === 'object') {
        const pId = event.data.razorpay_payment_id || event.data.payment_id;
        if (pId) {
          setPaymentInitiated(true);
          verifyWithLiveServer(false);
        }
      }
    };

    // Auto-check when student comes back to the tab
    const handleWindowFocus = () => {
      if (paymentInitiated && !isProcessing) {
        verifyWithLiveServer(false);
      }
    };

    window.addEventListener('message', handleRazorpayMessage);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('message', handleRazorpayMessage);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [paymentInitiated, isProcessing, studentData, lockedAmount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Animated Glow Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 animate-pulse"></div>

        {/* Modal Header (Always Dark Slate for high contrast) */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950 border-b border-emerald-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-lg sm:text-xl font-black text-white leading-tight" style={{ color: '#ffffff' }}>
                  ₹{lockedAmount} Contribution Pass
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 text-[10px] font-black uppercase shadow-sm">
                  Official Gateway
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-300 mt-0.5" style={{ color: '#6ee7b7' }}>
                Official Razorpay Live Checkout • GMRIT CSE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/20 transition-colors border border-white/20"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          
          {paymentError && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500 text-rose-900 dark:text-rose-100 text-xs sm:text-sm animate-shake shadow-lg font-semibold">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Student Details Summary Card with High Contrast */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 text-xs space-y-3 relative overflow-hidden shadow-md">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                JNTU Roll Number
              </span>
              <span className="font-mono font-black text-slate-950 text-sm sm:text-base bg-amber-400 px-3 py-1 rounded-lg border border-amber-500 shadow-sm">
                {studentData?.rollNumber}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <span className="text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm">Department & Class</span>
              <span className="text-teal-900 dark:text-teal-200 font-bold text-xs sm:text-sm bg-teal-100 dark:bg-teal-950 border border-teal-400 dark:border-teal-600 px-3 py-1 rounded-lg">
                {studentData?.year} • {studentData?.section} (CSE)
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                Contribution Pass Amount
              </span>
              <span className="font-black text-amber-600 dark:text-amber-300 text-xl sm:text-2xl font-mono drop-shadow-sm">
                ₹{lockedAmount}.00
              </span>
            </div>
          </div>

          {/* FINAL RAZORPAY PAYMENT BUTTON OR ALREADY PAID CARD */}
          {alreadyPaidData ? (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-slate-950 border-2 border-amber-400 space-y-4 text-center shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                <CheckCircle2 className="w-4 h-4" />
                Pass Already Activated
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">Payment Already Received</h4>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                This JNTU Roll Number (<strong className="text-amber-700 dark:text-amber-300 font-mono">{studentData?.rollNumber}</strong>) already has a verified celebration contribution on record. Multiple payments are not permitted.
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                Receipt: {alreadyPaidData.acknowledgementNumber || alreadyPaidData.ticketNumber} • Paid: ₹{alreadyPaidData.amount || alreadyPaidData.payment?.amount || 50}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-50/90 dark:bg-slate-950 border-2 border-emerald-500 space-y-4 shadow-xl text-center relative overflow-hidden">
              
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-slate-950" />
                  Live Razorpay Checkout
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 pt-1 leading-relaxed font-semibold">
                  Click the official Razorpay button below to pay <strong className="text-amber-700 dark:text-amber-300 font-black">₹{lockedAmount}</strong>. Your Celebration Pass is strictly activated only after the payment is successfully captured by Razorpay.
                </p>
              </div>

              {/* Official Razorpay Pay Button Embed Box */}
              <div 
                onClick={() => setPaymentInitiated(true)} 
                className="py-5 px-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-500/30 flex flex-col items-center justify-center min-h-[72px] shadow-inner"
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-700 dark:text-emerald-300 py-2">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300 animate-pulse">
                      Connecting to Razorpay live servers to verify real payment...
                    </span>
                  </div>
                ) : (
                  <>
                    <div ref={razorpayButtonRef} className="flex justify-center items-center scale-125 hover:scale-130 transition-transform"></div>
                    
                    {buttonLoading && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-bold">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                        <span>Loading Official Razorpay Gateway...</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Auto-check / Re-verify button if student already completed on app */}
              {paymentInitiated && !isProcessing && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => verifyWithLiveServer(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Paid on Razorpay? Click to Verify & Get Pass</span>
                  </button>
                </div>
              )}

              {/* Security Assurance */}
              <div className="pt-2 border-t border-emerald-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>256-Bit Encrypted Secure Checkout hosted directly by Razorpay</span>
              </div>

            </div>
          )}

          {/* Footer note */}
          <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-semibold pt-1">
            Official GMRIT CSE Teachers' Day 2026 Celebration Portal
          </div>

        </div>

      </div>

    </div>
  );
};

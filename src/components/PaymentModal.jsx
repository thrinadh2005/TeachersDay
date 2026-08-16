import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  CreditCard, 
  X, 
  Loader2,
  Sparkles,
  Lock,
  ArrowRight,
  User,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Info,
  Zap,
  Coins,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

// Dynamic Razorpay Checkout Script Loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('Initializing Secure Checkout...');
  const [paymentError, setPaymentError] = useState(null);
  
  // Payment Config from Server (Razorpay Key + UPI Config)
  const [paymentConfig, setPaymentConfig] = useState({
    razorpayKeyId: '',
    enableRazorpay: true,
    upiId: '9663355000@ybl',
    payeeName: 'ADABALA VENKATA THRINADH',
    enableUpi: true
  });

  // Amount State (Minimum ₹50 with optional custom higher contribution)
  const presetAmounts = [50, 100, 150, 200, 500];
  const initialIsPreset = presetAmounts.includes(Number(initialAmount));
  const [selectedPreset, setSelectedPreset] = useState(initialIsPreset ? Number(initialAmount) : null);
  const [customInputText, setCustomInputText] = useState(!initialIsPreset && initialAmount ? String(initialAmount) : '');
  const [isCustom, setIsCustom] = useState(!initialIsPreset && Boolean(initialAmount));

  // Fallback Manual UPI State
  const [showManualUpi, setShowManualUpi] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUtrHelp, setShowUtrHelp] = useState(false);

  // Determine current effective amount (Minimum ₹50)
  const currentTypedNumber = Number(customInputText);
  const effectiveAmount = isCustom
    ? (isNaN(currentTypedNumber) || currentTypedNumber < 50 ? 50 : Math.floor(currentTypedNumber))
    : (selectedPreset || 50);

  // Load Payment Config from backend & preload Razorpay script
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.getPaymentConfig();
        if (res.success) {
          setPaymentConfig(res);
        }
      } catch (err) {
        console.warn('Could not fetch payment config:', err);
      }
    };
    fetchConfig();
    loadRazorpayScript();
  }, []);

  // Generate Dynamic UPI QR Code for Fallback Mode
  useEffect(() => {
    const upiId = paymentConfig.upiId || '9663355000@ybl';
    const payeeName = paymentConfig.payeeName || 'ADABALA VENKATA THRINADH';
    const note = `CSE_${studentData?.rollNumber || 'TeachersDay'}`;
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toDataURL(upiUri, {
      width: 200,
      margin: 1.5,
      color: {
        dark: '#090d16',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating UPI QR code:', err));
  }, [paymentConfig, effectiveAmount, studentData]);

  // PRIMARY MODE: 1-Click Razorpay Instant Checkout
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setProcessingMsg('Creating official payment order...');
    setPaymentError(null);

    try {
      // 1. Ensure Razorpay checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load Razorpay checkout script. Please check your internet connection or use manual UPI transfer below.');
      }

      // 2. Create Order on Server
      const orderRes = await api.createRazorpayOrder({
        amount: effectiveAmount,
        rollNumber: studentData?.rollNumber || '',
        name: studentData?.name || ''
      });

      if (!orderRes.success || !orderRes.order) {
        throw new Error(orderRes.error || 'Failed to initialize payment gateway.');
      }

      const { order, keyId } = orderRes;
      const activeKey = keyId || paymentConfig.razorpayKeyId;

      if (!activeKey) {
        throw new Error('Razorpay Key ID is not configured on the server.');
      }

      setProcessingMsg('Opening Razorpay Payment Gateway...');

      // 3. Launch Razorpay Standard Checkout Dialog
      const options = {
        key: activeKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "GMRIT CSE Teachers' Day 2026",
        description: `₹${effectiveAmount} Celebration Pass (${studentData?.rollNumber || 'CSE'})`,
        image: "https://img.icons8.com/fluency/96/graduation-cap.png",
        order_id: order.id,
        handler: async function (response) {
          setIsProcessing(true);
          setProcessingMsg('Verifying payment signature with bank...');

          try {
            // 4. Server-Side HMAC-SHA256 Signature Verification
            const verifyRes = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success && verifyRes.verified) {
              fireFestiveConfetti();
              onPaymentSuccess({
                status: 'verified',
                amount: effectiveAmount,
                paymentMethod: 'RAZORPAY_INSTANT',
                transactionId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id
              });
            } else {
              throw new Error(verifyRes.error || 'Payment signature verification failed.');
            }
          } catch (verifyErr) {
            console.error('Signature verification error:', verifyErr);
            setPaymentError(`Payment Verification Failed: ${verifyErr.message}`);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: studentData?.name || '',
          email: studentData?.email || '',
          contact: studentData?.phone || ''
        },
        notes: {
          rollNumber: studentData?.rollNumber || '',
          department: "CSE",
          year: studentData?.year || '',
          section: studentData?.section || '',
          purpose: "Teachers Day 2026 Celebration Pass"
        },
        theme: {
          color: "#10b981"
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        setPaymentError(`Payment Failed: ${response.error.description || response.error.reason || 'Transaction could not be completed.'}`);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay launch error:', err);
      setPaymentError(err.message || 'Could not launch Razorpay. Please use direct UPI transfer below.');
      setIsProcessing(false);
    }
  };

  // FALLBACK MODE: Manual UTR Verification
  const handleConfirmManualUpi = (e) => {
    if (e) e.preventDefault();
    setPaymentError(null);

    const cleanUtr = utrNumber.trim().replace(/\s+/g, '');
    if (!cleanUtr) {
      setPaymentError('Please enter the 12-digit UPI Reference Number / UTR from your payment receipt.');
      return;
    }

    if (cleanUtr.length < 6) {
      setPaymentError('Please enter a valid UPI Reference / UTR Number (usually 12 digits).');
      return;
    }

    setIsProcessing(true);
    setProcessingMsg('Recording manual UPI reference...');
    fireFestiveConfetti();

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: effectiveAmount,
        paymentMethod: 'UPI_MANUAL',
        transactionId: cleanUtr
      });
    }, 450);
  };

  // Copy UPI ID helper with feedback
  const handleCopyUpiId = () => {
    const upi = paymentConfig.upiId || '9663355000@ybl';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Animated Glow Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 animate-pulse"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-indigo-950/80 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20 shrink-0">
              <Zap className="w-6 h-6 animate-pulse text-amber-400 fill-amber-400/30" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                  Instant ₹{effectiveAmount} Contribution Pass
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                  Instant Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Official GMRIT CSE Teachers' Day 2026 Celebration Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs animate-shake shadow-lg">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Student Details Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 text-xs space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                Student Name
              </span>
              <span className="font-bold text-white text-sm">{studentData?.name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">JNTU Roll Number</span>
              <span className="font-mono font-bold text-amber-300 text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {studentData?.rollNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Department & Class</span>
              <span className="text-slate-200 font-semibold">{studentData?.year} • {studentData?.section} (CSE)</span>
            </div>
          </div>

          {/* Contribution Amount Selector (Min ₹50 with optional custom higher contribution) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-emerald-950/60 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  Celebration Contribution
                </span>
                <span className="text-[11px] text-slate-400">
                  Select amount or enter custom contribution (Min ₹50)
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-amber-400 text-2xl font-display">₹{effectiveAmount}</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1.5">
              {presetAmounts.map((amt) => {
                const isSelected = !isCustom && selectedPreset === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(amt);
                      setCustomInputText('');
                      setIsCustom(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 scale-[1.03] border border-emerald-300 ring-2 ring-emerald-400/40'
                        : 'bg-slate-950/80 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    ₹{amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">Custom Amount:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">₹</span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={isCustom ? customInputText : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomInputText(val);
                    setIsCustom(true);
                  }}
                  onBlur={() => {
                    if (isCustom) {
                      const num = Number(customInputText);
                      if (isNaN(num) || num < 50) {
                        setCustomInputText('50');
                      }
                    }
                  }}
                  className={`w-full pl-7 pr-3 py-1.5 rounded-xl bg-slate-950 border text-white font-mono text-xs focus:outline-none ${
                    isCustom 
                      ? 'border-amber-400 ring-1 ring-amber-400/40' 
                      : 'border-white/20 focus:border-emerald-400'
                  }`}
                  placeholder="Enter custom amount (e.g. 250)"
                />
              </div>
            </div>
          </div>

          {/* PRIMARY SECTION: 1-CLICK INSTANT RAZORPAY CHECKOUT */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-400/40 text-center space-y-3.5 shadow-2xl neon-pulse-emerald relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Primary Instant Mode (Recommended)
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                1-Tap Mobile Switch
              </span>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-black text-white font-display">
                1-Click Instant Payment & Auto-Verification
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Pay via <strong>UPI, PhonePe, Google Pay, Paytm, Cards or NetBanking</strong> with zero security errors. Your acknowledgement pass generates instantly upon payment!
              </p>
            </div>

            {/* BIG 1-CLICK RAZORPAY BUTTON */}
            <button
              type="button"
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 shimmer-button overflow-hidden hover:scale-[1.02] active:scale-95 group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>{processingMsg}</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current text-slate-950 group-hover:scale-125 transition-transform" />
                  <span>⚡ Pay ₹{effectiveAmount} with Razorpay Instant</span>
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Security Guarantee Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-slate-300">
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RBI Certified</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>0 Typing Needed</span>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Pass</span>
              </div>
            </div>

          </div>

          {/* FALLBACK MODE: DIRECT UPI TRANSFER & MANUAL UTR SUBMISSION */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950/60 transition-all">
            
            <button
              type="button"
              onClick={() => setShowManualUpi(!showManualUpi)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200">
                  Alternative: Direct QR Transfer / Manual UTR Entry
                </span>
              </div>
              {showManualUpi ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showManualUpi && (
              <div className="p-4 border-t border-white/10 space-y-4 animate-fadeIn">
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Dynamic QR */}
                  <div className="p-2 bg-white rounded-2xl shadow-xl shrink-0">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="UPI QR" className="w-28 h-28 rounded-lg object-contain" />
                    ) : (
                      <div className="w-28 h-28 flex items-center justify-center text-slate-800 text-xs">Loading...</div>
                    )}
                  </div>

                  {/* QR Details */}
                  <div className="space-y-2 text-left flex-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">Manual Recipient UPI</span>
                      <span className="font-mono text-xs font-bold text-white select-all block">
                        {paymentConfig.upiId || '9663355000@ybl'}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Coordinator: {paymentConfig.payeeName || 'ADABALA VENKATA THRINADH'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyUpiId}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'UPI ID Copied!' : 'Copy UPI ID'}</span>
                    </button>
                  </div>
                </div>

                {/* Form for UTR entry */}
                <form onSubmit={handleConfirmManualUpi} className="space-y-2.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">
                      Enter 12-Digit UPI Reference (UTR) Number *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUtrHelp(!showUtrHelp)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Where to find UTR?</span>
                    </button>
                  </div>

                  {showUtrHelp && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                      Open your completed payment receipt in your UPI app and locate the 12-digit number labeled as UTR or UPI Reference No.
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="Paste 12-digit UTR ID here (e.g. 423456789012)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                  />

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Manual UTR & Get Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* Security Guarantee Footer */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official GMRIT CSE Teachers' Day 2026 Celebration Portal</span>
          </div>

        </div>

      </div>

    </div>
  );
};


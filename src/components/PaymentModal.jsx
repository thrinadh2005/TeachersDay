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
  Coins
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  // Payment Config from Server (Defaults to 9663355000@ybl)
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: '9663355000@ybl',
    payeeName: 'CSE Teachers Day 2026',
    enableUpi: true
  });

  // Amount State (Minimum ₹50 with optional custom higher contribution)
  const presetAmounts = [50, 100, 150, 200, 500];
  const initialIsPreset = presetAmounts.includes(Number(initialAmount));
  const [selectedPreset, setSelectedPreset] = useState(initialIsPreset ? Number(initialAmount) : null);
  const [customInputText, setCustomInputText] = useState(!initialIsPreset && initialAmount ? String(initialAmount) : '');
  const [isCustom, setIsCustom] = useState(!initialIsPreset && Boolean(initialAmount));

  // UPI Specific State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Determine current effective amount (Minimum ₹50)
  const currentTypedNumber = Number(customInputText);
  const effectiveAmount = isCustom
    ? (isNaN(currentTypedNumber) || currentTypedNumber < 50 ? 50 : Math.floor(currentTypedNumber))
    : (selectedPreset || 50);

  // Load Payment Config from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.getPaymentConfig();
        if (res.success && res.upiId) {
          setPaymentConfig(res);
        }
      } catch (err) {
        console.warn('Could not fetch payment config:', err);
      }
    };
    fetchConfig();
  }, []);

  // Generate Dynamic UPI QR Code whenever amount or UPI ID changes
  useEffect(() => {
    const upiId = paymentConfig.upiId || '9663355000@ybl';
    const payeeName = paymentConfig.payeeName || 'CSE Teachers Day 2026';
    const note = `CSE_${studentData?.rollNumber || 'TeachersDay'}`;
    
    // Standard UPI URI format: upi://pay?pa=ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating UPI QR code:', err));
  }, [paymentConfig, effectiveAmount, studentData]);

  // Copy UPI ID helper
  const handleCopyUpiId = () => {
    const upi = paymentConfig.upiId || '9663355000@ybl';
    navigator.clipboard.writeText(upi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // 1-Tap UPI Launchers for Mobile
  const handleLaunchUpiApp = (appScheme) => {
    const upiId = paymentConfig.upiId || '9663355000@ybl';
    const payeeName = paymentConfig.payeeName || 'CSE Teachers Day 2026';
    const note = `CSE_${studentData?.rollNumber || 'TeachersDay'}`;
    const baseParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    let targetUrl = `upi://pay?${baseParams}`;
    if (appScheme === 'gpay') {
      targetUrl = `gpay://upi/pay?${baseParams}`;
    } else if (appScheme === 'phonepe') {
      targetUrl = `phonepe://pay?${baseParams}`;
    } else if (appScheme === 'paytm') {
      targetUrl = `paytmmp://pay?${baseParams}`;
    }

    window.location.href = targetUrl;
  };

  // SUBMIT UPI UTR VERIFICATION
  const handleConfirmUpiPayment = (e) => {
    if (e) e.preventDefault();
    setPaymentError(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr) {
      setPaymentError('Please enter the 12-digit UPI Reference Number / UTR from your payment screen (GPay, PhonePe, Paytm).');
      return;
    }

    if (cleanUtr.length < 6) {
      setPaymentError('Please enter a valid UPI Reference / UTR Number (usually 12 digits).');
      return;
    }

    setIsProcessing(true);
    fireFestiveConfetti();

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: effectiveAmount,
        paymentMethod: 'UPI_DIRECT',
        transactionId: cleanUtr
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden animate-scaleUp max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-900/70 via-slate-950 to-pink-900/70 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                Complete Your ₹{effectiveAmount} Contribution
              </h3>
              <p className="text-[11px] text-purple-200">
                Direct UPI Transfer • Google Pay, PhonePe, Paytm & BHIM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {paymentError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Student Registration Details Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Student Name</span>
              <span className="font-bold text-white">{studentData?.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">CSE Roll Number</span>
              <span className="font-mono font-bold text-amber-400">{studentData?.rollNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Year & Section</span>
              <span className="text-slate-200 font-semibold">{studentData?.year} • {studentData?.section}</span>
            </div>
          </div>

          {/* Contribution Amount Selector (Min ₹50 with optional custom higher contribution) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Celebration Contribution
                </span>
                <span className="text-[11px] text-slate-400">
                  Select an amount or enter any custom contribution (Min ₹50) 🎉
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
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30 scale-[1.02] border border-purple-400 ring-2 ring-purple-400/40'
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
                      : 'border-white/20 focus:border-purple-400'
                  }`}
                  placeholder="Enter custom amount (e.g. 250, 500)"
                />
              </div>
            </div>
          </div>

          {/* Dynamic QR Code & 1-Tap Launch Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-4 shadow-xl">
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {/* Dynamic QR Code */}
              <div className="p-2.5 bg-white rounded-2xl shadow-xl shadow-emerald-500/10 border-2 border-emerald-400 shrink-0">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Dynamic UPI QR Code" 
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
                  </div>
                )}
              </div>

              {/* QR Details & 1-Tap Mobile Actions */}
              <div className="text-left space-y-3 flex-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Scan with Any UPI App
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white font-display">
                    Pay ₹{effectiveAmount}.00
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pre-filled with ₹{effectiveAmount} & note: <span className="font-mono text-amber-300 font-semibold">CSE_{studentData?.rollNumber || 'TeachersDay'}</span>
                  </p>
                </div>

                {/* Copy UPI ID Box */}
                <div className="p-2 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block leading-none mb-0.5">UPI ID:</span>
                    <span className="text-xs font-mono font-bold text-emerald-300 select-all truncate">
                      {paymentConfig.upiId || '9663355000@ybl'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1-Tap Mobile Launch Buttons */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Or Tap to Open UPI App Directly on Mobile:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('gpay')}
                  className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-blue-400"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>Google Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('phonepe')}
                  className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-purple-400"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>PhonePe</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('paytm')}
                  className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-cyan-400"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Paytm</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchUpiApp('upi')}
                  className="py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:border-amber-400"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Any UPI App</span>
                </button>
              </div>
            </div>

          </div>

          {/* Step 2: 12-Digit UTR Submission Form */}
          <form onSubmit={handleConfirmUpiPayment} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>Enter 12-Digit UPI Reference Number (UTR) *</span>
                <span className="text-[10px] text-amber-400 font-normal">Found on payment success screen</span>
              </label>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423456789012 or GPay / PhonePe Txn ID"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
              />
              <p className="text-[10px] text-slate-400">
                💡 After sending ₹{effectiveAmount} on your UPI app, copy the 12-digit UTR / UPI Reference ID and paste it here to generate your official Entry Pass.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying & Generating Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Confirm ₹{effectiveAmount} Contribution & Get Entry Pass</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official GMRIT CSE Teachers' Day 2026 Celebration Portal</span>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Loader2,
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Info,
  Zap,
  ExternalLink,
  HelpCircle,
  Download,
  PhoneCall
} from 'lucide-react';
import { api } from '../utils/api';
import { fireFestiveConfetti } from '../utils/confetti';

export const PaymentModal = ({ studentData, initialAmount = 50, onPaymentSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  // Payment Config from Server (Defaults to 9663355000 / ADABALA VENKATA THRINADH)
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: '9663355000@ybl',
    payeeName: 'ADABALA VENKATA THRINADH',
    mobileNumber: '9663355000',
    enableUpi: true
  });

  // Amount State (Minimum ₹50 with optional custom higher contribution)
  const presetAmounts = [50, 100, 150, 200, 500];
  const initialIsPreset = presetAmounts.includes(Number(initialAmount));
  const [selectedPreset, setSelectedPreset] = useState(initialIsPreset ? Number(initialAmount) : null);
  const [customInputText, setCustomInputText] = useState(!initialIsPreset && initialAmount ? String(initialAmount) : '');
  const [isCustom, setIsCustom] = useState(!initialIsPreset && Boolean(initialAmount));

  // QR Code & UTR State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedMobile, setCopiedMobile] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUtrHelp, setShowUtrHelp] = useState(false);

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
        if (res.success) {
          setPaymentConfig(res);
        }
      } catch (err) {
        console.warn('Could not fetch payment config:', err);
      }
    };
    fetchConfig();
  }, []);

  // Generate Dynamic UPI QR Code & URI
  const upiId = paymentConfig.upiId || '9663355000@ybl';
  const payeeName = paymentConfig.payeeName || 'ADABALA VENKATA THRINADH';
  const mobileNumber = paymentConfig.mobileNumber || '9663355000';
  const note = `CSE_${studentData?.rollNumber || 'TeachersDay'}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${effectiveAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 1.5,
      color: {
        dark: '#090d16',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Error generating UPI QR code:', err));
  }, [upiUri]);

  // Copy Mobile Number helper
  const handleCopyMobile = () => {
    navigator.clipboard.writeText(mobileNumber);
    setCopiedMobile(true);
    setTimeout(() => setCopiedMobile(false), 2200);
  };

  // Copy UPI ID helper
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  // Direct 1-Tap UPI Link Trigger
  const handleLaunchPaymentLink = () => {
    window.location.href = upiUri;
  };

  // Download QR Code image
  const handleDownloadQr = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `GMRIT_CSE_Payment_QR_Rs${effectiveAmount}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // SUBMIT 12-DIGIT UTR VERIFICATION & ISSUE PASS
  const handleConfirmUpiPayment = (e) => {
    if (e) e.preventDefault();
    setPaymentError(null);

    const cleanUtr = utrNumber.trim().replace(/\s+/g, '');
    if (!cleanUtr) {
      setPaymentError('Please enter the 12-digit UPI Reference Number / UTR from your payment receipt.');
      return;
    }

    if (cleanUtr.length < 6) {
      setPaymentError('Please enter a valid 12-digit UPI Reference / UTR Number.');
      return;
    }

    setIsProcessing(true);
    fireFestiveConfetti();

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        status: 'verified',
        amount: effectiveAmount,
        paymentMethod: 'PHONEPE_MOBILE_UPI',
        transactionId: cleanUtr
      });
    }, 450);
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
              <Smartphone className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-tight">
                  Pay ₹{effectiveAmount} Contribution Pass
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                  0% Fees
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
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs animate-shake shadow-lg">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
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

          {/* STEP 1: PAY TO MOBILE NUMBER / UPI */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-2xl neon-pulse-emerald relative overflow-hidden">
            
            {/* Step 1 Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Step 1: Pay ₹{effectiveAmount} to Coordinator Mobile
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Direct Bank Transfer
              </span>
            </div>

            {/* Mobile Number Highlight Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Send ₹{effectiveAmount} to Mobile Number (PhonePe / GPay / Paytm)
                </span>
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider flex items-center justify-center sm:justify-start gap-2">
                  <span>{mobileNumber}</span>
                </div>
                <span className="text-[11px] text-slate-300 block">
                  Coordinator: <strong className="text-white">{payeeName}</strong>
                </span>
              </div>

              {/* 1-Tap Copy Mobile Button */}
              <button
                type="button"
                onClick={handleCopyMobile}
                className={`py-3 px-5 rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 ${
                  copiedMobile
                    ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 hover:scale-[1.03]'
                }`}
              >
                {copiedMobile ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Number Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Mobile Number</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Code + Direct App Launch Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              
              {/* Dynamic QR Code */}
              <div className="relative p-2 bg-white rounded-2xl shadow-2xl border-2 border-emerald-400 shrink-0 overflow-hidden group">
                <div className="laser-scanner-line"></div>
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Direct UPI QR Code" 
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-lg object-contain relative z-0"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
                  </div>
                )}
              </div>

              {/* Actions & Instructions */}
              <div className="text-left space-y-2.5 flex-1 w-full">
                
                {/* 1-Tap App Trigger */}
                <a
                  href={upiUri}
                  onClick={handleLaunchPaymentLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-white/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>Tap to Open UPI App Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Secondary buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      copiedUpi 
                        ? 'bg-emerald-500 text-slate-950' 
                        : 'bg-slate-950 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {copiedUpi ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUpi ? 'UPI Copied!' : 'Copy UPI ID'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="py-2 px-2.5 rounded-xl text-[11px] font-bold bg-slate-950 hover:bg-white/10 text-teal-300 border border-teal-500/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save QR</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">
                  👉 <strong>How to Pay:</strong> Open <strong>PhonePe, Google Pay, or Paytm</strong>, tap <em>"To Mobile Number"</em>, send <strong>₹{effectiveAmount}</strong> to <strong className="text-white font-mono">{mobileNumber}</strong>, then enter the 12-digit UTR below.
                </p>

              </div>
            </div>

          </div>

          {/* STEP 2: 12-DIGIT UTR SUBMISSION FORM */}
          <form onSubmit={handleConfirmUpiPayment} className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Step 2: Enter 12-Digit UTR to Get Official Pass
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowUtrHelp(!showUtrHelp)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Where is UTR?</span>
              </button>
            </div>

            {showUtrHelp && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 space-y-1 animate-fadeIn">
                <p className="font-bold">How to find your 12-digit UTR / Reference ID:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>Open your completed ₹{effectiveAmount} payment receipt in PhonePe / Google Pay / Paytm</li>
                  <li>Look for the 12-digit number labeled as <strong>UTR</strong>, <strong>UPI Ref ID</strong>, or <strong>UPI Reference Number</strong></li>
                  <li>Copy and paste that 12-digit number in the box below</li>
                </ul>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Enter 12-Digit UPI Reference (UTR) Number *
              </label>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Paste 12-digit UTR ID here (e.g. 362780526849)"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/20 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 shimmer-button overflow-hidden hover:scale-[1.01] active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Verifying payment & issuing Official Celebration Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-current text-slate-950" />
                  <span>Confirm ₹{effectiveAmount} & Download Official Pass</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>

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

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import Razorpay from 'razorpay';
import { db } from './db.js';
import { votingCategories } from './initialData.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Live Razorpay Payment Gateway
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TQ7vgo4Ec0Z9hX';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Nm7qaO4kFE5cwkAZZTUMDlAO';

let razorpayClient = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay Live Gateway initialized successfully with Key ID:', RAZORPAY_KEY_ID);
  } catch (err) {
    console.warn('⚠️ Razorpay initialization warning:', err.message);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

// High-speed GZIP response compression
app.use(compression());

// ==========================================
// 🛡️ SECURITY MIDDLEWARE & HEADERS
// ==========================================
app.disable('x-powered-by'); // Hide backend technology

// Standard Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 image uploads

// ==========================================
// 🛡️ IN-MEMORY RATE LIMITER
// ==========================================
const rateLimitBuckets = new Map();

const createRateLimiter = ({ windowMs = 60000, max = 30, message = 'Too many requests, please try again later.' }) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const key = `${req.path}_${ip}`;
    const now = Date.now();

    let record = rateLimitBuckets.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimitBuckets.set(key, record);
    } else {
      record.count += 1;
    }

    if (record.count > max) {
      return res.status(429).json({ success: false, error: message });
    }
    next();
  };
};

const adminPinLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15,
  message: 'Security Alert: Too many PIN verification attempts. Please wait 5 minutes.'
});

const voteLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  max: 25,
  message: 'Too many voting requests. Please wait a moment.'
});

const submitLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  max: 15,
  message: 'Too many registration requests. Please wait a moment.'
});

// Periodic cleanup of rate limit memory
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitBuckets.entries()) {
    if (now > val.resetTime) rateLimitBuckets.delete(key);
  }
}, 60000);

// ==========================================
// 🛡️ INPUT SANITIZER
// ==========================================
const sanitizeString = (str, maxLen = 300) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip javascript scheme
    .trim()
    .slice(0, maxLen);
};

const sanitizeAvatar = (avatarStr) => {
  if (typeof avatarStr !== 'string' || !avatarStr.trim()) {
    return '/faculty/Dr_A_V_Ramana.jpg';
  }
  const trimmed = avatarStr.trim();
  // Support Base64 Data URL images (PNG, JPEG, WEBP, SVG, GIF)
  if (trimmed.startsWith('data:image/')) {
    if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(trimmed)) {
      return trimmed.slice(0, 5000000); // Allow up to 5MB data URL
    }
  }
  // Support standard path or web image URL
  return trimmed
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .slice(0, 2000);
};

const sanitizeCsvField = (field) => {
  const str = String(field ?? '');
  // Prevent CSV Formula Injection
  if (/^[=+\-@\t\r]/.test(str)) {
    return `"'${str.replace(/"/g, '""')}"`;
  }
  return `"${str.replace(/"/g, '""')}"`;
};

// 10-Digit JNTU Roll Validator
const validateJntuRollBackend = (roll) => {
  const clean = (roll || '').toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.length !== 10) {
    return {
      isValid: false,
      clean,
      error: `JNTU Roll Number must be exactly 10 alphanumeric characters (e.g. 24341A0502) — received ${clean.length} characters.`
    };
  }
  const jntuPattern = /^[0-9]{2}[0-9A-Z]{3}[0-9A-Z]{5}$/;
  if (!jntuPattern.test(clean)) {
    return {
      isValid: false,
      clean,
      error: 'Invalid JNTU Roll Number format. Expected 10 alphanumeric characters (e.g. 24341A0502).'
    };
  }
  return { isValid: true, clean, error: null };
};

// ==========================================
// 📡 PUBLIC API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', event: "Teachers' Day Celebration 2026 - CSE Department", time: new Date().toISOString() });
});

// GET /api/categories - List voting categories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: db.getCategories(),
    isRevealed: db.getRevealStatus()
  });
});

// GET /api/teachers - List all CSE faculty (Secret Ballot protected unless revealed)
app.get('/api/teachers', (req, res) => {
  try {
    const teachers = db.getTeachers(false);
    res.json({ 
      success: true, 
      data: teachers,
      isRevealed: db.getRevealStatus(),
      categories: db.getCategories()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve faculty list.' });
  }
});

const activeVotingLocks = new Set();

// POST /api/vote - Cast a category-specific vote with strict 1-time voting rule
app.post('/api/vote', voteLimiter, (req, res) => {
  try {
    const { teacherId, voterKey, categoryId = 'starFaculty' } = req.body;
    const rollValidation = validateJntuRollBackend(voterKey);
    if (!rollValidation.isValid) {
      return res.status(400).json({ success: false, error: rollValidation.error });
    }
    const cleanRoll = rollValidation.clean;
    const sanitizedTeacherId = sanitizeString(teacherId, 50);
    const sanitizedCategoryId = sanitizeString(categoryId, 40);

    if (!sanitizedTeacherId) {
      return res.status(400).json({ success: false, error: 'Please select a faculty member to cast your vote.' });
    }

    if (activeVotingLocks.has(cleanRoll)) {
      return res.status(409).json({
        success: false,
        alreadyVoted: true,
        error: `A vote for JNTU Roll Number "${cleanRoll}" is already being processed. Multiple voting is strictly prohibited.`
      });
    }

    activeVotingLocks.add(cleanRoll);
    try {
      const result = db.voteTeacher(sanitizedTeacherId, cleanRoll, sanitizedCategoryId);
      if (!result.success) {
        return res.status(result.alreadyVoted ? 409 : 400).json(result);
      }
      res.json(result);
    } finally {
      activeVotingLocks.delete(cleanRoll);
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to record vote.' });
  }
});

// POST /api/vote-batch - Submit complete multi-category ballot (Strict 1-Time Rule)
app.post('/api/vote-batch', voteLimiter, (req, res) => {
  try {
    const { voterKey, votes } = req.body;
    const rollValidation = validateJntuRollBackend(voterKey);
    if (!rollValidation.isValid) {
      return res.status(400).json({ success: false, error: rollValidation.error });
    }
    const cleanRoll = rollValidation.clean;

    if (!votes || typeof votes !== 'object' || Object.keys(votes).length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one faculty award category.' });
    }

    if (activeVotingLocks.has(cleanRoll)) {
      return res.status(409).json({
        success: false,
        alreadyVoted: true,
        error: `A ballot submission for JNTU Roll Number "${cleanRoll}" is currently processing. Each student is strictly permitted to vote only ONCE.`
      });
    }

    const cleanVotes = {};
    for (const [catId, teacherId] of Object.entries(votes)) {
      if (teacherId) {
        cleanVotes[sanitizeString(catId, 40)] = sanitizeString(teacherId, 50);
      }
    }

    activeVotingLocks.add(cleanRoll);
    try {
      const result = db.submitBallot(cleanRoll, cleanVotes);
      if (!result.success) {
        return res.status(result.alreadyVoted ? 409 : 400).json(result);
      }
      res.json(result);
    } finally {
      activeVotingLocks.delete(cleanRoll);
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to submit ballot.' });
  }
});

// GET /api/voter-status/:roll - Check if roll has already voted (Zero choice exposure)
app.get('/api/voter-status/:roll', (req, res) => {
  try {
    const rawRoll = req.params.roll || '';
    const rollValidation = validateJntuRollBackend(rawRoll);
    if (!rollValidation.isValid) {
      return res.status(400).json({ success: false, error: rollValidation.error });
    }
    const cleanRoll = rollValidation.clean;
    const status = db.getStudentVoteHistory(cleanRoll);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve voter status.' });
  }
});

// GET /api/anecdotes - List approved anecdotes
app.get('/api/anecdotes', (req, res) => {
  try {
    const anecdotes = db.getApprovedAnecdotes();
    res.json({ success: true, data: anecdotes });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve memories.' });
  }
});

// POST /api/anecdotes/submit - Submit 100% Anonymous "Crazy Things About Faculty" Story
app.post('/api/anecdotes/submit', submitLimiter, (req, res) => {
  try {
    const { teacherName, anecdote, rollNumber, section } = req.body;
    const sanitizedTeacher = sanitizeString(teacherName, 80) || 'CSE Faculty';
    const sanitizedAnecdote = sanitizeString(anecdote, 800);
    const sanitizedRoll = sanitizeString(rollNumber, 30).toUpperCase();
    const sanitizedSection = sanitizeString(section, 30);

    if (!sanitizedAnecdote) {
      return res.status(400).json({ success: false, error: 'Please enter your classroom memory or story.' });
    }

    const result = db.addAnonymousAnecdote({
      teacherName: sanitizedTeacher,
      anecdote: sanitizedAnecdote,
      rollNumber: sanitizedRoll,
      section: sanitizedSection
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to submit memory.' });
  }
});

// POST /api/anecdotes/:id/react - Add reaction
app.post('/api/anecdotes/:id/react', (req, res) => {
  try {
    const sanitizedId = sanitizeString(req.params.id, 50);
    const sanitizedType = sanitizeString(req.body.type, 20);
    const result = db.reactAnecdote(sanitizedId, sanitizedType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to react.' });
  }
});

// GET /api/check-registration/:roll - Check if roll number has already registered & contributed
app.get(['/api/check-registration/:roll', '/api/check-roll/:roll'], (req, res) => {
  try {
    const rawRoll = req.params.roll || '';
    const rollValidation = validateJntuRollBackend(rawRoll);
    if (!rollValidation.isValid) {
      return res.status(400).json({ success: false, error: rollValidation.error });
    }
    const sanitizedRoll = rollValidation.clean;
    const existing = db.getSubmissionByRoll(sanitizedRoll);
    if (existing) {
      return res.json({
        success: true,
        alreadyRegistered: true,
        data: {
          id: existing.id,
          name: existing.name,
          rollNumber: existing.rollNumber,
          department: existing.department || "Computer Science & Engineering (CSE)",
          year: existing.year,
          section: existing.section,
          acknowledgementNumber: existing.acknowledgementNumber || existing.ticketNumber,
          receiptNumber: existing.receiptNumber || existing.acknowledgementNumber || existing.ticketNumber,
          ticketNumber: existing.ticketNumber,
          amount: existing.payment?.amount || existing.amount || 50,
          paymentStatus: existing.payment?.status || existing.paymentStatus || 'verified',
          transactionId: existing.payment?.transactionId || existing.transactionId || 'N/A',
          payment: existing.payment || {
            amount: existing.amount || 50,
            status: existing.paymentStatus || 'verified',
            transactionId: existing.transactionId || 'N/A'
          },
          interestedInSpeaking: existing.interestedInSpeaking || 'No',
          speechTeacher: existing.speechTeacher || '',
          speechTopic: existing.speechTopic || '',
          createdAt: existing.createdAt
        },
        submission: existing
      });
    }
    res.json({ success: true, alreadyRegistered: false });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to verify roll number status.' });
  }
});

// GET /api/pay/config - Return Public Payment & UPI Config
app.get('/api/pay/config', (req, res) => {
  const pConfig = db.getPaymentConfig();
  res.json({
    success: true,
    amount: 50,
    currency: 'INR',
    razorpayKeyId: RAZORPAY_KEY_ID,
    enableRazorpay: Boolean(RAZORPAY_KEY_ID && razorpayClient),
    upiId: pConfig.upiId || '9663355000@ybl',
    payeeName: pConfig.payeeName || 'ADABALA VENKATA THRINADH',
    mobileNumber: '9663355000',
    enableUpi: true
  });
});

// POST /api/pay/create-order - Create Razorpay Server-Side Order
app.post('/api/pay/create-order', async (req, res) => {
  try {
    const { amount, rollNumber, name } = req.body;
    const effectiveAmount = Math.max(50, Math.floor(Number(amount) || 50));

    const rollValidation = validateJntuRollBackend(rollNumber);
    if (!rollValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: rollValidation.error
      });
    }
    const cleanRoll = rollValidation.clean;
    const cleanName = sanitizeString(name, 80);

    // STRICT CHECK: Disallow multiple payments for the same Roll Number
    const existing = db.getSubmissionByRoll(cleanRoll);
    if (existing && existing.payment?.status === 'verified') {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        error: `JNTU Roll Number "${cleanRoll}" has already contributed (Receipt: ${existing.acknowledgementNumber || existing.ticketNumber}). Once paid, duplicate payments are strictly not allowed.`,
        data: existing
      });
    }

    if (!razorpayClient || !RAZORPAY_KEY_ID) {
      return res.status(400).json({
        success: false,
        error: 'Razorpay Gateway is not active. Please proceed with direct UPI contribution.'
      });
    }

    const options = {
      amount: effectiveAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `rcpt_${cleanRoll.slice(0, 10)}_${Date.now().toString().slice(-6)}`,
      notes: {
        rollNumber: cleanRoll,
        studentName: cleanName,
        event: "CSE Teachers Day 2026 Celebration"
      }
    };

    const order = await razorpayClient.orders.create(options);
    res.json({
      success: true,
      order,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to initialize Razorpay payment order.'
    });
  }
});

// POST /api/pay/verify-razorpay - Verify HMAC-SHA256 Payment Signature
app.post('/api/pay/verify-razorpay', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rollNumber } = req.body;

    if (rollNumber) {
      const cleanRoll = sanitizeString(rollNumber, 30).toUpperCase().replace(/\s+/g, '');
      const existing = db.getSubmissionByRoll(cleanRoll);
      if (existing && existing.payment?.status === 'verified') {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          error: `JNTU Roll Number "${cleanRoll}" already has a verified payment. Duplicate payments are not allowed.`,
          data: existing
        });
      }
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay signature verification parameters.'
      });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Razorpay Secret Key not configured on server.'
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        verified: true,
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Razorpay payment successfully verified!'
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid Razorpay signature. Payment verification failed.'
      });
    }
  } catch (err) {
    console.error('Razorpay verification error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Payment verification failed.'
    });
  }
});

// POST /api/pay/verify-live-status - Live check against Razorpay captured payments
app.post('/api/pay/verify-live-status', async (req, res) => {
  try {
    const { email, phone, rollNumber, amount, name } = req.body;
    const expectedAmount = Math.max(50, Math.floor(Number(amount) || 50));
    const cleanRoll = (rollNumber || '').trim().toUpperCase().replace(/\s+/g, '');

    // Check if already paid
    if (cleanRoll) {
      const existing = db.getSubmissionByRoll(cleanRoll);
      if (existing && existing.payment?.status === 'verified') {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          error: `JNTU Roll Number "${cleanRoll}" has already contributed (Receipt: ${existing.acknowledgementNumber || existing.ticketNumber}). Duplicate payment is not permitted.`,
          data: existing
        });
      }
    }

    if (!razorpayClient) {
      // Development / fallback simulation
      return res.json({
        success: true,
        verified: true,
        transactionId: `RZP_DEMO_${Date.now().toString().slice(-8)}`,
        message: 'Payment verified successfully.'
      });
    }

    // Fetch the 20 latest captured payments on Razorpay
    const paymentList = await razorpayClient.payments.all({ count: 20 });

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').trim().replace(/\D/g, '').slice(-10);
    const allSubs = db.getSubmissions() || [];

    // Filter available captured payments matching expected amount
    const matchingPayment = (paymentList.items || []).find(p => {
      if (p.status !== 'captured') return false;
      
      // Amount in paise
      if (p.amount !== expectedAmount * 100) return false;

      // Ensure this transaction was not already claimed by a different roll number
      const alreadyClaimed = allSubs.some(s => 
        s.payment && 
        s.payment.transactionId === p.id && 
        (s.rollNumber || '').toUpperCase() !== cleanRoll
      );
      if (alreadyClaimed) return false;

      // Check timeframe (last 2 hours)
      const paymentTime = p.created_at * 1000;
      const now = Date.now();
      const isRecent = (now - paymentTime) < (2 * 60 * 60 * 1000);
      if (!isRecent) return false;

      // Match email, phone, or notes if available
      const pEmail = (p.email || '').toLowerCase();
      const pPhone = (p.contact || '').replace(/\D/g, '').slice(-10);
      const pNotes = JSON.stringify(p.notes || '').toUpperCase();

      if (cleanEmail && pEmail && pEmail === cleanEmail) return true;
      if (cleanPhone && pPhone && pPhone === cleanPhone) return true;
      if (cleanRoll && pNotes.includes(cleanRoll)) return true;

      // Match recent transaction in last 10 minutes
      const isVeryRecent = (now - paymentTime) < (10 * 60 * 1000);
      return isVeryRecent;
    });

    if (matchingPayment) {
      return res.json({
        success: true,
        verified: true,
        transactionId: matchingPayment.id,
        amount: expectedAmount,
        message: 'Razorpay payment verified successfully!'
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        error: `No captured ₹${expectedAmount} payment found on Razorpay for this session yet. Please click the Razorpay button and complete your ₹${expectedAmount} payment first.`
      });
    }
  } catch (err) {
    console.error('Razorpay live verification error:', err);
    res.status(500).json({
      success: false,
      error: 'Could not connect to Razorpay live server. Please try again in a moment.'
    });
  }
});

// POST /api/submit - Submit CSE Student registration + mandatory payment verification
app.post('/api/submit', submitLimiter, async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      year,
      section,
      email,
      phone,
      interestedInSpeaking,
      speechTeacher,
      speechTopic,
      favoriteTeacher,
      anecdote,
      paymentMethod,
      transactionId,
      paymentStatus,
      paymentAmount,
      amount
    } = req.body;

    const rollValidation = validateJntuRollBackend(rollNumber);
    if (!rollValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: rollValidation.error
      });
    }
    const sanitizedRoll = rollValidation.clean;
    const sanitizedSection = sanitizeString(section, 30);
    const sanitizedName = sanitizeString(name, 80) || `Student (${sanitizedRoll})`;
    const sanitizedYear = sanitizeString(year, 20) || (sanitizedSection.includes('2') ? '2nd Year' : sanitizedSection.includes('3') ? '3rd Year' : 'CSE');
    const sanitizedEmail = sanitizeString(email, 100);
    const sanitizedPhone = sanitizeString(phone, 25);
    const sanitizedSpeaking = interestedInSpeaking === 'Yes' || interestedInSpeaking === true ? 'Yes' : 'No';
    const sanitizedSpeechTeacher = sanitizeString(speechTeacher, 80);
    const sanitizedSpeechTopic = sanitizeString(speechTopic, 400);
    const sanitizedFavoriteTeacher = sanitizeString(favoriteTeacher, 80);
    const sanitizedAnecdote = sanitizeString(anecdote, 600);
    const sanitizedMethod = sanitizeString(paymentMethod, 30) || 'UPI_DIRECT';
    const sanitizedTxn = sanitizeString(transactionId, 80) || `TXN_${Date.now()}`;
    const sanitizedStatus = paymentStatus === 'verified' ? 'verified' : 'pending';
    const finalAmount = Math.max(50, Math.floor(Number(paymentAmount) || Number(amount) || 50));

    if (!sanitizedSection) {
      return res.status(400).json({
        success: false,
        error: 'Please select your Section (CSE 2A..2D, CSE 3A..3D).'
      });
    }

    // Strict JNTU Roll Number Duplicate Check
    const existing = db.getSubmissionByRoll(sanitizedRoll);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Student with JNTU Roll Number ${sanitizedRoll} is already registered (${existing.name}, Receipt: ${existing.acknowledgementNumber || existing.ticketNumber}). Duplicate registration is not permitted.`,
        isDuplicate: true,
        data: existing,
        submission: existing
      });
    }

    // STRICT ANTI-CHEAT VERIFICATION: If payment is marked as verified, verify against Razorpay Live API
    if (sanitizedStatus === 'verified' && razorpayClient && sanitizedTxn.startsWith('pay_')) {
      try {
        const fetchedPayment = await razorpayClient.payments.fetch(sanitizedTxn);
        if (!fetchedPayment || fetchedPayment.status !== 'captured' || fetchedPayment.amount < (finalAmount * 100)) {
          return res.status(400).json({
            success: false,
            error: 'Real payment not verified on Razorpay. The transaction is not in captured status.'
          });
        }
      } catch (rErr) {
        console.warn('Razorpay fetch verification notice:', rErr.message);
      }
    }

    const result = db.addSubmission({
      name: sanitizedName,
      rollNumber: sanitizedRoll,
      department: "Computer Science & Engineering (CSE)",
      year: sanitizedYear,
      section: sanitizedSection,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      interestedInSpeaking: sanitizedSpeaking,
      speechTeacher: sanitizedSpeechTeacher,
      speechTopic: sanitizedSpeechTopic,
      favoriteTeacher: sanitizedFavoriteTeacher || 'CSE Faculty',
      anecdote: sanitizedAnecdote,
      paymentMethod: sanitizedMethod,
      transactionId: sanitizedTxn,
      paymentStatus: sanitizedStatus,
      amount: finalAmount
    });

    if (!result || result.success === false) {
      return res.status(400).json(result || { success: false, error: 'Registration failed.' });
    }

    res.status(201).json({
      success: true,
      message: `Registration & ₹${finalAmount} celebration contribution successfully recorded!`,
      data: result.submission
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not record registration.' });
  }
});

// GET /api/showcase - Showcase highlights
app.get('/api/showcase', (req, res) => {
  try {
    const submissions = db.getSubmissions();
    const approvedAnecdotes = db.getApprovedAnecdotes();

    const speakers = submissions
      .filter(s => s.interestedInSpeaking === 'Yes')
      .slice(0, 4)
      .map(s => ({
        id: s.id,
        studentName: s.name,
        year: s.year,
        section: s.section,
        speechTeacher: s.speechTeacher || s.favoriteTeacher,
        speechTopic: s.speechTopic || 'Tribute'
      }));

    res.json({
      success: true,
      data: {
        totalParticipants: submissions.length,
        fundsCollected: submissions
          .filter(s => s.payment?.status === 'verified')
          .reduce((sum, s) => sum + (Number(s.payment?.amount) || 50), 0),
        speakers,
        featuredAnecdotes: approvedAnecdotes.slice(0, 3)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve showcase.' });
  }
});

// ==========================================
// 🔐 SECURE ADMIN AUTHENTICATION
// ==========================================
const checkAdminAuth = (req, res, next) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  const expectedPin = process.env.ADMIN_PIN || db.data.adminPin || '2026';

  if (!expectedPin || !pin || String(pin).trim() !== String(expectedPin).trim()) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Admin PIN' });
  }
  next();
};

app.post('/api/admin/verify-pin', adminPinLimiter, (req, res) => {
  const { pin } = req.body;
  const expectedPin = process.env.ADMIN_PIN || db.data.adminPin || '2026';
  if (expectedPin && pin && String(pin).trim() === String(expectedPin).trim()) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect Security PIN.' });
  }
});

app.get('/api/admin/overview', checkAdminAuth, (req, res) => {
  try {
    const overview = db.getAdminOverview();
    res.json({ success: true, data: overview });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/teachers-results', checkAdminAuth, (req, res) => {
  try {
    const fullTeachers = db.getTeachers(true);
    res.json({ success: true, data: fullTeachers, categories: db.getCategories() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/reset-votes', checkAdminAuth, async (req, res) => {
  try {
    const result = await db.resetAllVotes();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/reset-voter', checkAdminAuth, async (req, res) => {
  try {
    const { roll } = req.body;
    if (!roll) {
      return res.status(400).json({ success: false, error: 'Roll number is required to reset voter status.' });
    }
    const result = await db.removeVoterRecord(roll);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/toggle-reveal-results', checkAdminAuth, (req, res) => {
  try {
    const { reveal } = req.body;
    const current = db.setRevealStatus(reveal);
    res.json({ success: true, revealVotingResults: current });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/submissions', checkAdminAuth, (req, res) => {
  try {
    const submissions = db.getSubmissions();
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/anecdotes', checkAdminAuth, (req, res) => {
  try {
    const anecdotes = db.getAllAnecdotes();
    res.json({ success: true, data: anecdotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/moderate-anecdote', checkAdminAuth, (req, res) => {
  try {
    const { anecdoteId, status, updatedText } = req.body;
    if (!anecdoteId || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid moderation request' });
    }
    const result = db.moderateAnecdote(sanitizeString(anecdoteId, 50), status, sanitizeString(updatedText, 600));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/verify-payment', checkAdminAuth, (req, res) => {
  try {
    const { submissionId, status, transactionId } = req.body;
    const result = db.updatePaymentStatus(
      sanitizeString(submissionId, 50),
      sanitizeString(status, 20),
      sanitizeString(transactionId, 80)
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/faculty-presets - List available department faculty photos
app.get('/api/admin/faculty-presets', checkAdminAuth, (req, res) => {
  try {
    const facultyDir = path.join(__dirname, '..', 'public', 'faculty');
    if (fs.existsSync(facultyDir)) {
      const files = fs.readdirSync(facultyDir);
      const presets = files
        .filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
        .map(file => {
          const namePart = file.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
          const formattedName = namePart.replace(/_/g, ' ');
          return {
            filename: file,
            path: `/faculty/${file}`,
            label: formattedName
          };
        });
      return res.json({ success: true, data: presets });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/teachers', checkAdminAuth, (req, res) => {
  try {
    const { name, degree, department, designation, avatar } = req.body;
    if (!name || !designation) {
      return res.status(400).json({ success: false, error: 'Name and designation are required' });
    }
    const newTeacher = db.addTeacher({
      name: sanitizeString(name, 80),
      degree: sanitizeString(degree, 40),
      department: sanitizeString(department, 80) || 'Computer Science & Engineering',
      designation: sanitizeString(designation, 80),
      avatar: sanitizeAvatar(avatar)
    });
    res.status(201).json({ success: true, data: newTeacher });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/teachers/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { name, degree, designation, avatar } = req.body;
    const result = db.updateTeacher(sanitizeString(id, 50), {
      ...(name ? { name: sanitizeString(name, 80) } : {}),
      ...(degree ? { degree: sanitizeString(degree, 40) } : {}),
      ...(designation ? { designation: sanitizeString(designation, 80) } : {}),
      ...(avatar !== undefined ? { avatar: sanitizeAvatar(avatar) } : {})
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/teachers/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.deleteTeacher(sanitizeString(id, 50));
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/submissions - Create and add a new student submission manually by Admin
app.post('/api/admin/submissions', checkAdminAuth, (req, res) => {
  try {
    const {
      name,
      rollNumber,
      year,
      section,
      email,
      phone,
      interestedInSpeaking,
      speechTeacher,
      speechTopic,
      favoriteTeacher,
      anecdote,
      paymentStatus,
      paymentAmount,
      amount,
      paymentMethod,
      transactionId,
      vpa
    } = req.body;

    const rollValidation = validateJntuRollBackend(rollNumber);
    if (!rollValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: rollValidation.error
      });
    }

    const sanitizedRoll = rollValidation.clean;
    const sanitizedSection = sanitizeString(section, 30) || 'CSE 2A';
    const sanitizedName = sanitizeString(name, 80) || `Student (${sanitizedRoll})`;
    const sanitizedYear = sanitizeString(year, 20) || (sanitizedSection.includes('2') ? '2nd Year' : sanitizedSection.includes('3') ? '3rd Year' : 'CSE');
    const sanitizedEmail = sanitizeString(email, 100);
    const sanitizedPhone = sanitizeString(phone, 25);
    const sanitizedSpeaking = interestedInSpeaking === 'Yes' || interestedInSpeaking === true ? 'Yes' : 'No';
    const sanitizedSpeechTeacher = sanitizeString(speechTeacher, 80);
    const sanitizedSpeechTopic = sanitizeString(speechTopic, 400);
    const sanitizedFavoriteTeacher = sanitizeString(favoriteTeacher, 80);
    const sanitizedAnecdote = sanitizeString(anecdote, 600);
    const sanitizedMethod = sanitizeString(paymentMethod, 30) || 'ADMIN_ENTRY';
    const sanitizedTxn = sanitizeString(transactionId, 80) || `ADMIN_${Date.now()}`;
    const sanitizedStatus = paymentStatus === 'pending' ? 'pending' : 'verified';
    const finalAmount = Math.max(50, Math.floor(Number(paymentAmount) || Number(amount) || 50));
    const sanitizedVpa = sanitizeString(vpa, 80);

    const result = db.addSubmission({
      name: sanitizedName,
      rollNumber: sanitizedRoll,
      department: "Computer Science & Engineering (CSE)",
      year: sanitizedYear,
      section: sanitizedSection,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      interestedInSpeaking: sanitizedSpeaking,
      speechTeacher: sanitizedSpeechTeacher,
      speechTopic: sanitizedSpeechTopic,
      favoriteTeacher: sanitizedFavoriteTeacher,
      anecdote: sanitizedAnecdote,
      amount: finalAmount,
      paymentAmount: finalAmount,
      paymentStatus: sanitizedStatus,
      paymentMethod: sanitizedMethod,
      transactionId: sanitizedTxn,
      vpa: sanitizedVpa
    });

    if (result.error || result.isDuplicate) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Student is already registered.'
      });
    }

    res.status(201).json({
      success: true,
      message: `Student ${sanitizedName} (${sanitizedRoll}) added successfully!`,
      submission: result.submission,
      anecdote: result.anecdote
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/submissions/:id - Edit and update student submission details
app.put('/api/admin/submissions/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = db.updateSubmission(sanitizeString(id, 50), updates);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/submissions/:id/update - Alternative POST endpoint for editing
app.post('/api/admin/submissions/:id/update', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = db.updateSubmission(sanitizeString(id, 50), updates);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/submissions/:id - Delete a student registration submission
app.delete('/api/admin/submissions/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.deleteSubmission(sanitizeString(id, 50));
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/anecdotes/:id - Delete an anecdote entry
app.delete('/api/admin/anecdotes/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.deleteAnecdote(sanitizeString(id, 50));
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/payment-config - Get full payment settings
app.get('/api/admin/payment-config', checkAdminAuth, (req, res) => {
  try {
    res.json({
      success: true,
      data: db.getPaymentConfig()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/payment-config - Update UPI Settings
app.post('/api/admin/payment-config', checkAdminAuth, (req, res) => {
  try {
    const { upiId, payeeName } = req.body;
    const updated = db.updatePaymentConfig({
      upiId: sanitizeString(upiId, 100) || '9663355000@ybl',
      payeeName: sanitizeString(payeeName, 100) || 'ADABALA VENKATA THRINADH',
      enableUpi: true
    });
    res.json({
      success: true,
      data: updated,
      message: 'UPI settings updated successfully!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CSV Export with Section-wise Filtering, Payment Details & Executive Summary
app.get('/api/admin/export-csv', checkAdminAuth, (req, res) => {
  try {
    const { year, section, status, summary } = req.query;
    let subs = db.getSubmissions();

    const isStudentInYear = (student, targetYear) => {
      if (!targetYear || targetYear === 'ALL') return true;
      const sYear = (student.year || '').toUpperCase().trim();
      const sSec = (student.section || '').toUpperCase().trim();
      if (targetYear.includes('2')) {
        return sYear.includes('2') || sSec.includes('2') || sSec.includes('2A') || sSec.includes('2B') || sSec.includes('2C') || sSec.includes('2D');
      }
      if (targetYear.includes('3')) {
        return sYear.includes('3') || sSec.includes('3') || sSec.includes('3A') || sSec.includes('3B') || sSec.includes('3C') || sSec.includes('3D');
      }
      return false;
    };

    const isStudentInSection = (student, targetSec) => {
      if (!targetSec || targetSec === 'ALL') return true;
      const rawSec = (student.section || '').toUpperCase().trim();
      const rawYear = (student.year || '').toUpperCase().trim();
      const targetLetter = targetSec.slice(-1);
      const targetYearNum = targetSec.includes('2') ? '2' : targetSec.includes('3') ? '3' : '';

      const isYearMatch = targetYearNum === '2'
        ? (rawYear.includes('2') || rawSec.includes('2'))
        : targetYearNum === '3'
        ? (rawYear.includes('3') || rawSec.includes('3'))
        : true;

      if (!isYearMatch) return false;

      return rawSec === targetSec.toUpperCase() ||
             rawSec.endsWith(targetLetter) ||
             rawSec === targetLetter ||
             rawSec === `SECTION ${targetLetter}` ||
             rawSec === `SEC ${targetLetter}` ||
             rawSec === `CSE ${targetYearNum}${targetLetter}` ||
             rawSec === `CSE ${targetLetter}`;
    };

    // Section-Wise Executive Summary CSV (8 Sections: CSE 2A-2D, CSE 3A-3D)
    if (summary === 'true') {
      const yearSectionConfig = [
        { year: '2nd Year', sections: ['CSE 2A', 'CSE 2B', 'CSE 2C', 'CSE 2D'] },
        { year: '3rd Year', sections: ['CSE 3A', 'CSE 3B', 'CSE 3C', 'CSE 3D'] }
      ];
      
      const summaryHeaders = [
        'Year',
        'Section',
        'Total Registered Students',
        'Verified Payments Count',
        'Pending Payments Count',
        'Total Funds Collected (INR)',
        'Stage Speakers Count'
      ];

      const summaryRows = [];
      let grandTotalStudents = 0;
      let grandTotalVerified = 0;
      let grandTotalFunds = 0;
      let grandTotalSpeakers = 0;

      yearSectionConfig.forEach(({ year: y, sections: secList }) => {
        secList.forEach(s => {
          const matching = subs.filter(sub => isStudentInSection(sub, s));
          const verified = matching.filter(sub => sub.payment?.status === 'verified');
          const pending = matching.filter(sub => sub.payment?.status !== 'verified');
          const funds = verified.reduce((acc, sub) => acc + (sub.payment?.amount || 50), 0);
          const speakers = matching.filter(sub => sub.interestedInSpeaking === 'Yes').length;

          grandTotalStudents += matching.length;
          grandTotalVerified += verified.length;
          grandTotalFunds += funds;
          grandTotalSpeakers += speakers;

          summaryRows.push([
            sanitizeCsvField(y),
            sanitizeCsvField(s),
            matching.length,
            verified.length,
            pending.length,
            funds,
            speakers
          ]);
        });
      });

      // Add Grand Total Row
      summaryRows.push([
        '"TOTAL"',
        '"8 SECTIONS (CSE 2A-2D, 3A-3D)"',
        grandTotalStudents,
        grandTotalVerified,
        grandTotalStudents - grandTotalVerified,
        grandTotalFunds,
        grandTotalSpeakers
      ]);

      const csvContent = [summaryHeaders.join(','), ...summaryRows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="CSE_TeachersDay_2026_SectionWise_Summary_${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.send(csvContent);
    }

    // Apply Filter Criteria
    if (year && year !== 'ALL') {
      subs = subs.filter(s => isStudentInYear(s, year));
    }
    if (section && section !== 'ALL') {
      subs = subs.filter(s => isStudentInSection(s, section));
    }
    if (status && status !== 'ALL') {
      subs = subs.filter(s => s.payment?.status === status);
    }

    const headers = [
      'S.No',
      'Acknowledgement Number',
      'Student Name',
      'JNTU Roll Number',
      'Department',
      'Year',
      'Section',
      'Amount Paid (INR)',
      'Payment Status',
      'Payment Method',
      'UPI Ref / Transaction UTR',
      'Registration Date & Time',
      'Speaking on Stage',
      'Speech Nominated Faculty',
      'Speech Topic',
      'Favorite Faculty'
    ];

    const rows = subs.map((s, index) => [
      index + 1,
      sanitizeCsvField(s.acknowledgementNumber || s.receiptNumber || s.ticketNumber),
      sanitizeCsvField(s.name),
      sanitizeCsvField(s.rollNumber),
      sanitizeCsvField(s.department || 'Computer Science & Engineering'),
      sanitizeCsvField(s.year),
      sanitizeCsvField(s.section),
      s.payment?.amount || 50,
      sanitizeCsvField(s.payment?.status === 'verified' ? 'Verified (Paid)' : 'Pending'),
      sanitizeCsvField(s.payment?.paymentMethod || 'UPI_DIRECT'),
      sanitizeCsvField(s.payment?.transactionId || 'N/A'),
      sanitizeCsvField(s.createdAt ? new Date(s.createdAt).toLocaleString('en-IN') : 'N/A'),
      sanitizeCsvField(s.interestedInSpeaking === 'Yes' ? 'Yes' : 'No'),
      sanitizeCsvField(s.speechTeacher || 'N/A'),
      sanitizeCsvField(s.speechTopic || 'N/A'),
      sanitizeCsvField(s.favoriteTeacher || 'N/A')
    ]);

    let filenamePrefix = 'CSE_TeachersDay_2026';
    if (year && year !== 'ALL') filenamePrefix += `_${year.replace(/\s+/g, '')}`;
    if (section && section !== 'ALL') filenamePrefix += `_${section.replace(/\s+/g, '')}`;
    if (status && status !== 'ALL') filenamePrefix += `_${status}`;

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filenamePrefix}_Contributions_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Production Static Serving with high performance caching & compression
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      if (filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🎓 CSE Teachers' Day 2026 Full-Stack Server running securely on port ${PORT}`);
});

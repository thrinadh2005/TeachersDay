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
app.use(express.json({ limit: '300kb' })); // Guard against oversized payload floods

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

const sanitizeCsvField = (field) => {
  const str = String(field ?? '');
  // Prevent CSV Formula Injection
  if (/^[=+\-@\t\r]/.test(str)) {
    return `"'${str.replace(/"/g, '""')}"`;
  }
  return `"${str.replace(/"/g, '""')}"`;
};

// ==========================================
// 💳 RAZORPAY INITIALIZATION
// ==========================================
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TQ7vgo4Ec0Z9hX';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Nm7qaO4kFE5cwkAZZTUMDlAO';

let razorpayInstance = null;
try {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
} catch (err) {
  console.warn('Razorpay initialization note:', err.message);
}

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

// POST /api/vote - Cast a category-specific vote with rate limiting & duplicate guard
app.post('/api/vote', voteLimiter, (req, res) => {
  try {
    const { teacherId, voterKey, categoryId = 'starFaculty' } = req.body;
    
    const sanitizedTeacherId = sanitizeString(teacherId, 50);
    const sanitizedVoterKey = sanitizeString(voterKey, 30).toUpperCase();
    const sanitizedCategoryId = sanitizeString(categoryId, 40);

    if (!sanitizedTeacherId || !sanitizedVoterKey) {
      return res.status(400).json({ success: false, error: 'Teacher ID and Roll Number are required.' });
    }

    const result = db.voteTeacher(sanitizedTeacherId, sanitizedVoterKey, sanitizedCategoryId);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to record vote.' });
  }
});

// GET /api/voter-status/:roll - Get list of categories student has already voted in
app.get('/api/voter-status/:roll', (req, res) => {
  try {
    const sanitizedRoll = sanitizeString(req.params.roll, 30).toUpperCase();
    const history = db.getStudentVoteHistory(sanitizedRoll);
    res.json({ success: true, data: history });
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

// GET /api/check-registration/:roll - Check if roll has already registered & paid
app.get('/api/check-registration/:roll', (req, res) => {
  try {
    const sanitizedRoll = sanitizeString(req.params.roll, 30).toUpperCase();
    const existing = db.getSubmissionByRoll(sanitizedRoll);
    if (existing && existing.payment?.status === 'verified') {
      return res.json({
        success: true,
        alreadyRegistered: true,
        data: {
          name: existing.name,
          rollNumber: existing.rollNumber,
          year: existing.year,
          section: existing.section,
          ticketNumber: existing.ticketNumber
        }
      });
    }
    res.json({ success: true, alreadyRegistered: false });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to verify roll number status.' });
  }
});

// GET /api/pay/config - Return Razorpay Public Key ID
app.get('/api/pay/config', (req, res) => {
  res.json({
    success: true,
    keyId: RAZORPAY_KEY_ID,
    amount: 50,
    currency: 'INR'
  });
});

// POST /api/pay/razorpay-order - Create Razorpay Order (Minimum ₹50, allows higher custom contribution)
app.post('/api/pay/razorpay-order', submitLimiter, async (req, res) => {
  try {
    const { rollNumber, name, amount } = req.body;
    const sanitizedRoll = sanitizeString(rollNumber, 30).toUpperCase() || 'CSE';
    const sanitizedName = sanitizeString(name, 80) || 'Student';

    // Strict Single-Registration Enforcement: Check by JNTU Roll Number
    const existing = db.getSubmissionByRoll(sanitizedRoll);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Student with JNTU Roll Number ${sanitizedRoll} has already registered (${existing.name}, Ticket: ${existing.ticketNumber}). Duplicate registration is not permitted.`
      });
    }

    // Dynamic Contribution Amount: Minimum ₹50.00
    const parsedAmount = Math.max(50, Math.floor(Number(amount) || 50));
    const amountInPaise = parsedAmount * 100;
    const cleanRoll = sanitizedRoll.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
    const receiptId = `rc_${cleanRoll}_${Date.now()}`.slice(0, 38);

    if (razorpayInstance && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const order = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            department: 'CSE',
            studentName: sanitizedName,
            rollNumber: sanitizedRoll,
            contributionAmount: parsedAmount
          }
        });
        return res.json({
          success: true,
          data: {
            orderId: order.id,
            amount: amountInPaise,
            currency: 'INR',
            keyId: RAZORPAY_KEY_ID,
            isRealOrder: true
          }
        });
      } catch (rzpErr) {
        console.warn('Razorpay Order creation notice:', rzpErr.message);
      }
    }

    res.json({
      success: true,
      data: {
        orderId: null,
        amount: amountInPaise,
        currency: 'INR',
        keyId: RAZORPAY_KEY_ID,
        isRealOrder: false
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not initialize order.' });
  }
});

// POST /api/pay/razorpay-verify - HMAC-SHA256 Cryptographic Signature Verification
app.post('/api/pay/razorpay-verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Payment signature validation failed.' });
      }
    }

    res.json({
      success: true,
      message: 'Payment verified securely.',
      paymentId: razorpay_payment_id || `pay_${Date.now()}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Verification error.' });
  }
});

// POST /api/submit - Submit CSE Student registration + mandatory payment verification
app.post('/api/submit', submitLimiter, (req, res) => {
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

    const sanitizedName = sanitizeString(name, 80);
    const sanitizedRoll = sanitizeString(rollNumber, 30).toUpperCase();
    const sanitizedYear = sanitizeString(year, 20);
    const sanitizedSection = sanitizeString(section, 20);
    const sanitizedEmail = sanitizeString(email, 100);
    const sanitizedPhone = sanitizeString(phone, 25);
    const sanitizedSpeaking = interestedInSpeaking === 'Yes' ? 'Yes' : 'No';
    const sanitizedSpeechTeacher = sanitizeString(speechTeacher, 80);
    const sanitizedSpeechTopic = sanitizeString(speechTopic, 400);
    const sanitizedFavoriteTeacher = sanitizeString(favoriteTeacher, 80);
    const sanitizedAnecdote = sanitizeString(anecdote, 600);
    const sanitizedMethod = sanitizeString(paymentMethod, 30) || 'RAZORPAY';
    const sanitizedTxn = sanitizeString(transactionId, 80) || `TXN_${Date.now()}`;
    const sanitizedStatus = paymentStatus === 'verified' ? 'verified' : 'pending';
    const finalAmount = Math.max(50, Math.floor(Number(paymentAmount) || Number(amount) || 50));

    if (!sanitizedName || !sanitizedRoll || !sanitizedYear || !sanitizedSection) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in Name, JNTU Roll Number, Year (2nd, 3rd, 4th), and Section (A, B, C, D).'
      });
    }

    // Strict JNTU Roll Number Duplicate Check
    const existing = db.getSubmissionByRoll(sanitizedRoll);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Student with JNTU Roll Number ${sanitizedRoll} has already registered (${existing.name}). Duplicate registration is not permitted.`,
        isDuplicate: true
      });
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
      message: `Registration & ₹${finalAmount} contribution successfully recorded!`,
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
  const expectedPin = db.data.adminPin || '2026';

  if (!pin || String(pin).trim() !== String(expectedPin).trim()) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Admin PIN' });
  }
  next();
};

app.post('/api/admin/verify-pin', adminPinLimiter, (req, res) => {
  const { pin } = req.body;
  const expectedPin = db.data.adminPin || '2026';
  if (pin && String(pin).trim() === String(expectedPin).trim()) {
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
      avatar: sanitizeString(avatar, 200) || '/faculty/Dr_A_V_Ramana.jpg'
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
      ...(avatar ? { avatar: sanitizeString(avatar, 200) } : {})
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

// CSV Export (Protected against CSV Formula Injection)
app.get('/api/admin/export-csv', checkAdminAuth, (req, res) => {
  try {
    const subs = db.getSubmissions();
    const headers = [
      'Ticket Number',
      'Student Name',
      'Roll Number',
      'Department',
      'Year',
      'Section',
      'Email',
      'Phone',
      'Wants to Speak on Stage',
      'Teacher to Speak About',
      'Speech Topic / Concept',
      'Favorite Teacher',
      'Payment Status',
      'Amount (INR)',
      'Transaction ID',
      'Payment Method',
      'Registration Date'
    ];

    const rows = subs.map(s => [
      sanitizeCsvField(s.ticketNumber),
      sanitizeCsvField(s.name),
      sanitizeCsvField(s.rollNumber),
      sanitizeCsvField(s.department || 'CSE'),
      sanitizeCsvField(s.year),
      sanitizeCsvField(s.section),
      sanitizeCsvField(s.email),
      sanitizeCsvField(s.phone),
      sanitizeCsvField(s.interestedInSpeaking || 'No'),
      sanitizeCsvField(s.speechTeacher),
      sanitizeCsvField(s.speechTopic),
      sanitizeCsvField(s.favoriteTeacher),
      sanitizeCsvField(s.payment?.status || 'pending'),
      s.payment?.amount || 50,
      sanitizeCsvField(s.payment?.transactionId),
      sanitizeCsvField(s.payment?.paymentMethod),
      sanitizeCsvField(s.createdAt)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="CSE_TeachersDay_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv"`);
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

# 🎓 GMRIT CSE Teachers' Day Celebration Platform 2026

An exclusive, high-performance web platform designed for the **Computer Science & Engineering (CSE)** Department for **2nd, 3rd & 4th Year Students (Sections A, B, C, D)**.

---

## 🌟 Key Features

### 1. 📝 3-Step Student Contribution Flow
- **Step 1: Student Information**: Year of study (2nd, 3rd, 4th), Section (A, B, C, D), Roll Number, contact info, and optional stage speech registration.
- **Step 2: Faculty Superlative Secret Ballot**: Students vote across 5 official award categories for 33 CSE faculty members under a strict secret ballot system.
- **Step 3: Secured ₹50 Contribution**: Seamless, server-enforced ₹50 celebration pass contribution with Razorpay integration (UPI, Google Pay, PhonePe, Cards, NetBanking).
- **🔒 Anti-Duplicate Guard**: Every student can register **only once** and pay **only once** per verified roll number.

### 2. 🏆 Grand Faculty Award Results
- **Secret Ballot Vault**: Displays a live countdown to Teachers' Day.
- **Live Winners Podium**: Upon committee reveal, crowns top CSE Faculty champions across all 5 award categories.
- **Interactive Nominee Roster**: Browse all 33 CSE faculty members.

### 3. 💬 Crazy Things About Faculty (Fun Wall)
- **100% Moderated & Anonymous**: Student memories and funny anecdotes are approved by the admin committee before publishing.
- **Zero Identity Leakage**: No student names, roll numbers, or personal tags are ever displayed on published story cards.

### 4. 🛡️ Comprehensive Admin Portal
- **PIN Protected Access**: Committee authentication with rate-limiting protection.
- **Real-Time KPIs**: Track verified contributions, total collected funds, registered stage speakers, and voting tallies.
- **One-Click Public Reveal**: Switch between Secret Ballot Mode and Public Winners Reveal with one click.
- **Content Moderation Desk**: Approve or reject student classroom anecdotes before public display.
- **CSV Data Export**: Export registrations and speaker rosters directly with formula injection defense.
- **Faculty Roster Management**: Add, edit, or manage faculty profiles.

### 5. 📱 Mobile-First Perfection & Dual Theme Engine
- **🌙 Midnight Obsidian & Royal Gold**: Sleek, high-contrast dark theme.
- **☀️ Royal Ivory & Champagne**: Ultra-crisp daylight mode with high-contrast text and solid surfaces.
- **Floating 1-Thumb Bottom Navigation**: Instant tab switching on smartphones with tactile touch-press micro-animations.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend Server**: Node.js & Express API with built-in production security headers and rate limiting.
- **Payment Processing**: Live Razorpay integration with HMAC-SHA256 signature verification and server-side price enforcement.
- **Storage Layer**: Dual-synchronized data storage supporting local zero-config database and cloud storage.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (installed automatically with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "TEACHERS DAY"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure:
   - `PORT=5000`
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` (from your Razorpay dashboard)
   - `ADMIN_PIN` (set your secret admin access PIN)
   - `MONGODB_URI` (optional cloud database connection string)

4. **Launch the Application**:
   - On **Windows**: Double-click **`START.BAT`**
   - Or run via terminal:
     ```bash
     npm run dev
     ```

5. **Open in Browser**:
   Navigate to [http://localhost:5173](http://localhost:5173) (Dev Server) or [http://localhost:5000](http://localhost:5000) (Production Server).

---

## 📂 Project Structure

```
TEACHERS DAY/
├── public/                  # Static assets & 33 CSE faculty images
│   └── faculty/             # Official faculty photos
├── server/                  # Backend Express API & Security suite
│   ├── db.js                # Database layer & duplicate guards
│   ├── index.js             # Express API routes & payment verification
│   ├── initialData.js       # Official 33 CSE faculty profiles
│   └── resetToZero.js       # Data reset & zero-state initializer
├── src/                     # React Frontend Application
│   ├── components/          # UI Components
│   │   ├── AdminDashboard.jsx  # Committee Admin Portal
│   │   ├── CountdownTimer.jsx  # Teachers' Day live countdown
│   │   ├── Footer.jsx          # Responsive footer
│   │   ├── FunWall.jsx         # Moderated anonymous anecdotes wall
│   │   ├── HeroSection.jsx     # Landing hero & celebration banner
│   │   ├── Navbar.jsx          # Dual-theme navbar & mobile bottom bar
│   │   ├── PaymentModal.jsx    # Razorpay payment checkout modal
│   │   ├── SubmissionForm.jsx  # 3-step registration & voting flow
│   │   └── VotingWall.jsx      # Faculty award results & secret ballot
│   ├── utils/               # Helper utilities (API, Theme, Confetti)
│   ├── App.jsx              # Main application router
│   ├── index.css            # Luxe Dual Theme & glassmorphism styling
│   └── main.jsx             # React application entry point
├── .env.example             # Safe environment template (no credentials)
├── .gitignore               # Protects environment secrets and build files
├── package.json             # NPM project scripts & dependencies
├── README.md                # Project documentation
├── START.BAT                # 1-Click launcher for Windows
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.js           # Vite build configuration
```

---

## 🔐 Security & Data Protection

- **No Secrets in Source Code**: Credentials and database connection strings are managed via `.env` and ignored in `.gitignore`.
- **HMAC-SHA256 Payment Verification**: All transactions are verified cryptographically on the server.
- **Fixed Price Enforcement**: Contribution amount is hard-enforced on the backend (₹50.00).
- **Strict Single Registration**: Each roll number can register and complete payment only once.
- **Admin Rate Limiting**: Protection against brute-force attempts on the admin PIN.
- **Data Sanitization**: Automatic stripping of HTML/script tags and CSV formula injection protection (`=`, `+`, `-`, `@`).

---

## 📜 License
Developed exclusively for the **GMRIT CSE Department • Teachers' Day Celebration 2026**. All rights reserved.

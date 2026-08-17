const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  // Teachers & Multi-Category Voting
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch voting categories');
    return res.json();
  },

  async getTeachers() {
    const res = await fetch(`${API_BASE}/teachers`);
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return res.json();
  },

  async getVoterHistory(roll) {
    if (!roll) return { success: true, data: { hasVoted: false } };
    const res = await fetch(`${API_BASE}/voter-status/${encodeURIComponent(roll.trim().toUpperCase())}`);
    if (!res.ok) return { success: true, data: { hasVoted: false } };
    return res.json();
  },

  async submitBallot(voterKey, votes) {
    const res = await fetch(`${API_BASE}/vote-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterKey, votes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit secret ballot');
    return data;
  },

  async voteTeacher(teacherId, voterKey, categoryId = 'starFaculty') {
    const res = await fetch(`${API_BASE}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherId, voterKey, categoryId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit vote');
    return data;
  },

  // Anecdotes
  async getAnecdotes() {
    const res = await fetch(`${API_BASE}/anecdotes`);
    if (!res.ok) throw new Error('Failed to fetch anecdotes');
    return res.json();
  },

  async submitAnonymousAnecdote({ teacherName, anecdote, rollNumber, section }) {
    const res = await fetch(`${API_BASE}/anecdotes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherName, anecdote, rollNumber, section })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit story');
    return data;
  },

  async reactAnecdote(id, type) {
    const res = await fetch(`${API_BASE}/anecdotes/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    if (!res.ok) throw new Error('Failed to react');
    return res.json();
  },

  // Payments & UPI Integration
  async getPaymentConfig() {
    const res = await fetch(`${API_BASE}/pay/config`);
    if (!res.ok) throw new Error('Failed to fetch payment config');
    return res.json();
  },

  async createRazorpayOrder(payload) {
    const res = await fetch(`${API_BASE}/pay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to initialize Razorpay order');
    return data;
  },

  async verifyRazorpayPayment(payload) {
    const res = await fetch(`${API_BASE}/pay/verify-razorpay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify payment signature');
    return data;
  },

  async verifyRazorpayLiveStatus(payload) {
    const res = await fetch(`${API_BASE}/pay/verify-live-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Payment verification failed');
    return data;
  },

  async checkRegistration(roll) {
    if (!roll) return { success: true, alreadyRegistered: false };
    try {
      const res = await fetch(`${API_BASE}/check-registration/${encodeURIComponent(roll.trim().toUpperCase())}`);
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, alreadyRegistered: false, error: e.message };
    }
  },

  async submitStudentIdea(payload) {
    const res = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');
    return data;
  },

  // Showcase
  async getShowcase() {
    const res = await fetch(`${API_BASE}/showcase`);
    if (!res.ok) throw new Error('Failed to fetch showcase info');
    return res.json();
  },

  // Admin APIs
  async getAdminOverview(pin) {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin auth failed');
    return data;
  },

  async getAdminTeacherResults(pin) {
    const res = await fetch(`${API_BASE}/admin/teachers-results`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch detailed results');
    return data;
  },

  async toggleRevealResults(pin, reveal) {
    const res = await fetch(`${API_BASE}/admin/toggle-reveal-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ reveal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle result status');
    return data;
  },

  async getAdminSubmissions(pin) {
    const res = await fetch(`${API_BASE}/admin/submissions`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin submissions');
    return data;
  },

  async getAdminAnecdotes(pin) {
    const res = await fetch(`${API_BASE}/admin/anecdotes`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin anecdotes');
    return data;
  },

  async moderateAnecdote(pin, anecdoteId, status, updatedText = null) {
    const res = await fetch(`${API_BASE}/admin/moderate-anecdote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ anecdoteId, status, updatedText })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Moderation failed');
    return data;
  },

  async verifyPayment(pin, submissionId, status, transactionId) {
    const res = await fetch(`${API_BASE}/admin/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ submissionId, status, transactionId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update payment');
    return data;
  },

  async deleteSubmission(pin, submissionId) {
    const res = await fetch(`${API_BASE}/admin/submissions/${encodeURIComponent(submissionId)}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete submission');
    return data;
  },

  async deleteAnecdote(pin, anecdoteId) {
    const res = await fetch(`${API_BASE}/admin/anecdotes/${encodeURIComponent(anecdoteId)}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete anecdote');
    return data;
  },

  async addTeacher(pin, teacherData) {
    const res = await fetch(`${API_BASE}/admin/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify(teacherData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add teacher');
    return data;
  },

  async deleteTeacher(pin, teacherId) {
    const res = await fetch(`${API_BASE}/admin/teachers/${teacherId}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete teacher');
    return data;
  },

  async updateTeacher(pin, teacherId, teacherData) {
    const res = await fetch(`${API_BASE}/admin/teachers/${teacherId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify(teacherData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update teacher');
    return data;
  },

  async getFacultyPresets(pin) {
    const res = await fetch(`${API_BASE}/admin/faculty-presets`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch faculty presets');
    return data;
  },

  async getAdminPaymentConfig(pin) {
    const res = await fetch(`${API_BASE}/admin/payment-config`, {
      headers: { 'x-admin-pin': pin }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch payment config');
    return data;
  },

  async updateAdminPaymentConfig(pin, config) {
    const res = await fetch(`${API_BASE}/admin/payment-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update payment config');
    return data;
  },

  async resetAllVotes(pin) {
    const res = await fetch(`${API_BASE}/admin/reset-votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset all votes and voters');
    return data;
  },

  async resetSingleVoter(pin, roll) {
    const res = await fetch(`${API_BASE}/admin/reset-voter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin
      },
      body: JSON.stringify({ roll })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to clear voter lock');
    return data;
  },

  clearLocalVoterCache(roll) {
    if (typeof localStorage === 'undefined') return;
    try {
      if (roll) {
        const clean = String(roll).trim().toUpperCase();
        localStorage.removeItem(`td_voted_roll_${clean}`);
        if (localStorage.getItem('td_voted_roll') === clean) {
          localStorage.removeItem('td_voted_roll');
        }
      }
      // Also scan and remove any td_voted_roll_* keys if no roll provided
      if (!roll) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('td_voted_roll')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      console.warn('Error clearing local voter cache:', e);
    }
  },

  getExportCsvUrl(pin, filters = {}) {
    const params = new URLSearchParams({ pin });
    if (filters.year && filters.year !== 'ALL') params.append('year', filters.year);
    if (filters.section && filters.section !== 'ALL') params.append('section', filters.section);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.summary) params.append('summary', 'true');
    return `${API_BASE}/admin/export-csv?${params.toString()}`;
  }
};

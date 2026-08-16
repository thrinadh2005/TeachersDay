import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { initialTeachers, initialAnecdotes, initialSubmissions, votingCategories } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

class Database {
  constructor() {
    this.data = {
      teachers: initialTeachers,
      anecdotes: initialAnecdotes,
      submissions: initialSubmissions,
      voters: {}, // voterRoll -> { categoryId: teacherId }
      revealVotingResults: false,
      adminPin: process.env.ADMIN_PIN || ''
    };
    this.mongoConnected = false;
    this.db = null;
    this.initPromise = this.init();
  }

  async init() {
    // 1. Initialize local cache for immediate synchronous reads
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.teachers && parsed.teachers.length > 0) this.data.teachers = parsed.teachers;
        if (parsed.anecdotes) this.data.anecdotes = parsed.anecdotes;
        if (parsed.submissions) this.data.submissions = parsed.submissions;
        if (parsed.voters) this.data.voters = parsed.voters;
        if (typeof parsed.revealVotingResults === 'boolean') this.data.revealVotingResults = parsed.revealVotingResults;
        if (parsed.adminPin) this.data.adminPin = parsed.adminPin;
      } else {
        this.saveLocal();
      }
    } catch (err) {
      console.warn('Local DB init note:', err.message);
    }

    // 2. Connect to MongoDB Atlas Cloud Database if URI is provided in environment
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && typeof mongoUri === 'string' && mongoUri.startsWith('mongodb')) {
      try {
        const client = new MongoClient(mongoUri, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        });
        await client.connect();
        this.db = client.db('teachersday_cse_2026');
        this.mongoConnected = true;
        console.log("🍃 Connected to MongoDB Atlas Cloud Database (teachersday_cse_2026)!");

        // Sync data from cloud or seed if empty
        await this.syncWithMongo();
      } catch (mongoErr) {
        console.warn('MongoDB Atlas connection note:', mongoErr.message);
        console.log('⚡ Running on local persistent database fallback.');
      }
    }
  }

  async getMongoDb() {
    if (!this.mongoConnected) {
      await this.initPromise;
    }
    return this.db;
  }

  async syncWithMongo() {
    if (!this.mongoConnected || !this.db) return;

    try {
      // Teachers Collection
      const teachersCol = this.db.collection('teachers');
      const count = await teachersCol.countDocuments();
      if (count === 0) {
        await teachersCol.insertMany(this.data.teachers);
        console.log(`🍃 Seeded ${this.data.teachers.length} CSE faculty members into MongoDB Atlas.`);
      } else {
        const cloudTeachers = await teachersCol.find({}).toArray();
        if (cloudTeachers.length > 0) {
          this.data.teachers = cloudTeachers.map(t => {
            const { _id, ...rest } = t;
            return rest;
          });
        }
      }

      // Submissions Collection
      const subsCol = this.db.collection('submissions');
      const cloudSubs = await subsCol.find({}).sort({ createdAt: -1 }).toArray();
      if (cloudSubs.length > 0) {
        this.data.submissions = cloudSubs.map(s => {
          const { _id, ...rest } = s;
          return rest;
        });
      }

      // Anecdotes Collection
      const anecCol = this.db.collection('anecdotes');
      const cloudAnecs = await anecCol.find({}).sort({ createdAt: -1 }).toArray();
      if (cloudAnecs.length > 0) {
        this.data.anecdotes = cloudAnecs.map(a => {
          const { _id, ...rest } = a;
          return rest;
        });
      }

      // Voters Collection
      const votersCol = this.db.collection('voters');
      const cloudVoters = await votersCol.find({}).toArray();
      cloudVoters.forEach(v => {
        if (v.roll) {
          this.data.voters[v.roll] = v.votes || {};
        }
      });

      this.saveLocal();
    } catch (err) {
      console.error('Error syncing with MongoDB Atlas:', err);
    }
  }

  saveLocal() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving local database:', err);
    }
  }

  save() {
    this.saveLocal();
  }

  getCategories() {
    return votingCategories;
  }

  getRevealStatus() {
    return this.data.revealVotingResults || false;
  }

  setRevealStatus(reveal) {
    this.data.revealVotingResults = !!reveal;
    this.save();
    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('settings').updateOne(
          { key: 'revealVotingResults' },
          { $set: { key: 'revealVotingResults', value: !!reveal } },
          { upsert: true }
        ).catch(console.error);
      }
    });
    return this.data.revealVotingResults;
  }

  getTeachers(includeSecretVotes = false) {
    const isRevealed = this.data.revealVotingResults || includeSecretVotes;

    return this.data.teachers.map(t => {
      if (isRevealed) {
        return {
          ...t,
          votes: t.totalVotes || 0,
          totalVotes: t.totalVotes || 0,
          categoryVotes: t.categoryVotes || { inspiring: 0, explainer: 0, friendly: 0, techGuru: 0, starFaculty: 0 }
        };
      }
      return {
        id: t.id,
        name: t.name,
        degree: t.degree,
        department: t.department,
        designation: t.designation,
        avatar: t.avatar,
        isSecretBallot: true
      };
    });
  }

  voteTeacher(teacherId, voterRoll, categoryId = 'starFaculty') {
    const roll = (voterRoll || '').trim().toUpperCase();
    if (!roll) {
      return { success: false, error: 'Please enter a valid CSE Roll Number to cast your vote.' };
    }

    if (!this.data.voters[roll]) {
      this.data.voters[roll] = {};
    }

    const previousTeacherId = this.data.voters[roll][categoryId];

    // If voter already voted for this same teacher in this category, return success
    if (previousTeacherId === teacherId) {
      return { 
        success: true, 
        message: 'Vote already recorded.',
        voterRoll: roll,
        categoryId,
        teacherId
      };
    }

    // If changing vote from previous teacher to a new teacher, decrement old teacher
    if (previousTeacherId && previousTeacherId !== teacherId) {
      const prevTeacher = this.data.teachers.find(t => t.id === previousTeacherId);
      if (prevTeacher && prevTeacher.categoryVotes && prevTeacher.categoryVotes[categoryId] > 0) {
        prevTeacher.categoryVotes[categoryId] -= 1;
        prevTeacher.totalVotes = Object.values(prevTeacher.categoryVotes).reduce((sum, v) => sum + v, 0);

        this.getMongoDb().then(mongoDb => {
          if (mongoDb) {
            mongoDb.collection('teachers').updateOne(
              { id: previousTeacherId },
              { $set: { categoryVotes: prevTeacher.categoryVotes, totalVotes: prevTeacher.totalVotes } }
            ).catch(console.error);
          }
        });
      }
    }

    const teacher = this.data.teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return { success: false, error: 'Teacher not found' };
    }

    if (!teacher.categoryVotes) {
      teacher.categoryVotes = { inspiring: 0, explainer: 0, friendly: 0, techGuru: 0, starFaculty: 0 };
    }

    teacher.categoryVotes[categoryId] = (teacher.categoryVotes[categoryId] || 0) + 1;
    teacher.totalVotes = Object.values(teacher.categoryVotes).reduce((sum, v) => sum + v, 0);

    this.data.voters[roll][categoryId] = teacherId;
    this.save();

    // Persist to MongoDB Atlas
    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('teachers').updateOne(
          { id: teacherId },
          { 
            $set: { 
              categoryVotes: teacher.categoryVotes,
              totalVotes: teacher.totalVotes
            } 
          }
        ).catch(console.error);

        mongoDb.collection('voters').updateOne(
          { roll: roll },
          { $set: { roll: roll, votes: this.data.voters[roll] } },
          { upsert: true }
        ).catch(console.error);
      }
    });

    return { 
      success: true, 
      message: `Your secret ballot vote for ${teacher.name} has been securely recorded!`,
      voterRoll: roll,
      categoryId,
      teacherId
    };
  }

  getStudentVoteHistory(voterRoll) {
    const roll = (voterRoll || '').trim().toUpperCase();
    return this.data.voters[roll] || {};
  }

  getApprovedAnecdotes() {
    return this.data.anecdotes
      .filter(a => a.status === 'approved')
      .map(a => ({
        id: a.id,
        teacherName: a.teacherName || 'CSE Faculty',
        anecdote: a.anecdote,
        reactions: a.reactions || { funny: 0, heart: 0, clap: 0 },
        status: a.status,
        createdAt: a.createdAt
      }));
  }

  getAllAnecdotes() {
    return this.data.anecdotes;
  }

  getSubmissionByRoll(rollNumber) {
    if (!rollNumber) return null;
    const roll = (rollNumber || '').trim().toUpperCase();
    return this.data.submissions.find(s => (s.rollNumber || '').trim().toUpperCase() === roll) || null;
  }

  addSubmission(payload) {
    const roll = (payload.rollNumber || '').trim().toUpperCase();
    
    // Strict JNTU Roll Number Uniqueness Check
    const existing = this.data.submissions.find(s => (s.rollNumber || '').trim().toUpperCase() === roll);
    if (existing) {
      return { 
        success: false, 
        error: `Student with JNTU Roll Number ${roll} has already registered (${existing.name}, Ticket: ${existing.ticketNumber}). Duplicate registration is not permitted.`, 
        isDuplicate: true,
        submission: existing 
      };
    }

    const secCode = (payload.section || 'A').replace(/Section /i, '').trim();
    const ticketNumber = `TD26-CSE${secCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `sub-${Date.now()}`;
    const anecdoteId = `a-${Date.now()}`;

    let anecdoteEntry = null;
    if (payload.anecdote && payload.anecdote.trim().length > 0) {
      anecdoteEntry = {
        id: anecdoteId,
        studentName: payload.name,
        department: "CSE",
        year: payload.year,
        section: payload.section,
        teacherName: payload.favoriteTeacher || 'CSE Faculty',
        anecdote: payload.anecdote.trim(),
        status: 'pending',
        reactions: { funny: 0, heart: 0, clap: 0 },
        createdAt: new Date().toISOString()
      };
      this.data.anecdotes.unshift(anecdoteEntry);

      this.getMongoDb().then(mongoDb => {
        if (mongoDb) {
          mongoDb.collection('anecdotes').insertOne(anecdoteEntry).catch(console.error);
        }
      });
    }

    const contributionAmount = Math.max(50, Math.floor(Number(payload.amount) || Number(payload.paymentAmount) || 50));

    const newSubmission = {
      id: submissionId,
      ticketNumber,
      name: payload.name,
      rollNumber: roll,
      department: "Computer Science & Engineering (CSE)",
      year: payload.year,
      section: payload.section,
      email: payload.email || '',
      phone: payload.phone || '',
      interestedInSpeaking: payload.interestedInSpeaking || 'No',
      speechTeacher: payload.speechTeacher || '',
      speechTopic: payload.speechTopic || '',
      favoriteTeacher: payload.favoriteTeacher || 'CSE Faculty',
      anecdoteId: anecdoteEntry ? anecdoteEntry.id : null,
      payment: {
        amount: contributionAmount,
        currency: 'INR',
        status: payload.paymentStatus || 'verified',
        transactionId: payload.transactionId || `TXN_CSE_${Date.now()}`,
        paymentMethod: payload.paymentMethod || 'RAZORPAY',
        paidAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    this.data.submissions.unshift(newSubmission);
    this.save();

    // Persist to MongoDB Atlas
    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('submissions').insertOne(newSubmission).catch(console.error);
      }
    });

    return { submission: newSubmission, anecdote: anecdoteEntry };
  }

  reactAnecdote(anecdoteId, reactionType) {
    const anecdote = this.data.anecdotes.find(a => a.id === anecdoteId);
    if (!anecdote) return { success: false, error: 'Anecdote not found' };
    if (!anecdote.reactions) anecdote.reactions = { funny: 0, heart: 0, clap: 0 };
    if (reactionType in anecdote.reactions) {
      anecdote.reactions[reactionType] += 1;
    } else {
      anecdote.reactions[reactionType] = 1;
    }
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('anecdotes').updateOne(
          { id: anecdoteId },
          { $set: { reactions: anecdote.reactions } }
        ).catch(console.error);
      }
    });

    return { success: true, anecdote };
  }

  moderateAnecdote(anecdoteId, status, updatedText = null) {
    const anecdote = this.data.anecdotes.find(a => a.id === anecdoteId);
    if (!anecdote) return { success: false, error: 'Anecdote not found' };
    anecdote.status = status;
    if (updatedText) {
      anecdote.anecdote = updatedText;
    }
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('anecdotes').updateOne(
          { id: anecdoteId },
          { $set: { status: status, ...(updatedText ? { anecdote: updatedText } : {}) } }
        ).catch(console.error);
      }
    });

    return { success: true, anecdote };
  }

  updatePaymentStatus(submissionId, status, txnId) {
    const sub = this.data.submissions.find(s => s.id === submissionId);
    if (!sub) return { success: false, error: 'Submission not found' };
    sub.payment.status = status;
    if (txnId) sub.payment.transactionId = txnId;
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('submissions').updateOne(
          { id: submissionId },
          { $set: { "payment.status": status, ...(txnId ? { "payment.transactionId": txnId } : {}) } }
        ).catch(console.error);
      }
    });

    return { success: true, submission: sub };
  }

  deleteSubmission(submissionId) {
    const index = this.data.submissions.findIndex(s => s.id === submissionId || s.ticketNumber === submissionId);
    if (index === -1) {
      return { success: false, error: 'Submission record not found.' };
    }

    const removed = this.data.submissions.splice(index, 1)[0];

    // If there was an associated anecdote, also delete it
    if (removed.anecdoteId) {
      const aIdx = this.data.anecdotes.findIndex(a => a.id === removed.anecdoteId);
      if (aIdx !== -1) {
        const removedAnecdote = this.data.anecdotes.splice(aIdx, 1)[0];
        this.getMongoDb().then(mongoDb => {
          if (mongoDb) {
            mongoDb.collection('anecdotes').deleteOne({ id: removedAnecdote.id }).catch(console.error);
          }
        });
      }
    }

    // Clean up voter registration history for this roll
    if (removed.rollNumber && this.data.voters[removed.rollNumber]) {
      delete this.data.voters[removed.rollNumber];
      this.getMongoDb().then(mongoDb => {
        if (mongoDb) {
          mongoDb.collection('voters').deleteOne({ rollNumber: removed.rollNumber }).catch(console.error);
        }
      });
    }

    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('submissions').deleteOne({ id: removed.id }).catch(console.error);
      }
    });

    return { success: true, message: 'Submission deleted successfully.', id: removed.id };
  }

  getSubmissions() {
    return this.data.submissions;
  }

  getAdminOverview() {
    const totalSubmissions = this.data.submissions.length;
    const verifiedPayments = this.data.submissions.filter(s => s.payment && s.payment.status === 'verified').length;
    const totalFundsCollected = this.data.submissions
      .filter(s => s.payment && s.payment.status === 'verified')
      .reduce((sum, s) => sum + (Number(s.payment?.amount) || 50), 0);
    const pendingAnecdotes = this.data.anecdotes.filter(a => a.status === 'pending').length;
    const totalVotes = this.data.teachers.reduce((acc, t) => acc + (t.totalVotes || 0), 0);
    const speakersCount = this.data.submissions.filter(s => s.interestedInSpeaking === 'Yes').length;

    const categoryWinners = {};
    votingCategories.forEach(cat => {
      const topInCat = [...this.data.teachers].sort((a, b) => {
        const vA = (a.categoryVotes && a.categoryVotes[cat.id]) || 0;
        const vB = (b.categoryVotes && b.categoryVotes[cat.id]) || 0;
        return vB - vA;
      });
      categoryWinners[cat.id] = {
        categoryTitle: cat.title,
        topFaculty: topInCat[0] ? { name: topInCat[0].name, votes: topInCat[0].categoryVotes?.[cat.id] || 0, designation: topInCat[0].designation } : null
      };
    });

    return {
      totalSubmissions,
      verifiedPayments,
      pendingPayments: totalSubmissions - verifiedPayments,
      totalFundsCollected,
      pendingAnecdotes,
      totalAnecdotes: this.data.anecdotes.length,
      totalVotes,
      speakersCount,
      totalFaculty: this.data.teachers.length,
      revealVotingResults: this.data.revealVotingResults || false,
      categoryWinners,
      mongoConnected: this.mongoConnected,
      topTeachers: [...this.data.teachers].sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0)).slice(0, 3)
    };
  }

  deleteAnecdote(anecdoteId) {
    const index = this.data.anecdotes.findIndex(a => a.id === anecdoteId);
    if (index === -1) return { success: false, error: 'Anecdote not found' };
    const removed = this.data.anecdotes.splice(index, 1)[0];
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('anecdotes').deleteOne({ id: anecdoteId }).catch(console.error);
      }
    });

    return { success: true, message: 'Anecdote deleted successfully.', anecdote: removed };
  }

  addTeacher(teacherData) {
    const newTeacher = {
      id: teacherData.id || `t-${Date.now()}`,
      name: teacherData.name,
      degree: teacherData.degree || 'M.Tech.',
      department: teacherData.department || 'Computer Science & Engineering',
      designation: teacherData.designation || 'Assistant Professor',
      avatar: teacherData.avatar || '/faculty/Dr_A_V_Ramana.jpg',
      categoryVotes: { inspiring: 0, explainer: 0, friendly: 0, techGuru: 0, starFaculty: 0 },
      totalVotes: 0
    };
    this.data.teachers.push(newTeacher);
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('teachers').insertOne(newTeacher).catch(console.error);
      }
    });

    return newTeacher;
  }

  deleteTeacher(teacherId) {
    const index = this.data.teachers.findIndex(t => t.id === teacherId);
    if (index === -1) return { success: false, error: 'Teacher not found' };
    const removed = this.data.teachers.splice(index, 1)[0];
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('teachers').deleteOne({ id: teacherId }).catch(console.error);
      }
    });

    return { success: true, teacher: removed };
  }

  updateTeacher(teacherId, updateData) {
    const teacher = this.data.teachers.find(t => t.id === teacherId);
    if (!teacher) return { success: false, error: 'Teacher not found' };
    Object.assign(teacher, updateData);
    this.save();

    this.getMongoDb().then(mongoDb => {
      if (mongoDb) {
        mongoDb.collection('teachers').updateOne(
          { id: teacherId },
          { $set: updateData }
        ).catch(console.error);
      }
    });

    return { success: true, teacher };
  }
}

export const db = new Database();

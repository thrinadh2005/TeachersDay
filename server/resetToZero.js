import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { initialTeachers } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data.json');

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://TeachersDay:TeachersDay@teachersday.snlrlxy.mongodb.net/teachersday_cse_2026?retryWrites=true&w=majority&appName=TeachersDay";

async function resetAllToZero() {
  console.log("=================================================");
  console.log("🧹 RESETTING ALL PLATFORM DATA TO INITIAL 0-STATE");
  console.log("=================================================");

  // 1. Prepare pristine 33 CSE Faculty members with 0 votes
  const pristineTeachers = initialTeachers.map(t => ({
    id: t.id,
    name: t.name,
    degree: t.degree || 'M.Tech.',
    department: "Computer Science & Engineering",
    designation: t.designation,
    avatar: t.avatar,
    categoryVotes: {
      inspiring: 0,
      explainer: 0,
      friendly: 0,
      techGuru: 0,
      starFaculty: 0
    },
    totalVotes: 0
  }));

  // 2. Reset Local database (server/data.json)
  const localDbData = {
    teachers: pristineTeachers,
    submissions: [],
    anecdotes: [],
    voters: {},
    revealVotingResults: false,
    adminPin: '2026'
  };

  fs.writeFileSync(dbPath, JSON.stringify(localDbData, null, 2), 'utf-8');
  console.log("✅ Local Database (`server/data.json`): 0 submissions, 0 anecdotes, 0 voters, 33 faculty with 0 votes.");

  // 3. Reset MongoDB Atlas Cloud Database
  try {
    const client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    const db = client.db("teachersday_cse_2026");

    // Clear submissions
    await db.collection('submissions').deleteMany({});
    console.log("✅ MongoDB Atlas: 'submissions' collection cleared (0 documents).");

    // Clear anecdotes
    await db.collection('anecdotes').deleteMany({});
    console.log("✅ MongoDB Atlas: 'anecdotes' collection cleared (0 documents).");

    // Clear voters
    await db.collection('voters').deleteMany({});
    console.log("✅ MongoDB Atlas: 'voters' collection cleared (0 documents).");

    // Clear settings
    await db.collection('settings').deleteMany({});
    await db.collection('settings').insertOne({ key: 'revealVotingResults', value: false });
    console.log("✅ MongoDB Atlas: 'settings' initialized (Secret ballot active).");

    // Reset teachers with 0 votes
    await db.collection('teachers').deleteMany({});
    await db.collection('teachers').insertMany(pristineTeachers);
    console.log(`✅ MongoDB Atlas: 'teachers' collection reset with all ${pristineTeachers.length} CSE Faculty members with 0 initial votes.`);

    await client.close();
    console.log("\n🎉 ALL PLATFORM DATA SUCCESSFULLY RESET TO PRISTINE 0-STATE!");
  } catch (err) {
    console.error("MongoDB Reset Error:", err.message);
  }
}

resetAllToZero();

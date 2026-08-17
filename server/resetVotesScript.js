import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

async function resetAllVotes() {
  console.log("🔄 Starting full reset of all votes and voters to ZERO...");

  // 1. Reset local data.json
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      
      // Reset voters
      data.voters = {};
      
      // Reset teachers
      if (Array.isArray(data.teachers)) {
        data.teachers = data.teachers.map(t => ({
          ...t,
          votes: 0,
          totalVotes: 0,
          categoryVotes: {
            inspiring: 0,
            explainer: 0,
            friendly: 0,
            techGuru: 0,
            starFaculty: 0
          }
        }));
      }

      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      console.log("✅ Local data.json successfully reset to ZERO votes and 0 voters.");
    } catch (err) {
      console.error("❌ Error resetting data.json:", err);
    }
  }

  // 2. Reset MongoDB Atlas if configured
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
      const db = client.db('teachersday_cse_2026');

      // Delete all voters
      const delRes = await db.collection('voters').deleteMany({});
      console.log(`✅ Cleared ${delRes.deletedCount} voter records in MongoDB Atlas.`);

      // Reset all teacher vote tallies
      const updRes = await db.collection('teachers').updateMany(
        {},
        {
          $set: {
            votes: 0,
            totalVotes: 0,
            categoryVotes: {
              inspiring: 0,
              explainer: 0,
              friendly: 0,
              techGuru: 0,
              starFaculty: 0
            }
          }
        }
      );
      console.log(`✅ Reset vote tallies for ${updRes.matchedCount} faculty members in MongoDB Atlas to ZERO.`);
      await client.close();
    } catch (mongoErr) {
      console.warn("⚠️ MongoDB Atlas reset note:", mongoErr.message);
    }
  }

  console.log("🎉 Complete vote and voter reset completed successfully!");
}

resetAllVotes();

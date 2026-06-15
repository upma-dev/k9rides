import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const run = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB cluster!");
    
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    
    for (let dbInfo of dbs.databases) {
      const dbName = dbInfo.name;
      // Connect to this specific DB
      const dbConnection = mongoose.connection.useDb(dbName);
      const collections = await dbConnection.db.listCollections().toArray();
      console.log(`Database: "${dbName}"`);
      if (collections.length === 0) {
        console.log("  No collections");
      }
      for (let col of collections) {
        const count = await dbConnection.db.collection(col.name).countDocuments();
        if (count > 0) {
          console.log(`  - ${col.name}: ${count} documents`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();

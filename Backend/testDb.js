import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'test' });
    console.log("Connected to MongoDB, DB Name: test");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in test DB:");
    for (let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();


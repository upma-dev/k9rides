import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { searchUnified } from './src/modules/food/search/services/search.service.js';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'test' });
    console.log("Connected to DB!");
    
    // Call searchUnified with query: q = 'Radison', zoneId = '6a2a5c43b1dd2eabe22c1510' (different zone)
    console.log("\n--- TEST 1: Radison with test zone (6a2a5c43b1dd2eabe22c1510) ---");
    const res1 = await searchUnified({
      q: 'Radison',
      zoneId: '6a2a5c43b1dd2eabe22c1510'
    });
    console.log("Response 1:", JSON.stringify(res1, null, 2));

    // Call searchUnified with query: q = 'Radison', zoneId = '6a2a84e413383c724393f4fc' (indore zone)
    console.log("\n--- TEST 2: Radison with Indore zone (6a2a84e413383c724393f4fc) ---");
    const res2 = await searchUnified({
      q: 'Radison',
      zoneId: '6a2a84e413383c724393f4fc'
    });
    console.log("Response 2:", JSON.stringify(res2, null, 2));

    // Call searchUnified with query: q = 'Radison', zoneId = undefined
    console.log("\n--- TEST 3: Radison with undefined zone ---");
    const res3 = await searchUnified({
      q: 'Radison',
      zoneId: undefined
    });
    console.log("Response 3:", JSON.stringify(res3, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();

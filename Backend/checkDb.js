import mongoose from 'mongoose';
import { LandingPageSetting } from './src/modules/taxi/admin/models/LandingPageSetting.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const settings = await LandingPageSetting.find({}).lean();
  console.log(JSON.stringify(settings, null, 2));
  process.exit(0);
}

check();

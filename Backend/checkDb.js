import mongoose from 'mongoose';
import { LandingPageSetting } from './src/modules/taxi/admin/models/LandingPageSetting.js';

async function check() {
  await mongoose.connect('mongodb+srv://k9bharatrides_db_user:GbrJeMWDJqoFnuWI@k9.spowyus.mongodb.net/test?appName=k9');
  const settings = await LandingPageSetting.find({}).lean();
  console.log(JSON.stringify(settings, null, 2));
  process.exit(0);
}

check();

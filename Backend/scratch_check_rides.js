import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");

    const Ride = mongoose.model('TaxiRide', new mongoose.Schema({}, { strict: false, collection: 'taxirides' }));
    const rides = await Ride.find({ status: 'completed' }).sort({ updatedAt: -1 }).limit(5).lean();

    console.log(`Found ${rides.length} completed rides:`);
    for (const r of rides) {
      console.log(`\nRide ID: ${r._id}`);
      console.log(`  fare: ${r.fare}`);
      console.log(`  baseFare: ${r.baseFare}`);
      console.log(`  waitingChargeAmount: ${r.waitingChargeAmount}`);
      console.log(`  distanceChargeAmount: ${r.distanceChargeAmount}`);
      console.log(`  timeChargeAmount: ${r.timeChargeAmount}`);
      console.log(`  liveStatus: ${r.liveStatus}`);
      console.log(`  status: ${r.status}`);
      console.log(`  pricingSnapshot: ${JSON.stringify(r.pricingSnapshot)}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();

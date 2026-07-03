import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const driverSchema = new mongoose.Schema({}, { strict: false, collection: 'taxidrivers' });
const Driver = mongoose.model('TaxiDriver', driverSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || 'K9' });
  const allDrivers = await Driver.find({}).lean();
  console.log(`Total drivers: ${allDrivers.length}`);
  
  const onlineDrivers = await Driver.find({ isOnline: true }).lean();
  console.log(`Online drivers: ${onlineDrivers.length}`);
  
  const availableDrivers = await Driver.find({ isOnline: true, isOnRide: false }).lean();
  console.log(`Available drivers (online & not on ride): ${availableDrivers.length}`);
  
  const unblockedAvailableDrivers = await Driver.find({ isOnline: true, isOnRide: false, 'wallet.isBlocked': { $ne: true } }).lean();
  console.log(`Unblocked available drivers: ${unblockedAvailableDrivers.length}`);

  if (unblockedAvailableDrivers.length > 0) {
    console.log('Sample driver vehicle details:', {
        id: unblockedAvailableDrivers[0]._id,
        vehicleTypeId: unblockedAvailableDrivers[0].vehicleTypeId,
        vehicleType: unblockedAvailableDrivers[0].vehicleType,
        location: unblockedAvailableDrivers[0].location
    });
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);

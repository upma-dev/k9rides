import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://k9bharatrides_db_user:GbrJeMWDJqoFnuWI@k9.spowyus.mongodb.net/?appName=k9').then(async () => {
    const Driver = mongoose.model('TaxiDriver', new mongoose.Schema({}, { strict: false, collection: 'taxidrivers' }));
    const Ride = mongoose.model('TaxiRide', new mongoose.Schema({}, { strict: false, collection: 'taxirides' }));
    
    console.log('Total drivers:', await Driver.countDocuments());
    const drivers = await Driver.find().sort({createdAt: -1}).limit(5).lean();
    for (const d of drivers) {
        console.log(`Driver: ${d.name} | isOnline: ${d.isOnline} | Phone: ${d.phone} | Approve: ${d.approve} | Location: ${JSON.stringify(d.location)} | ZoneId: ${d.zoneId} | VehicleType: ${d.vehicleType} | RegisterFor: ${d.registerFor} | ServiceCategories: ${JSON.stringify(d.serviceCategories)}`);
    }
    
    console.log('\nTotal rides:', await Ride.countDocuments());
    const rides = await Ride.find({ status: { $in: ['searching', 'accepted', 'ongoing'] } }).sort({createdAt: -1}).limit(3).lean();
    for (const r of rides) {
        console.log(`Ride ID: ${r._id} | Status: ${r.status} | Vehicle Type: ${r.vehicleIconType} | Pickup: ${JSON.stringify(r.pickupLocation)} | Dispatched to: ${r.dispatchedDrivers?.length} drivers | Rejected by: ${r.rejectedBy?.length} drivers | Transport: ${r.transportType} | ZoneId: ${r.zoneId}`);
    }

    process.exit(0);
});

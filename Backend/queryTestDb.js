import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'test' });
    console.log("Connected to MongoDB database 'test'!");
    
    // Query FoodRestaurant
    const FoodRestaurant = mongoose.model('FoodRestaurant', new mongoose.Schema({}, { strict: false }), 'food_restaurants');
    const restaurants = await FoodRestaurant.find({}).lean();
    console.log("\n--- RESTAURANTS ---");
    for (let r of restaurants) {
      console.log(`Name: "${r.restaurantName}"`);
      console.log(`  ID: ${r._id}`);
      console.log(`  Slug: ${r.slug}`);
      console.log(`  Status: ${r.status}`);
      console.log(`  Zone ID: ${r.zoneId}`);
      console.log(`  Cuisines: ${JSON.stringify(r.cuisines)}`);
      console.log(`  Location: ${JSON.stringify(r.location)}`);
    }
    
    // Query Zone
    const Zone = mongoose.model('Zone', new mongoose.Schema({}, { strict: false }), 'food_zones');
    const zones = await Zone.find({}).lean();
    console.log("\n--- ZONES ---");
    for (let z of zones) {
      console.log(`Name: "${z.name}"`);
      console.log(`  ID: ${z._id}`);
      console.log(`  Status: ${z.status}`);
      console.log(`  Coordinates/Boundary: ${JSON.stringify(z.boundary || z.coordinates)}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();

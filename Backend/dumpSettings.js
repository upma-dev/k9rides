import mongoose from 'mongoose';
import { FoodRestaurant } from './src/modules/food/restaurant/models/restaurant.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkDB() {
    await mongoose.connect(process.env.MONGODB_URI, {
    }).catch(err => {
        console.log("Error connecting to DB", err);
    });

    const rests = await FoodRestaurant.find({}).limit(2).lean();
    console.log("Restaurants:");
    console.log(JSON.stringify(rests, null, 2));

    process.exit(0);
}

checkDB();

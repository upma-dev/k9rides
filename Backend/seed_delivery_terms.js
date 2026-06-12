import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pageContentSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
            enum: [
                'terms', 'privacy', 'refund', 'shipping', 'cancellation', 'about', 'help_support',
                'terms_restaurant', 'privacy_restaurant', 'terms_delivery', 'privacy_delivery'
            ]
        },
        legal: { 
            title: { type: String, default: '' },
            content: { type: String, default: '' }
        },
        updatedByRole: { type: String, default: 'ADMIN' }
    },
    { collection: 'food_page_contents', timestamps: true }
);

const FoodPageContent = mongoose.model('FoodPageContent', pageContentSchema);

const deliveryTermsContent = `<h1>Zomato-style Delivery Partner Terms of Service</h1>
<p>Last updated: June 12, 2026</p>

<h3>1. Independent Contractor Status</h3>
<p>As a Delivery Partner, you operate as an independent contractor. You are free to choose when and how long you work. This agreement does not create an employment relationship.</p>

<h3>2. Vehicle and Licensing</h3>
<p>You must maintain a valid driver's license, vehicle registration, and appropriate insurance at all times. Your vehicle must be kept in safe and clean working condition.</p>

<h3>3. Order Fulfillment Standards</h3>
<p>You agree to pick up and deliver orders promptly, courteously, and safely. Food must be handled in accordance with all local health and safety regulations.</p>

<h3>4. Compensation</h3>
<p>You will earn fees based on a combination of distance traveled, time taken, and any applicable surge pricing or promotions. Payments are calculated and disbursed weekly.</p>

<h3>5. Safety and Conduct</h3>
<p>We have a zero-tolerance policy for unsafe driving, harassment, or unprofessional conduct. Violations may result in immediate deactivation of your account.</p>
`;

const deliveryPrivacyContent = `<h1>Zomato-style Delivery Partner Privacy Policy</h1>
<p>Last updated: June 12, 2026</p>

<h3>1. Information We Collect</h3>
<p>We collect your personal details (name, photo, phone number), vehicle information, driving history, background check results, and real-time GPS location data.</p>

<h3>2. Location Tracking</h3>
<p>Your real-time location is tracked while you are online and actively completing deliveries to provide accurate ETAs to customers and calculate your earnings.</p>

<h3>3. Use of Your Information</h3>
<p>Your information is used to match you with delivery requests, process payments, ensure the safety of our platform, and comply with local regulations.</p>

<h3>4. Sharing with Customers and Restaurants</h3>
<p>Customers and restaurants will see your first name, photo, and vehicle details to facilitate the pickup and drop-off process.</p>

<h3>5. Data Security and Retention</h3>
<p>We implement strict security measures to protect your personal and financial data. Information is retained as required for tax, legal, and safety compliance.</p>
`;

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await FoodPageContent.findOneAndUpdate(
            { key: 'terms_delivery' },
            {
                $set: {
                    key: 'terms_delivery',
                    legal: { title: 'Delivery Partner Terms of Service', content: deliveryTermsContent },
                    updatedByRole: 'ADMIN'
                }
            },
            { upsert: true }
        );
        console.log('Delivery Terms seeded.');

        await FoodPageContent.findOneAndUpdate(
            { key: 'privacy_delivery' },
            {
                $set: {
                    key: 'privacy_delivery',
                    legal: { title: 'Delivery Partner Privacy Policy', content: deliveryPrivacyContent },
                    updatedByRole: 'ADMIN'
                }
            },
            { upsert: true }
        );
        console.log('Delivery Privacy Policy seeded.');

        console.log('Done!');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();

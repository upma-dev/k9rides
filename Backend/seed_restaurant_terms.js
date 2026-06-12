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

const restaurantTermsContent = `<h1>Zomato-style Restaurant Terms of Service</h1>
<p>Last updated: June 12, 2026</p>

<h3>1. Partnership Agreement</h3>
<p>By registering on our platform, you agree to become a Restaurant Partner. These Terms govern your listing, order fulfillment, and relationship with our platform.</p>

<h3>2. Responsibilities of the Restaurant</h3>
<p>You agree to maintain up-to-date menus, prices, and availability. You are solely responsible for the preparation, quality, and safety of the food provided to customers.</p>

<h3>3. Commission and Payments</h3>
<p>We will deduct an agreed-upon commission fee from all completed orders. Settlement of earnings will be processed weekly directly to your registered bank account.</p>

<h3>4. Order Fulfillment</h3>
<p>You must accept and prepare orders promptly. Delays or repeated cancellations may result in penalties or suspension of your account.</p>

<h3>5. Termination</h3>
<p>Either party may terminate this agreement with a 30-day written notice. We reserve the right to immediately suspend accounts for violation of safety or hygiene standards.</p>
`;

const restaurantPrivacyContent = `<h1>Zomato-style Restaurant Privacy Policy</h1>
<p>Last updated: June 12, 2026</p>

<h3>1. Data We Collect from Partners</h3>
<p>We collect your business registration details, owner's personal information (name, contact), banking details for settlements, and tax identification numbers (e.g., FSSAI, GST).</p>

<h3>2. Use of Information</h3>
<p>Your business information will be publicly displayed on our app to users. Banking and tax details are kept strictly confidential and used only for payment processing and legal compliance.</p>

<h3>3. Customer Data</h3>
<p>You will receive limited customer data (name, order details) necessary to fulfill orders. You are strictly prohibited from using this data for direct marketing or contacting the customer outside of order fulfillment.</p>

<h3>4. Data Retention</h3>
<p>We retain your business records for as long as your account is active, and for legal and tax purposes even after account closure.</p>

<h3>5. Security Measures</h3>
<p>We utilize enterprise-grade encryption to protect your sensitive financial and operational data from unauthorized access.</p>
`;

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await FoodPageContent.findOneAndUpdate(
            { key: 'terms_restaurant' },
            {
                $set: {
                    key: 'terms_restaurant',
                    legal: { title: 'Restaurant Terms of Service', content: restaurantTermsContent },
                    updatedByRole: 'ADMIN'
                }
            },
            { upsert: true }
        );
        console.log('Restaurant Terms seeded.');

        await FoodPageContent.findOneAndUpdate(
            { key: 'privacy_restaurant' },
            {
                $set: {
                    key: 'privacy_restaurant',
                    legal: { title: 'Restaurant Privacy Policy', content: restaurantPrivacyContent },
                    updatedByRole: 'ADMIN'
                }
            },
            { upsert: true }
        );
        console.log('Restaurant Privacy Policy seeded.');

        console.log('Done!');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();

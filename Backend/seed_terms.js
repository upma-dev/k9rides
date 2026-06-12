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

const termsContent = `<h1>Zomato-style Terms of Service</h1>
<p>Last updated: June 12, 2026</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing or using our platform, you agree to be bound by these Terms. We reserve the right to modify these Terms at any time.</p>

<h3>2. Platform Services</h3>
<p>Our platform connects users with independent restaurants and delivery partners. We do not prepare food or provide delivery services directly.</p>

<h3>3. User Accounts</h3>
<p>You must provide accurate information when registering an account. You are responsible for all activities that occur under your account.</p>

<h3>4. Orders and Payments</h3>
<p>All food orders are subject to availability. Prices may vary from dine-in prices. Payments are processed securely via our payment partners.</p>

<h3>5. Cancellations and Refunds</h3>
<p>Please refer to our Refund Policy. Generally, orders cannot be cancelled once accepted by the restaurant.</p>

<h3>6. Liability</h3>
<p>We are not liable for the quality of food provided by restaurants or the conduct of independent delivery partners.</p>
`;

const privacyContent = `<h1>Zomato-style Privacy Policy</h1>
<p>Last updated: June 12, 2026</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly, such as your name, phone number, email address, delivery addresses, and payment information. We also collect location data to facilitate deliveries.</p>

<h3>2. How We Use Your Information</h3>
<p>We use your information to provide our services, process orders, communicate with you, and personalize your experience on our platform.</p>

<h3>3. Sharing Your Information</h3>
<p>We share your order details and delivery address with restaurants and delivery partners to fulfill your orders. We do not sell your personal data to third parties.</p>

<h3>4. Data Security</h3>
<p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>

<h3>5. Your Choices</h3>
<p>You can manage your communication preferences and update your personal information through your account settings.</p>
`;

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await FoodPageContent.findOneAndUpdate(
            { key: 'terms' },
            {
                $set: {
                    key: 'terms',
                    legal: { title: 'Terms of Service', content: termsContent },
                    updatedByRole: 'ADMIN'
                }
            },
            { upsert: true }
        );
        console.log('Terms of Service seeded.');

        await FoodPageContent.findOneAndUpdate(
            { key: 'privacy' },
            {
                $set: {
                    key: 'privacy',
                    legal: { title: 'Privacy Policy', content: privacyContent },
                    updatedByRole: 'ADMIN'
                }
            },
            { upsert: true }
        );
        console.log('Privacy Policy seeded.');

        console.log('Done!');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();

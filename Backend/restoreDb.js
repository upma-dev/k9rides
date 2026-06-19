import mongoose from 'mongoose';
import { LandingPageSetting } from './src/modules/taxi/admin/models/LandingPageSetting.js';
import dotenv from 'dotenv';
dotenv.config();

async function restore() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const existing = await LandingPageSetting.findOne({ scope: 'default' });
  if (existing) {
    const aboutUsContent = existing.pages?.about_us;
    
    // Delete the corrupted one
    await LandingPageSetting.deleteOne({ scope: 'default' });
    
    // Recreate with defaults
    const newSettings = new LandingPageSetting({
      scope: 'default',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      logo_url: '',
      hero_title: 'All-in-One Platform for Rides, Food & Logistics',
      hero_description: 'K9 Rides is the multi-service super-app designed for modern cities. Easily book a taxi, order from your favorite local restaurants, ship parcels, arrange airport transfers, rent vehicles, and coordinate complex supply chains.',
      hero_image_url: '',
      why_us_image_url: '',
      social_links: {
          facebook: 'https://facebook.com/k9rides',
          twitter: 'https://twitter.com/k9rides',
          instagram: 'https://instagram.com/k9rides',
          linkedin: 'https://linkedin.com/company/k9rides',
          youtube: 'https://youtube.com/k9rides'
      },
      contact_email: 'k9bharatrides@gmail.com',
      contact_phone: '+91 7358789910',
      contact_address: 'K9 Village, Siliguri, West Bengal, India',
      contact_location: { lat: 26.7271, lng: 88.3953 },
      play_store_url: '/login/services',
      app_store_url: '/login/services',
      faqs: [
          {
              question: 'What is K9 Rides?',
              answer: 'K9 Rides is a unified multi-service super-app offering on-demand taxi bookings, local food ordering, courier deliveries, rentals, and airport transfers.',
              order: 0
          },
          {
              question: 'How do I book a ride?',
              answer: 'Simply log in with your phone number, select your pickup and drop locations, choose a vehicle class, and confirm your booking. A driver will be assigned immediately.',
              order: 1
          },
          {
              question: 'What payment methods are supported?',
              answer: 'We support digital payments via UPI, Credit/Debit Cards, Net Banking, and Mobile Wallets, as well as Cash on delivery/ride.',
              order: 2
          },
          {
              question: 'How are surge prices calculated?',
              answer: 'Surge pricing is dynamically applied during peak demand hours, bad weather, or heavy traffic, to balance driver supply with passenger demand.',
              order: 3
          }
      ],
      pages: {
          about_us: aboutUsContent || '<h1>About K9 Rides</h1><p>K9 Rides is a leading technology platform dedicated to providing safe, reliable, and affordable mobility solutions for everyone. Our mission is to transform urban transportation and logistics by connecting people with professional drivers and efficient services.</p>',
          careers: '<h1>Careers at K9 Rides</h1><p>Join our team and help shape the future of mobility.</p>',
          newsroom: '<h1>Newsroom</h1><p>Stay updated with the latest news and announcements from K9 Rides.</p>',
          terms_conditions: '<h1>Terms of Service</h1><p>By using K9 Rides app or website, you agree to these Terms of Service. K9 Rides acts as a technology platform connecting users with third-party service providers. You must provide accurate details and use the platform lawfully.</p>',
          privacy_policy: '<h1>Privacy Policy</h1><p>We value your privacy. K9 Rides collects your personal information (name, contact, location) solely to match and execute rides, deliveries, and orders. We do not sell your personal data to advertisers.</p>',
          refund_policy: '<h1>Refund Policy</h1><p>Refunds are processed for verified overcharges or cancelled bookings prior to partner dispatch. UPI and wallet refunds settle within 1 to 3 days, and bank cards settle in 5 to 10 days.</p>',
          cancellation_policy: '<h1>Cancellation Policy</h1><p>Users may cancel bookings free of charge before a driver accepts. Nominal cancellation charges apply once a driver is assigned or dispatch preparation has already started.</p>'
      }
    });
    await newSettings.save();
    console.log("Restored settings successfully while keeping custom About Us content.");
  } else {
    console.log("No existing settings found.");
  }
  process.exit(0);
}

restore();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://Eqosy:Eqosy%40123@eqosycluster.gcdsjg0.mongodb.net/eqosydb?retryWrites=true&w=majority';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const adminCollection = mongoose.connection.collection('food_admins');
    const existingAdmin = await adminCollection.findOne({ email: 'admin@eqosy.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists! (Email: admin@eqosy.com)');
      // Re-hash and force update password
      const newHash = await bcrypt.hash('admin123', 10);
      await adminCollection.updateOne(
        { email: 'admin@eqosy.com' }, 
        { $set: { password: newHash } }
      );
      console.log('Updated existing admin password to: admin123');
    } else {
      const hash = await bcrypt.hash('admin123', 10);
      await adminCollection.insertOne({
        email: 'admin@eqosy.com',
        password: hash,
        name: 'Super Admin',
        phone: '9999999999',
        profileImage: '',
        fcmTokens: [],
        fcmTokenMobile: [],
        role: 'ADMIN',
        isActive: true,
        servicesAccess: ['food', 'quickCommerce', 'taxi'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Successfully created a new admin account!');
      console.log('Email: admin@eqosy.com | Password: admin123');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();


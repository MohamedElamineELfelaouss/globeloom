const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/globeloom');
    console.log('Connected to MongoDB');

    // Check if test user exists
    const existingUser = await User.findOne({ email: 'test@test.com' });
    
    if (existingUser) {
      console.log('Test user already exists with email: test@test.com');
    } else {
      // Create test user
      const testUser = new User({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully!');
      console.log('Email: test@test.com');
      console.log('Password: password123');
    }

    // Check total users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestUser();

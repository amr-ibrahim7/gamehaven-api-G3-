require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('User already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user'
    });

    await user.save();
    console.log('Test user created');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedUser();

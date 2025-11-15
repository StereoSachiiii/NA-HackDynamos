import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { MONGO_URI } from '../config/constants.js';

const makeAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: 'chin1234@example.com' });
    
    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log('✓ User updated to admin successfully!');
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();


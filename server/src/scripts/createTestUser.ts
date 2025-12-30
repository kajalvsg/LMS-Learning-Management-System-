import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import connectMongoDB from '../config/mongodb';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Default test users
    const testUsers = [
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student' as const,
      },
      {
        name: 'Test Instructor',
        email: 'instructor@test.com',
        password: 'password123',
        role: 'instructor' as const,
      },
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin' as const,
      },
    ];

    console.log('\n🔧 Creating test users...\n');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Test User Credentials:\n');
    console.log('Student:');
    console.log('  Email: student@test.com');
    console.log('  Password: password123\n');
    console.log('Instructor:');
    console.log('  Email: instructor@test.com');
    console.log('  Password: password123\n');
    console.log('Admin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: password123\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createTestUser();


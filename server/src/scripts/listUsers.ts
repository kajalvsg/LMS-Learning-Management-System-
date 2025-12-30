import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectMongoDB from '../config/mongodb';

dotenv.config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Find all users (excluding password)
    const users = await User.find({}).select('-password');

    if (users.length === 0) {
      console.log('\n❌ No users found in the database.');
      console.log('\n📝 To create a user, you can:');
      console.log('   1. Register through the frontend at http://localhost:3000/register');
      console.log('   2. Use the createTestUser.ts script');
      console.log('   3. Use the API: POST http://localhost:5000/api/auth/register\n');
    } else {
      console.log('\n✅ Found', users.length, 'user(s) in the database:\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('| Email'.padEnd(40) + '| Name'.padEnd(25) + '| Role'.padEnd(15) + '|');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      users.forEach((user) => {
        console.log(
          '| ' + user.email.padEnd(38) + 
          '| ' + user.name.padEnd(23) + 
          '| ' + user.role.padEnd(13) + '|'
        );
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  Note: Passwords are not shown for security reasons.');
      console.log('   If you forgot your password, you can register a new account with a different email.');
      console.log('   Or reset the password by updating the user in the database.\n');
    }

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listUsers();


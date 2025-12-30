# Login Credentials Guide

## Problem: Login Failed

If you're getting a "login failed" error, it's likely because:

1. **No users exist in the database yet** - You need to register first
2. **Wrong password** - The password you're using doesn't match what's stored
3. **Email doesn't exist** - The email you're using hasn't been registered

## Solution 1: Check Existing Users

To see what users are currently in your database, run:

```bash
cd server
npm run list-users
```

This will show you all registered users (without passwords for security).

## Solution 2: Create Test Users

If you want to quickly create test users for testing, run:

```bash
cd server
npm run create-test-users
```

This will create three test users:

### Test Credentials:

**Student Account:**
- Email: `student@test.com`
- Password: `password123`

**Instructor Account:**
- Email: `instructor@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `password123`

## Solution 3: Register a New User

If you want to create your own account:

1. **Via Frontend:**
   - Go to `http://localhost:3000/register`
   - Fill in your details (name, email, password, role)
   - Click "Register"
   - Then login with those credentials

2. **Via API (using curl or Postman):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Your Name",
       "email": "your@email.com",
       "password": "yourpassword",
       "role": "student"
     }'
   ```

## Troubleshooting Login Issues

### Issue: "Invalid credentials" error

**Possible causes:**
1. Email doesn't exist in database
   - **Fix:** Register the email first or use an existing email

2. Password is incorrect
   - **Fix:** Make sure you're using the exact password you registered with
   - Passwords are case-sensitive

3. Database connection issue
   - **Fix:** Make sure MongoDB is running and the connection string in `server/.env` is correct

### Issue: "User already exists" when registering

- The email is already registered
- Use a different email or login with existing credentials

## Quick Start

1. **First time setup:**
   ```bash
   # Create test users
   cd server
   npm run create-test-users
   ```

2. **Login with test credentials:**
   - Email: `student@test.com`
   - Password: `password123`

3. **Or check what users exist:**
   ```bash
   cd server
   npm run list-users
   ```

## Notes

- Passwords are hashed using bcrypt, so you cannot see the actual password
- If you forgot your password, you'll need to either:
  - Register a new account with a different email
  - Manually update the password in MongoDB (requires database access)
  - Implement a password reset feature (not currently available)

## Database Location

Users are stored in MongoDB (not PostgreSQL). The database name is typically `lms` and the collection is `users`.

To manually check MongoDB:
```bash
# Connect to MongoDB
mongo

# Switch to lms database
use lms

# List all users
db.users.find({}, {email: 1, name: 1, role: 1, _id: 0})
```


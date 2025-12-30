# LMS Platform Setup Instructions

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Dependencies

From the root directory, run:

```bash
npm run install-all
```

This will install dependencies for:
- Root package (concurrently)
- Server (backend)
- Client (frontend)

### 2. Set Up MongoDB

**Option A: Local MongoDB**
1. Start MongoDB service on your machine
2. MongoDB will run on `mongodb://localhost:27017` by default

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Use the connection string in your `.env` file

### 3. Set Up PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE lms_analytics;
   ```
3. Run the schema file to create tables:
   ```bash
   psql -U your_username -d lms_analytics -f server/src/config/postgres-schema.sql
   ```
   Or manually copy and run the SQL from `server/src/config/postgres-schema.sql`

### 4. Configure Environment Variables

**Backend Configuration (`server/.env`):**

Create a file `server/.env` with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=lms_analytics
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend Configuration (`client/.env`):**

Create a file `client/.env` with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Run the Application

**Development Mode (runs both server and client):**

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:5000`
- Start the frontend React app on `http://localhost:3000`

**Or run separately:**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application

- **Frontend**: Open [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Testing the Setup

1. **Register a new user:**
   - Go to `/register`
   - Create a student or instructor account

2. **Login:**
   - Use your credentials to login

3. **Create a course (as instructor):**
   - After login, click "Create New Course"
   - Fill in course details

4. **Enroll in a course (as student):**
   - Browse available courses
   - Click "Enroll in Course"

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env`
- Check firewall settings if using remote MongoDB

### PostgreSQL Connection Issues
- Ensure PostgreSQL service is running
- Verify username, password, and database name in `.env`
- Check if database `lms_analytics` exists

### Port Already in Use
- Change `PORT` in `server/.env` if 5000 is taken
- Change React port by setting `PORT=3001` in `client/.env`

### CORS Errors
- Ensure backend is running before frontend
- Check `REACT_APP_API_URL` in `client/.env` matches backend URL

### TypeScript Errors
- Run `npm install` in both `server/` and `client/` directories
- Ensure TypeScript is installed: `npm install -g typescript`

## Production Build

**Build Backend:**
```bash
cd server
npm run build
npm start
```

**Build Frontend:**
```bash
cd client
npm run build
```

The built files will be in `client/build/` and can be served with any static file server.

## Recommended Libraries (Already Included)

- **Forms**: React Hook Form (can be added)
- **Notifications**: react-toastify ✅
- **Charts**: Recharts ✅
- **HTTP Client**: Axios ✅

## Additional Features to Implement

1. **Discussion Forum**: Add forum routes and components
2. **Notifications**: Add notification routes and real-time updates
3. **File Uploads**: Add file upload for course resources
4. **Email Notifications**: Integrate email service for notifications
5. **Search**: Add search functionality for courses
6. **Pagination**: Add pagination for courses and quizzes

## Support

For issues or questions, check:
- MongoDB documentation: https://docs.mongodb.com/
- PostgreSQL documentation: https://www.postgresql.org/docs/
- React documentation: https://react.dev/
- Express documentation: https://expressjs.com/


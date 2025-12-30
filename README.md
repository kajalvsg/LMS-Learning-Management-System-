# Learning Management System (LMS)

A full-stack Learning Management System built with MERN stack, TypeScript, and PostgreSQL for analytics.

## Tech Stack

- **Frontend**: React, TypeScript, React Router, Chart.js/Recharts
- **Backend**: Node.js, Express, TypeScript
- **Databases**: MongoDB (main data), PostgreSQL (analytics)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt

## Project Structure

```
LMS/
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/        # Database configurations
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── app.ts         # Express app setup
│   ├── package.json
│   └── tsconfig.json
├── client/                # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth)
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── package.json
```

## Features

- **User Roles**: Students, Instructors, Admin
- **Course Management**: Create, update, delete courses with modules
- **Enrollment**: Students can enroll in courses
- **Quizzes**: Create and take quizzes with automatic grading
- **Progress Tracking**: Track student progress per course
- **Discussion Forum**: Course-specific discussion threads
- **Notifications**: Course updates and quiz deadlines
- **Analytics**: PostgreSQL-based analytics dashboard
- **Responsive Design**: Mobile-friendly UI

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lms
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=lms_analytics
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

   Create `client/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Set up databases:**
   - MongoDB: Ensure MongoDB is running
   - PostgreSQL: Create database `lms_analytics` and run the schema from `server/src/config/postgres-schema.sql`

4. **Run the application:**
   ```bash
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 3000).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)

### Enrollment
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my-courses` - Get enrolled courses

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get quizzes for course
- `POST /api/quizzes` - Create quiz (Instructor/Admin)
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Progress
- `GET /api/progress/course/:courseId` - Get progress for course
- `PUT /api/progress` - Update progress

### Analytics
- `GET /api/analytics/course/:courseId` - Get course analytics
- `GET /api/analytics/dashboard` - Get instructor dashboard analytics

## Recommended Libraries

- **Forms**: React Hook Form, Formik
- **Notifications**: React Toastify, react-hot-toast
- **Charts**: Recharts, Chart.js with react-chartjs-2
- **UI Components**: Material-UI, Ant Design, or Tailwind CSS
- **HTTP Client**: Axios

## License

ISC


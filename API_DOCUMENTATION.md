# LMS API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional: "student" | "instructor"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student"
}
```

---

## Course Endpoints

### Get All Courses
**GET** `/courses`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "course_id",
    "title": "Introduction to React",
    "description": "Learn React basics",
    "instructor": {
      "_id": "instructor_id",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "modules": [...],
    "enrolledStudents": ["student_id1", "student_id2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Course by ID
**GET** `/courses/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as single course object above

### Create Course
**POST** `/courses`

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Request Body:**
```json
{
  "title": "Advanced TypeScript",
  "description": "Deep dive into TypeScript",
  "modules": [
    {
      "title": "Module 1",
      "content": "Introduction content",
      "order": 1,
      "videoUrl": "https://example.com/video1",
      "resources": ["resource1.pdf"]
    }
  ]
}
```

**Response:** Created course object

### Update Course
**PUT** `/courses/:id`

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Request Body:** Partial course object

**Response:** Updated course object

### Delete Course
**DELETE** `/courses/:id`

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Response:**
```json
{
  "message": "Course deleted successfully"
}
```

---

## Enrollment Endpoints

### Enroll in Course
**POST** `/enrollments`

**Headers:** `Authorization: Bearer <token>` (Student only)

**Request Body:**
```json
{
  "courseId": "course_id"
}
```

**Response:**
```json
{
  "_id": "enrollment_id",
  "studentId": "student_id",
  "courseId": "course_id",
  "enrolledAt": "2024-01-01T00:00:00.000Z"
}
```

### Get My Courses
**GET** `/enrollments/my-courses`

**Headers:** `Authorization: Bearer <token>` (Student only)

**Response:**
```json
[
  {
    "_id": "enrollment_id",
    "studentId": "student_id",
    "courseId": {
      "_id": "course_id",
      "title": "Course Title",
      "description": "Course Description",
      "instructor": {...}
    },
    "enrolledAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Quiz Endpoints

### Get Quizzes by Course
**GET** `/quizzes/course/:courseId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "quiz_id",
    "courseId": "course_id",
    "title": "Quiz 1",
    "questions": [
      {
        "question": "What is React?",
        "options": ["Library", "Framework", "Language", "Tool"],
        "correctAnswer": 0,
        "points": 1
      }
    ],
    "timeLimit": 30,
    "passingScore": 60,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Quiz by ID
**GET** `/quizzes/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** Single quiz object

### Create Quiz
**POST** `/quizzes`

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Request Body:**
```json
{
  "courseId": "course_id",
  "title": "Midterm Quiz",
  "questions": [
    {
      "question": "What is TypeScript?",
      "options": ["Language", "Framework", "Library", "Tool"],
      "correctAnswer": 0,
      "points": 2
    }
  ],
  "timeLimit": 45,
  "passingScore": 70
}
```

**Response:** Created quiz object

### Submit Quiz
**POST** `/quizzes/:id/submit`

**Headers:** `Authorization: Bearer <token>` (Student only)

**Request Body:**
```json
{
  "quizId": "quiz_id",
  "answers": [0, 1, 2, 0] // Array of selected option indices
}
```

**Response:**
```json
{
  "submission": {
    "_id": "submission_id",
    "quizId": "quiz_id",
    "studentId": "student_id",
    "answers": [0, 1, 2, 0],
    "score": 85.5,
    "submittedAt": "2024-01-01T00:00:00.000Z"
  },
  "score": 85.5,
  "passed": true
}
```

---

## Progress Endpoints

### Get Progress
**GET** `/progress/course/:courseId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "progress_id",
  "studentId": "student_id",
  "courseId": "course_id",
  "completedModules": ["module_id1", "module_id2"],
  "progressPercentage": 66.67,
  "lastAccessed": "2024-01-01T00:00:00.000Z"
}
```

### Update Progress
**PUT** `/progress`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "courseId": "course_id",
  "completedModules": ["module_id1", "module_id2", "module_id3"]
}
```

**Response:** Updated progress object

---

## Analytics Endpoints

### Get Course Analytics
**GET** `/analytics/course/:courseId`

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Response:**
```json
{
  "course": {
    "course_id": "course_id",
    "total_enrollments": 150,
    "total_completions": 45,
    "average_progress": 72.5
  },
  "quizzes": [
    {
      "quiz_id": "quiz_id",
      "course_id": "course_id",
      "total_submissions": 120,
      "average_score": 78.5,
      "pass_rate": 85.0
    }
  ]
}
```

### Get Dashboard Analytics
**GET** `/analytics/dashboard`

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Response:**
```json
{
  "totalCourses": 5,
  "totalEnrollments": 500,
  "totalCompletions": 150,
  "averageProgress": 68.5,
  "courseAnalytics": [
    {
      "course_id": "course_id",
      "total_enrollments": 100,
      "total_completions": 30,
      "average_progress": 70.0
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error


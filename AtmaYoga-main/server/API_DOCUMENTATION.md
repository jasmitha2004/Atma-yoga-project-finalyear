# AtmaYoga Backend API Documentation

## Overview

This backend provides REST APIs for user authentication, questionnaire management, and response storage for the Yoga Posture Correction System.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication via HTTP-only cookies. The token is automatically sent with requests when logged in.

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "remember": true
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... }
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Get Current User
```http
GET /api/auth/me
```

#### Check Questionnaire Status
```http
GET /api/auth/status
```

**Response:**
```json
{
  "completedQuestionnaire": true
}
```

#### Save Questionnaire (First-time)
```http
POST /api/auth/questionnaire
Content-Type: application/json

{
  "age": "18–30",
  "gender": "Male",
  "fitness": "Beginner",
  "yogaLevel": "First time",
  "healthConditions": ["Back pain", "None"]
}
```

#### Save Mood & Session Goal
```http
POST /api/auth/mood
Content-Type: application/json

{
  "mood": "Stressed",
  "sessionGoal": "Relaxation"
}
```

---

### Question Routes (`/api/questions`)

#### Get All Questions
```http
GET /api/questions?category=pose-related&isActive=true
```

**Query Parameters:**
- `category` (optional): Filter by category (`pose-related`, `feedback`, `general`, `health`, `session`)
- `isActive` (optional): Filter by active status (`true` or `false`)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "questionText": "What is your age?",
      "questionType": "select",
      "category": "general",
      "options": ["Under 18", "18–30", "31–45"],
      "isRequired": true,
      "order": 1,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Get Question by ID
```http
GET /api/questions/:id
```

#### Create Question (Protected - Admin)
```http
POST /api/questions
Content-Type: application/json

{
  "questionText": "How comfortable are you with this pose?",
  "questionType": "select",
  "category": "pose-related",
  "options": ["Very comfortable", "Somewhat comfortable", "Uncomfortable"],
  "isRequired": true,
  "order": 1
}
```

**Question Types:**
- `text` - Single line text input
- `select` - Dropdown selection
- `checkbox` - Multiple selections
- `radio` - Single selection from options
- `textarea` - Multi-line text input
- `number` - Numeric input

**Categories:**
- `pose-related` - Questions about yoga poses
- `feedback` - User feedback questions
- `general` - General questions
- `health` - Health-related questions
- `session` - Session-specific questions

#### Update Question (Protected - Admin)
```http
PUT /api/questions/:id
Content-Type: application/json

{
  "questionText": "Updated question text",
  "isActive": true
}
```

#### Delete Question (Protected - Admin - Soft Delete)
```http
DELETE /api/questions/:id
```

---

### Response Routes (`/api/responses`)

#### Get All Responses (Protected - Admin)
```http
GET /api/responses?userId=...&questionId=...&sessionId=...
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `questionId` (optional): Filter by question ID
- `sessionId` (optional): Filter by session ID

#### Get My Responses (Protected)
```http
GET /api/responses/my-responses?sessionId=...
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "userId": { "_id": "...", "name": "John Doe", "email": "..." },
      "questionId": {
        "_id": "...",
        "questionText": "What is your age?",
        "questionType": "select",
        "category": "general"
      },
      "responseValue": "18–30",
      "sessionId": "session-123",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Get Response by ID (Protected)
```http
GET /api/responses/:id
```

#### Create Response (Protected)
```http
POST /api/responses
Content-Type: application/json

{
  "questionId": "507f1f77bcf86cd799439011",
  "responseValue": "18–30",
  "sessionId": "session-123",
  "metadata": {
    "poseName": "Tadasana",
    "timestamp": "..."
  }
}
```

**Response Value Types:**
- String for `text`, `select`, `radio`, `textarea`
- Number for `number`
- Array of strings for `checkbox`

#### Create Bulk Responses (Protected)
```http
POST /api/responses/bulk
Content-Type: application/json

{
  "sessionId": "session-123",
  "responses": [
    {
      "questionId": "507f1f77bcf86cd799439011",
      "responseValue": "18–30"
    },
    {
      "questionId": "507f1f77bcf86cd799439012",
      "responseValue": ["Back pain", "None"]
    }
  ]
}
```

#### Update Response (Protected)
```http
PUT /api/responses/:id
Content-Type: application/json

{
  "responseValue": "Updated response"
}
```

#### Delete Response (Protected)
```http
DELETE /api/responses/:id
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "msg": "Validation error",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error

---

## Folder Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── questionController.js  # Question CRUD operations
│   └── responseController.js # Response CRUD operations
├── middleware/
│   ├── authMiddleware.js  # JWT authentication middleware
│   ├── validation.js      # Input validation rules
│   └── errorHandler.js   # Global error handler
├── models/
│   ├── User.js           # User schema
│   ├── Question.js       # Question schema
│   └── Response.js       # Response schema
├── routes/
│   ├── authRoutes.js     # Authentication routes
│   ├── questionRoutes.js # Question routes
│   └── responseRoutes.js # Response routes
├── index.js              # Express app setup
└── package.json          # Dependencies
```

---

## Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/atmayoga
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/atmayoga

# JWT Secret Key (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## Installation & Setup

1. **Install Dependencies:**
```bash
cd server
npm install
```

2. **Set up Environment Variables:**
Create `.env` file with the variables above.

3. **Start MongoDB:**
Make sure MongoDB is running locally or use MongoDB Atlas.

4. **Start the Server:**
```bash
npm start
```

The server will run on `http://localhost:5000`

---

## Future ML Integration

The backend is designed to be modular and ready for ML integration:

1. **Question Model** - Can store ML-related questions
2. **Response Model** - Can store pose analysis results, feedback scores, etc.
3. **Session Tracking** - Responses can be grouped by session for ML training data
4. **Metadata Field** - Can store ML model predictions, confidence scores, etc.

Example ML integration:
- Store pose analysis results in `Response.metadata`
- Use `sessionId` to group responses for training data
- Add ML endpoints in separate controller/routes files

---

## Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed using bcryptjs
- JWT tokens are stored in HTTP-only cookies for security
- Soft delete is used for questions (sets `isActive: false`)
- Validation is performed using express-validator
- Error handling is centralized in the error handler middleware





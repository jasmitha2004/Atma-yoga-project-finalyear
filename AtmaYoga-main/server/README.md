# AtmaYoga Backend

A Node.js and Express backend for the Yoga Posture Correction System, providing user authentication, questionnaire management, and response storage APIs.

## Features

- ✅ User registration and login
- ✅ Secure JWT authentication
- ✅ Questionnaire questions management (CRUD)
- ✅ User responses storage and retrieval
- ✅ Input validation and error handling
- ✅ Modular architecture ready for ML integration

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite with better-sqlite3
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs for password hashing

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```env
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Setup

The SQLite database (`database.sqlite`) will be automatically created on first run. No additional setup required!

### 4. Seed Initial Questions (Optional)

```bash
node scripts/seedQuestions.js
```

This will populate the database with sample questionnaire questions.

### 5. Start the Server

```bash
npm start
```

Server will run on `http://localhost:5000`

## Project Structure

```
server/
├── config/
│   └── db.js                 # SQLite database initialization
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── questionController.js # Question CRUD operations
│   └── responseController.js # Response CRUD operations
├── middleware/
│   ├── authMiddleware.js     # JWT authentication middleware
│   ├── validation.js         # Input validation rules
│   └── errorHandler.js       # Global error handler
├── models/
│   ├── User.js              # User schema
│   ├── Question.js          # Question schema
│   └── Response.js          # Response schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── questionRoutes.js    # Question routes
│   └── responseRoutes.js    # Response routes
├── scripts/
│   └── seedQuestions.js     # Seed script for initial questions
├── index.js                 # Express app entry point
├── package.json             # Dependencies
├── API_DOCUMENTATION.md     # Complete API documentation
└── README.md               # This file
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/status` - Check questionnaire status
- `POST /api/auth/questionnaire` - Save questionnaire
- `POST /api/auth/mood` - Save mood & session goal

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create question (protected)
- `PUT /api/questions/:id` - Update question (protected)
- `DELETE /api/questions/:id` - Delete question (protected)

### Responses
- `GET /api/responses` - Get all responses (protected, admin)
- `GET /api/responses/my-responses` - Get user's responses (protected)
- `GET /api/responses/:id` - Get response by ID (protected)
- `POST /api/responses` - Create response (protected)
- `POST /api/responses/bulk` - Create multiple responses (protected)
- `PUT /api/responses/:id` - Update response (protected)
- `DELETE /api/responses/:id` - Delete response (protected)

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Authentication

The backend uses JWT tokens stored in HTTP-only cookies. After login, the token is automatically sent with each request.

**Protected Routes:**
- Most response routes require authentication
- Question creation/update/delete require authentication (intended for admin use)

## Validation

All inputs are validated using `express-validator`:
- Question creation/update validates question text, type, category, etc.
- Response creation validates question ID, response value, etc.
- Authentication validates email format, password strength, etc.

## Error Handling

Errors are handled centrally through the error handler middleware:
- Validation errors return 400 with detailed error messages
- Authentication errors return 401
- Not found errors return 404
- Server errors return 500

## Database Models

### User
- Stores user account information
- Includes questionnaire fields (age, gender, fitness level, etc.)
- Stores session logs (mood, session goals)

### Question
- Stores questionnaire questions
- Supports multiple question types (text, select, checkbox, etc.)
- Categorized (pose-related, feedback, general, health, session)

### Response
- Stores user responses to questions
- Links to User and Question
- Supports session grouping
- Can store metadata for ML integration

## ML Integration Ready

The backend is designed to be modular and ready for ML integration:

1. **Response Model** - Can store ML predictions in `metadata` field
2. **Session Tracking** - Responses grouped by `sessionId` for training data
3. **Question Categories** - `pose-related` category for ML feedback questions
4. **Modular Structure** - Easy to add ML endpoints in separate controllers/routes

Example ML data structure:
```json
{
  "questionId": "...",
  "responseValue": "Very comfortable",
  "sessionId": "session-123",
  "metadata": {
    "poseName": "Tadasana",
    "mlPrediction": "correct",
    "confidence": 0.95,
    "keypoints": [...]
  }
}
```

## Development

### Running in Development Mode

```bash
npm start
```

Uses `nodemon` for auto-restart on file changes.

### Environment Variables

- Database file (`database.sqlite`) is created automatically
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Testing the API

You can test the API using:
- **Postman** - Import the endpoints
- **curl** - Command line tool
- **Frontend** - The React frontend in `/frontend`

Example curl request:
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get questions
curl http://localhost:5000/api/questions
```

## Troubleshooting

### Database Issues
- Database file (`database.sqlite`) is created automatically in the `server` directory
- If you need to reset, delete `database.sqlite` and restart the server
- Make sure the server has write permissions in the `server` directory

### Authentication Issues
- Check JWT_SECRET is set
- Verify cookies are enabled in frontend
- Check CORS configuration

### Validation Errors
- Check request body format
- Verify required fields are present
- Check data types match schema

## License

This project is part of the AtmaYoga system.


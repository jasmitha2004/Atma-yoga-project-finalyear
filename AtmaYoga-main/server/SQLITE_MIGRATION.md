# SQLite Migration Summary

## Overview

The backend has been successfully migrated from MongoDB/Mongoose to SQLite using `better-sqlite3`.

## Changes Made

### 1. Dependencies
- ✅ Removed: `mongoose`
- ✅ Added: `better-sqlite3`

### 2. Database Configuration
- **File:** `server/config/db.js`
- **Changes:**
  - Replaced MongoDB connection with SQLite initialization
  - Auto-creates `database.sqlite` file on first run
  - Creates all tables automatically with proper schema
  - Includes indexes for performance

### 3. Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  age TEXT DEFAULT '',
  gender TEXT DEFAULT '',
  fitness TEXT DEFAULT '',
  yoga_level TEXT DEFAULT '',
  health_conditions TEXT DEFAULT '[]',
  completed_questionnaire INTEGER DEFAULT 0
)
```

#### Questions Table
```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'text',
  category TEXT DEFAULT 'general',
  options TEXT DEFAULT '[]',
  is_required INTEGER DEFAULT 1,
  question_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### Responses Table
```sql
CREATE TABLE responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  session_id TEXT,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE(user_id, question_id, session_id)
)
```

#### Sessions Table
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  mood TEXT,
  session_goal TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### 4. Models Updated

All models (`User.js`, `Question.js`, `Response.js`) have been rewritten to:
- Use SQLite queries instead of Mongoose methods
- Maintain the same API interface for controllers
- Handle JSON serialization/deserialization for complex fields
- Map database rows to JavaScript objects

### 5. Controllers Updated

All controllers now use synchronous SQLite operations:
- `authController.js` - Uses `User.findByEmail()`, `User.create()`, etc.
- `questionController.js` - Uses `Question.find()`, `Question.create()`, etc.
- `responseController.js` - Uses `Response.find()`, `Response.create()`, etc.

### 6. Middleware Updated

- `authMiddleware.js` - Updated to use synchronous `User.findById()`
- `errorHandler.js` - Updated error handling for SQLite constraint errors

### 7. Routes

All routes remain unchanged - API behavior is identical:
- `/api/auth/*` - Authentication routes
- `/api/questions/*` - Question management routes
- `/api/responses/*` - Response management routes

### 8. Seed Script

- `scripts/seedQuestions.js` - Updated to use SQLite instead of MongoDB

## Key Features

✅ **Auto-initialization** - Database and tables created automatically on first run  
✅ **Foreign Keys** - Proper referential integrity with CASCADE deletes  
✅ **Indexes** - Performance indexes on frequently queried fields  
✅ **JSON Support** - Complex data stored as JSON strings  
✅ **Backward Compatible** - All API endpoints work exactly the same  

## Database File

- **Location:** `server/database.sqlite`
- **Auto-created:** Yes, on first server start
- **Git ignored:** Yes (added to `.gitignore`)

## Migration Notes

1. **No data migration needed** - Fresh start with SQLite
2. **Environment variables** - Removed `MONGO_URI`, no longer needed
3. **Synchronous operations** - better-sqlite3 is synchronous (faster, simpler)
4. **JSON fields** - Arrays and objects stored as JSON strings in TEXT columns

## Testing

To test the migration:

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   Database will be created automatically.

3. Seed questions (optional):
   ```bash
   node scripts/seedQuestions.js
   ```

4. Test API endpoints - they should work exactly as before!

## Benefits

- ✅ **Simpler setup** - No MongoDB installation needed
- ✅ **Faster** - SQLite is faster for single-server applications
- ✅ **Portable** - Database is a single file
- ✅ **No external dependencies** - Everything runs locally
- ✅ **Same API** - No frontend changes needed





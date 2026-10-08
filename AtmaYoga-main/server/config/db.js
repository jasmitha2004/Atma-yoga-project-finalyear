const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Database file path
const DB_PATH = path.join(__dirname, "..", "database.sqlite");

let db = null;

/**
 * Initialize SQLite database and create tables if they don't exist
 */
const initDB = () => {
  try {
    // Create database connection
    db = new Database(DB_PATH);
    
    // Enable foreign keys
    db.pragma("foreign_keys = ON");

    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        -- Additional fields for questionnaire (stored as JSON for flexibility)
        age TEXT DEFAULT '',
        gender TEXT DEFAULT '',
        fitness TEXT DEFAULT '',
        yoga_level TEXT DEFAULT '',
        health_conditions TEXT DEFAULT '[]',
        completed_questionnaire INTEGER DEFAULT 0
      )
    `);

    // Create questions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS questions (
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
    `);

    // Create responses table
    db.exec(`
      CREATE TABLE IF NOT EXISTS responses (
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
    `);

    // Create sessions table for mood tracking
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        mood TEXT,
        session_goal TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_responses_user_id ON responses(user_id);
      CREATE INDEX IF NOT EXISTS idx_responses_question_id ON responses(question_id);
      CREATE INDEX IF NOT EXISTS idx_responses_session_id ON responses(session_id);
      CREATE INDEX IF NOT EXISTS idx_responses_user_created ON responses(user_id, created_at);
      CREATE INDEX IF NOT EXISTS idx_questions_category_active ON questions(category, is_active, question_order);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    `);

    console.log("✅ SQLite database initialized successfully");
    console.log(`📁 Database file: ${DB_PATH}`);
    
    return db;
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

/**
 * Get database instance
 */
const getDB = () => {
  if (!db) {
    db = initDB();
  }
  return db;
};

/**
 * Close database connection
 */
const closeDB = () => {
  if (db) {
    db.close();
    db = null;
    console.log("Database connection closed");
  }
};

module.exports = {
  initDB,
  getDB,
  closeDB,
};

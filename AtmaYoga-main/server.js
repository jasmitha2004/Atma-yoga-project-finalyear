const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

// Required for Node < 18 (safe for all)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 3000;

// ================== Middleware ==================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files (if any)
app.use(express.static(path.join(__dirname, "public")));

// ================== SQLite Setup ==================
const db = new Database("database.sqlite");

// ================== USERS TABLE ==================
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rememberMe INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// ================== QUESTIONNAIRE TABLE ==================
db.prepare(`
  CREATE TABLE IF NOT EXISTS questionnaire (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userEmail TEXT NOT NULL,
    age TEXT,
    gender TEXT,
    fitness TEXT,
    yogaLevel TEXT,
    healthConditions TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// ================== MOOD TABLE ==================
db.prepare(`
  CREATE TABLE IF NOT EXISTS mood_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userEmail TEXT NOT NULL,
    mood TEXT NOT NULL,
    sessionGoal TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log("✅ SQLite database initialized");

// ================== Routes ==================

// Root route
app.get("/", (req, res) => {
  res.send("AtmaYoga backend running");
});

// ================== Signup ==================
app.post("/api/signup", (req, res) => {
  let { name, email, password } = req.body;
  email = email.trim().toLowerCase();

  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  db.prepare(`
    INSERT INTO users (name, email, password, rememberMe)
    VALUES (?, ?, ?, ?)
  `).run(name, email, password, 0);

  res.json({ message: "Account created successfully" });
});

// ================== Login ==================
app.post("/api/login", (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ================== SAVE QUESTIONNAIRE (ONCE) ==================
app.post("/api/auth/questionnaire", (req, res) => {
  const { age, gender, fitness, yogaLevel, healthConditions } = req.body;
  const userEmail = "test-user@example.com"; // replace later with auth email

  if (!age || !gender || !fitness || !yogaLevel) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const exists = db
    .prepare("SELECT id FROM questionnaire WHERE userEmail = ?")
    .get(userEmail);

  if (exists) {
    return res.json({ message: "Questionnaire already submitted" });
  }

  db.prepare(`
    INSERT INTO questionnaire
    (userEmail, age, gender, fitness, yogaLevel, healthConditions)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userEmail,
    age,
    gender,
    fitness,
    yogaLevel,
    JSON.stringify(healthConditions || [])
  );

  res.json({ message: "Questionnaire saved successfully" });
});

// ================== SAVE MOOD (EVERY SESSION) ==================
app.post("/api/auth/mood", (req, res) => {
  const { mood, sessionGoal } = req.body;
  const userEmail = "test-user@example.com";

  if (!mood) {
    return res.status(400).json({ message: "Mood is required" });
  }

  db.prepare(`
    INSERT INTO mood_logs (userEmail, mood, sessionGoal)
    VALUES (?, ?, ?)
  `).run(userEmail, mood, sessionGoal || "");

  res.json({ message: "Mood saved successfully" });
});

// ================== CHECK QUESTIONNAIRE STATUS ==================
app.get("/api/auth/status", (req, res) => {
  const userEmail = "test-user@example.com";

  const row = db
    .prepare("SELECT id FROM questionnaire WHERE userEmail = ?")
    .get(userEmail);

  res.json({ completedQuestionnaire: !!row });
});

// ================== CHATBOT → LLM Service ==================
// Note: The chatbot UI calls the LLM service directly at http://localhost:8000/chat
// This endpoint is kept for backward compatibility but the service is now in yoga_llm_files/
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // Forward message to LLM service (now in yoga_llm_files/)
    const llmResponse = await fetch("http://127.0.0.1:8001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!llmResponse.ok) {
      throw new Error("LLM responded with error");
    }

    const data = await llmResponse.json();

    res.json({
      answer: data.answer,
      recommended_asana: data.recommended_asana,
    });
  } catch (error) {
    console.error("❌ LLM error:", error);
    res.status(500).json({ error: "LLM service unavailable" });
  }
});

// ================== Start Server ==================
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

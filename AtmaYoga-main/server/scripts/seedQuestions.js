/**
 * Seed script to populate initial questionnaire questions
 * Run with: node scripts/seedQuestions.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Question = require("../models/Question");
const { initDB } = require("../config/db");

const questions = [
  // General Information Questions
  {
    questionText: "What is your age?",
    questionType: "select",
    category: "general",
    options: ["Under 18", "18–30", "31–45", "46–60", "Above 60"],
    isRequired: true,
    order: 1,
  },
  {
    questionText: "What is your gender?",
    questionType: "select",
    category: "general",
    options: ["Female", "Male", "Prefer not to say"],
    isRequired: true,
    order: 2,
  },
  {
    questionText: "What is your current fitness level?",
    questionType: "select",
    category: "general",
    options: ["Beginner", "Intermediate", "Advanced"],
    isRequired: true,
    order: 3,
  },
  {
    questionText: "How familiar are you with yoga?",
    questionType: "select",
    category: "general",
    options: [
      "First time",
      "Practiced a few times",
      "Regular practitioner",
      "Expert",
    ],
    isRequired: true,
    order: 4,
  },
  {
    questionText: "How long can you comfortably exercise?",
    questionType: "select",
    category: "general",
    options: [
      "Less than 10 minutes",
      "10–20 minutes",
      "20–40 minutes",
      "More than 40 minutes",
    ],
    isRequired: true,
    order: 5,
  },
  {
    questionText: "Do you have any health conditions?",
    questionType: "checkbox",
    category: "health",
    options: [
      "Back pain",
      "Neck / shoulder pain",
      "Knee pain",
      "Arthritis",
      "High blood pressure",
      "Low blood pressure",
      "Asthma / breathing difficulty",
      "Recent surgery",
      "Pregnancy",
      "None",
    ],
    isRequired: true,
    order: 6,
  },
  {
    questionText: "Any injuries we should be aware of?",
    questionType: "textarea",
    category: "health",
    options: [],
    isRequired: false,
    order: 7,
  },
  {
    questionText: "Do you experience chronic stress or anxiety?",
    questionType: "select",
    category: "health",
    options: ["Yes", "Sometimes", "No"],
    isRequired: true,
    order: 8,
  },
  // Session Questions
  {
    questionText: "How are you feeling right now?",
    questionType: "select",
    category: "session",
    options: [
      "Calm",
      "Stressed",
      "Tired",
      "Low energy",
      "Anxious",
      "Sad",
      "Angry",
      "Energetic",
      "Unmotivated",
    ],
    isRequired: false,
    order: 9,
  },
  {
    questionText: "What do you want from today's session?",
    questionType: "select",
    category: "session",
    options: [
      "Relaxation",
      "Mood uplift",
      "Reduce anxiety",
      "Improve energy",
      "Physical stretch / flexibility",
      "Strength building",
      "Pain relief",
      "Better sleep",
    ],
    isRequired: false,
    order: 10,
  },
  {
    questionText: "What are your primary long-term yoga goals?",
    questionType: "checkbox",
    category: "general",
    options: [
      "Weight loss",
      "Core strength",
      "Flexibility",
      "Posture correction",
      "Stress relief",
      "Strength & endurance",
      "Spiritual / mindfulness",
      "General fitness",
    ],
    isRequired: false,
    order: 11,
  },
  // Pose-related Questions
  {
    questionText: "How comfortable are you with this pose?",
    questionType: "select",
    category: "pose-related",
    options: ["Very comfortable", "Somewhat comfortable", "Uncomfortable"],
    isRequired: false,
    order: 1,
  },
  {
    questionText: "Did you experience any pain during this pose?",
    questionType: "select",
    category: "pose-related",
    options: ["No pain", "Mild discomfort", "Moderate pain", "Severe pain"],
    isRequired: false,
    order: 2,
  },
  {
    questionText: "How would you rate the difficulty of this pose?",
    questionType: "select",
    category: "pose-related",
    options: ["Very easy", "Easy", "Moderate", "Difficult", "Very difficult"],
    isRequired: false,
    order: 3,
  },
  // Feedback Questions
  {
    questionText: "How satisfied are you with the pose correction guidance?",
    questionType: "select",
    category: "feedback",
    options: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied",
    ],
    isRequired: false,
    order: 1,
  },
  {
    questionText: "Would you like to provide additional feedback?",
    questionType: "textarea",
    category: "feedback",
    options: [],
    isRequired: false,
    order: 2,
  },
];

function seedQuestions() {
  try {
    // Initialize database
    initDB();
    console.log("✅ Database initialized");

    // Check if questions already exist
    const existingQuestions = Question.find({});
    if (existingQuestions.length > 0) {
      console.log(`⚠️  Found ${existingQuestions.length} existing questions. Skipping seed.`);
      console.log("   To re-seed, delete database.sqlite and run again.");
      process.exit(0);
    }

    // Insert questions
    const insertedQuestions = [];
    questions.forEach((q) => {
      const question = Question.create(q);
      insertedQuestions.push(question);
    });

    console.log(`✅ Successfully seeded ${insertedQuestions.length} questions`);

    // Display summary
    const categories = {};
    insertedQuestions.forEach((q) => {
      categories[q.category] = (categories[q.category] || 0) + 1;
    });

    console.log("\n📊 Questions by category:");
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
}

// Run seed function
seedQuestions();

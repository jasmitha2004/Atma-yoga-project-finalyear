const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Session = require("../models/Session");

/************************************
 * PUBLIC ROUTES
 ************************************/
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

/************************************
 * PROTECTED ROUTES
 ************************************/
router.get("/me", protect, getMe);

/************************************
 * NEW ROUTE:
 * Check if questionnaire completed
 ************************************/
router.get("/status", protect, async (req, res) => {
  try {
    const user = User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      completedQuestionnaire: !!user.completedQuestionnaire,
    });
  } catch (err) {
    console.error("Status check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/************************************
 * NEW ROUTE:
 * Save first-time questionnaire
 ************************************/
router.post("/questionnaire", protect, async (req, res) => {
  try {
    const { age, gender, fitness, yogaLevel, healthConditions } = req.body;

    const updatedUser = User.updateById(req.user.id, {
      age: age || "",
      gender: gender || "",
      fitness: fitness || "",
      yogaLevel: yogaLevel || "",
      healthConditions: healthConditions || [],
      completedQuestionnaire: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Questionnaire saved",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Questionnaire save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/************************************
 * NEW ROUTE:
 * Save daily mood & session goal
 ************************************/
router.post("/mood", protect, async (req, res) => {
  try {
    const { mood, sessionGoal } = req.body;

    const user = User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    Session.create({
      userId: user.id,
      mood,
      sessionGoal,
    });

    res.json({ success: true, message: "Mood recorded" });
  } catch (err) {
    console.error("Mood save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/************************************
 * EXPORT ROUTER
 ************************************/
module.exports = router;

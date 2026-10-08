// src/pages/Mood/MoodForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../LivePose/Questionnaire.css";


function MoodForm() {
  const navigate = useNavigate();
  const [mood, setMood] = useState("");
  const [sessionGoal, setSessionGoal] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        "/api/auth/mood",
        { mood, sessionGoal },
        { withCredentials: true }
      );

      navigate("/livepose/camera");
    } catch (err) {
      console.error("Failed to save mood", err);
      alert("Could not save your mood. Please try again.");
    }
  }

  return (
    <div className="questionnaire-wrapper">
      <h1 className="questionnaire-title">How are you today?</h1>
      <p className="questionnaire-subtitle">
        We’ll tune your live session based on how you feel right now.
      </p>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        <div className="question-card">
          <label>1. How are you feeling right now?</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Calm</option>
            <option>Stressed</option>
            <option>Tired</option>
            <option>Low energy</option>
            <option>Anxious</option>
            <option>Sad</option>
            <option>Angry</option>
            <option>Energetic</option>
            <option>Unmotivated</option>
          </select>
        </div>

        <div className="question-card">
          <label>2. What do you want from today’s session?</label>
          <select
            value={sessionGoal}
            onChange={(e) => setSessionGoal(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Relaxation</option>
            <option>Mood uplift</option>
            <option>Reduce anxiety</option>
            <option>Improve energy</option>
            <option>Physical stretch / flexibility</option>
            <option>Strength building</option>
            <option>Pain relief</option>
            <option>Better sleep</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Start Live Pose
        </button>
      </form>
    </div>
  );
}

export default MoodForm;

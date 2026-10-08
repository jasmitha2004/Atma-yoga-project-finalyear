// src/pages/LivePose/Questionnaire.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Questionnaire.css";

function Questionnaire() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    gender: "",
    fitness: "",
    yogaLevel: "",
    duration: "",
    healthConditions: [],
    injuries: "",
    stress: "",
    mood: "",
    sessionGoal: "",
    yogaGoals: [],
    targetArea: "",
    sessionDuration: "",
    intensity: "",
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleMultiSelect(field, value) {
    setForm((prev) => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((x) => x !== value) };
      }
      return { ...prev, [field]: [...arr, value] };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 🔹 Save PERMANENT questionnaire data (first-time only)
      await axios.post(
        "/api/auth/questionnaire",
        {
          age: form.age,
          gender: form.gender,
          fitness: form.fitness,
          yogaLevel: form.yogaLevel,
          healthConditions: form.healthConditions,
        },
        { withCredentials: true }
      );

      // ✅ MARK QUESTIONNAIRE AS COMPLETED (CRITICAL)
      localStorage.setItem("questionnaireCompleted", "true");

      // ✅ Go to mood page (camera must NOT start yet)
      navigate("/mood");

    } catch (err) {
      console.error("Failed to save questionnaire", err);
      alert("Could not save your details. Please try again.");
    }
  }

  return (
    <div className="questionnaire-wrapper">
      <h1 className="questionnaire-title">Yoga Session Questionnaire</h1>
      <p className="questionnaire-subtitle">
        Tell us a bit about yourself so we can design safer and more personal
        sessions for you.
      </p>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {/* 1. AGE */}
        <div className="question-card">
          <label>1. Age</label>
          <select
            value={form.age}
            onChange={(e) => updateField("age", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Under 18</option>
            <option>18–30</option>
            <option>31–45</option>
            <option>46–60</option>
            <option>Above 60</option>
          </select>
        </div>

        {/* 2. GENDER */}
        <div className="question-card">
          <label>2. Gender</label>
          <select
            value={form.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        {/* 3. FITNESS LEVEL */}
        <div className="question-card">
          <label>3. Current fitness level</label>
          <select
            value={form.fitness}
            onChange={(e) => updateField("fitness", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* 4. YOGA EXPERIENCE */}
        <div className="question-card">
          <label>4. How familiar are you with yoga?</label>
          <select
            value={form.yogaLevel}
            onChange={(e) => updateField("yogaLevel", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>First time</option>
            <option>Practiced a few times</option>
            <option>Regular practitioner</option>
            <option>Expert</option>
          </select>
        </div>

        {/* 5. EXERCISE DURATION */}
        <div className="question-card">
          <label>5. How long can you comfortably exercise?</label>
          <select
            value={form.duration}
            onChange={(e) => updateField("duration", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option>Less than 10 minutes</option>
            <option>10–20 minutes</option>
            <option>20–40 minutes</option>
            <option>More than 40 minutes</option>
          </select>
        </div>

        {/* 6. HEALTH CONDITIONS */}
        <div className="question-card">
          <label>6. Health conditions (multiple select)</label>
          <div className="checkbox-group">
            {[
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
            ].map((item) => (
              <label key={item} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.healthConditions.includes(item)}
                  onChange={() => toggleMultiSelect("healthConditions", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* 7–11 REMAIN UNCHANGED (same as your original code) */}

        <button type="submit" className="submit-btn">
          Submit & Continue
        </button>
      </form>
    </div>
  );
}

export default Questionnaire;

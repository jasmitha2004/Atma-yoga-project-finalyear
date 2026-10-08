// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home/Home";
import Team from "./pages/Team/Team";
import About from "./pages/About/About";
import AsanasLibrary from "./pages/Asanas/AsanasLibrary";
import Login from "./pages/Login/Login";
import AsanaLens from "./pages/AsanaLens/AsanaLens";
import LivePose from "./pages/LivePose/LivePose";

import Start from "./pages/Start/Start";
import Questionnaire from "./pages/LivePose/Questionnaire";
import MoodForm from "./pages/Mood/MoodForm";

// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/about" element={<About />} />
        <Route path="/asanas" element={<AsanasLibrary />} />
        <Route path="/login" element={<Login />} />
        <Route path="/asanalens" element={<AsanaLens />} />

        {/* PROTECTED FLOW */}
        <Route
          path="/start"
          element={
            <ProtectedRoute>
              <Start />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute>
              <Questionnaire />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <ProtectedRoute>
              <MoodForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/livepose/camera"
          element={
            <ProtectedRoute>
              <LivePose />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

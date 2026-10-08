import React, { useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { getFinalDistance } from "../../yoga/distance";
import { speak } from "../../yoga/voice";

function LivePose() {
  console.log("🔥 LivePose component loaded");
  const videoRef = useRef(null);
  const distanceRef = useRef(null);
  const lastSpokenRef = useRef(0);

  useEffect(() => {
    const videoEl = videoRef.current;
    const distanceEl = distanceRef.current;

    if (!videoEl || !distanceEl) return;

    /* -------------------------
      1. SETUP MEDIAPIPE POSE
    -------------------------- */
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    /* --------------------------------------------
       2. FUNCTION TO CHECK IF FULL BODY IS VISIBLE
       - if legs/feet not detected → user too close
    --------------------------------------------- */
    function isFullBody(landmarks) {
      const REQUIRED_POINTS = [
        23, 24, // hips
        25, 26, // knees
        27, 28  // ankles
      ];

      return REQUIRED_POINTS.every((i) => {
        const p = landmarks[i];
        return p && p.visibility > 0.4;
      });
    }

    /* -----------------------------
        3. PROCESS POSE RESULTS
    ------------------------------ */
    pose.onResults((results) => {
      const landmarks = results.poseLandmarks;

      if (!landmarks || !landmarks.length) {
        distanceEl.innerText = "No person detected";
        return;
      }

      /* ------------------------------
          FULL BODY CHECK
      ------------------------------- */
      const fullBody = isFullBody(landmarks);

      if (!fullBody) {
        distanceEl.innerText = "Move back — full body not visible";

        const now = Date.now();
        if (now - lastSpokenRef.current > 2000) {
          speak("Please move back until your full body is visible.");
          lastSpokenRef.current = now;
        }

        return;
      }

      /* ------------------------------
          DISTANCE CALCULATION
      ------------------------------- */
      const dCm = getFinalDistance(landmarks);

      if (dCm == null || Number.isNaN(dCm)) {
        distanceEl.innerText = "Measuring...";
        return;
      }

      const cm = Math.round(dCm);
      distanceEl.innerText = `Distance: ${cm} cm`;

      /* ------------------------------
          4. CONTROLLED SPEAK (NO DELAYS)
      ------------------------------- */
      const now = Date.now();

      if (now - lastSpokenRef.current > 2000) {
        if (cm < 120) {
          speak("Move a little away from the camera.");
        } else if (cm > 260) {
          speak("Please come a little closer to the camera.");
        } else {
          speak("Perfect distance. Hold your pose.");
        }

        lastSpokenRef.current = now;
      }
    });

    /* -----------------------------
        5. START CAMERA
    ------------------------------ */
    const camera = new Camera(videoEl, {
      onFrame: async () => {
        await pose.send({ image: videoEl });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  return (
    <div className="live-container" style={{ padding: "20px", textAlign: "center" }}>
      <h1>Live Yoga Pose Distance Check</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="live-video"
        style={{
          width: "640px",
          height: "480px",
          background: "black",
          borderRadius: "12px",
          border: "5px solid red",
        }}
      ></video>

      <div
        ref={distanceRef}
        className="distance-display"
        style={{
          fontSize: "24px",
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        Measuring...
      </div>
    </div>
  );
}

export default LivePose;

/*******************************
 * src/yoga/distance.js
 * Distance estimation from MediaPipe Pose landmarks
 *******************************/

/**
 * Use nose z-depth (MediaPipe Pose gives x,y,z,visibility for each landmark)
 * z is in meters (approx), more negative = closer to the camera.
 * We convert it to a rough distance in centimeters.
 */
function estimateDepthFromNose(landmarks) {
  if (!landmarks || !landmarks[0]) return null;

  const nose = landmarks[0]; // Pose landmark 0 = nose

  if (nose.z == null) return null;

  // nose.z is usually negative when closer to camera.
  // Scale factor 300 just to bring it into "cm-ish" range.
  const distCm = Math.abs(nose.z * 300);

  if (!Number.isFinite(distCm)) return null;
  return distCm;
}

/**
 * Backup distance estimate using bounding box area.
 * Bigger person in frame => closer => smaller distance.
 */
function estimateFromBoundingBox(landmarks) {
  if (!landmarks || !landmarks.length) return null;

  const xs = landmarks.map((p) => p.x);
  const ys = landmarks.map((p) => p.y);

  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const area = w * h;

  if (area <= 0 || !Number.isFinite(area)) return null;

  // Tune 180 if you want different range
  const distCm = 180 / Math.sqrt(area);
  return distCm;
}

/**
 * Final stabilized distance:
 * 1. Prefer depth (nose.z)
 * 2. Fallback to bounding box
 */
export function getFinalDistance(landmarks) {
  const dDepth = estimateDepthFromNose(landmarks);
  const dBbox = estimateFromBoundingBox(landmarks);

  if (dDepth != null && Number.isFinite(dDepth)) return dDepth;
  if (dBbox != null && Number.isFinite(dBbox)) return dBbox;

  return null;
}

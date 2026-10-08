import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_image
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)

# Allow React frontend to call the API
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

# Folder to save uploaded images
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/predict", methods=["POST"])
def predict():
    """Handle image upload and pose prediction"""
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"success": False, "error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "error": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"}), 400

    try:
        # Generate unique filename to avoid conflicts
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # Save file
        file.save(filepath)

        # Predict pose
        prediction = predict_image(filepath)
        
        # Optionally clean up the file after prediction
        # os.remove(filepath)
        
        return jsonify({
            "success": True, 
            "prediction": prediction,
            "message": f"Detected pose: {prediction}"
        })
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        # Clean up file on error
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Yoga Pose Classifier"})

if __name__ == "__main__":
    # Run on port 5001 to avoid conflict with Node.js backend (port 5000)
    # Update frontend AsanaLens.jsx to use port 5001 if needed
    FLASK_PORT = int(os.environ.get("FLASK_PORT", 5001))
    app.run(debug=True, host="127.0.0.1", port=FLASK_PORT)

# Backend Setup Guide

This guide will help you set up both the Node.js backend (authentication and user management) and the Python Flask backend (yoga pose classification).

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- MongoDB (local installation or MongoDB Atlas account)
- pip (Python package manager)

## Part 1: Node.js Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection String
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/atmayoga

# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/atmayoga

# JWT Secret Key (generate a random string)
# Generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Important:** 
- Replace `your_super_secret_jwt_key_change_this_in_production` with a secure random string
- Update `MONGO_URI` with your actual MongoDB connection string

### 3. Start MongoDB

**Local MongoDB:**
```bash
# On Windows (if installed as service, it should start automatically)
# Or start manually:
mongod

# On macOS/Linux:
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas (Cloud):**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `MONGO_URI` in `.env`

### 4. Start the Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

## Part 2: Python Flask Backend Setup

### 1. Create Virtual Environment (Recommended)

```bash
cd YogaPoseClassifier
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note:** If you encounter issues installing PyTorch, you may need to install it separately:

```bash
# For CPU only:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# For GPU support (CUDA):
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### 3. Verify Model File

Make sure `best_yoga_resnet50.pth` exists in the `YogaPoseClassifier` directory. This is the trained model file for pose classification.

### 4. Start the Flask Server

```bash
python app.py
```

The Flask server will run on `http://127.0.0.1:5000`

**Important:** The Flask app runs on port 5000 by default. If your Node.js backend is also on port 5000, you'll need to change one of them. You can modify the Flask app port in `app.py`:

```python
app.run(debug=True, host="127.0.0.1", port=5001)  # Change to 5001
```

And update the frontend to use the new port in `AsanaLens.jsx`.

## API Endpoints

### Node.js Backend (Port 5000)

#### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password, remember }`
  
- `POST /api/auth/logout` - Logout user
  
- `GET /api/auth/me` - Get current user (protected)
  
- `GET /api/auth/status` - Check questionnaire status (protected)
  
- `POST /api/auth/questionnaire` - Save questionnaire (protected)
  - Body: `{ age, gender, fitness, yogaLevel, healthConditions }`
  
- `POST /api/auth/mood` - Save mood and session goal (protected)
  - Body: `{ mood, sessionGoal }`

### Python Flask Backend (Port 5000 or 5001)

- `POST /api/predict` - Predict yoga pose from image
  - Form data: `file` (image file)
  - Response: `{ success: true, prediction: "Pose Name" }`
  
- `GET /api/health` - Health check endpoint

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check your connection string is correct
- For Atlas, ensure your IP is whitelisted

### Port Conflicts

- Node.js backend: Change `PORT` in `.env`
- Flask backend: Change port in `app.py` last line

### CORS Issues

- Ensure frontend URL is in CORS origins list
- Check that credentials are included in frontend requests

### Model Loading Issues

- Ensure `best_yoga_resnet50.pth` exists
- Check file permissions
- Verify PyTorch is installed correctly

## Development vs Production

### Development
- Both servers run on localhost
- Debug mode enabled
- CORS allows localhost origins

### Production
- Use environment variables for all secrets
- Disable debug mode
- Configure proper CORS origins
- Use HTTPS
- Set secure cookie flags

## Testing the Backend

### Test Node.js Backend

```bash
# Test health (if you add a health endpoint)
curl http://localhost:5000/api/auth/me

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234!"}'
```

### Test Flask Backend

```bash
# Test health
curl http://127.0.0.1:5000/api/health

# Test prediction (replace with actual image path)
curl -X POST http://127.0.0.1:5000/api/predict \
  -F "file=@path/to/image.jpg"
```

## Next Steps

1. Set up both backends following the steps above
2. Ensure MongoDB is running
3. Start both servers
4. Test the frontend connection
5. Verify all API endpoints are working


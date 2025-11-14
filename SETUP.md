# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install:all

# OR install separately:
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Backend

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env` and add:
   - Your MongoDB Atlas connection string
   - A strong JWT secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

3. **Important**: Whitelist your IP in MongoDB Atlas:
   ```bash
   cd backend
   npm run check-ip
   ```
   Follow the instructions to add your IP to MongoDB Atlas Network Access.

### Step 3: Configure Frontend (Optional)

1. Copy the example environment file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `frontend/.env` if you need to change the API URL (default is `http://localhost:5000/api/v1`)

### Step 4: Start the Application

**Option A: Run in separate terminals (Recommended)**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Option B: Use root-level scripts**
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

### Step 5: Access the App

- **Frontend**: Open http://localhost:5173 in your browser
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Step 6: Create Your First Account

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in your details
4. You'll be automatically logged in and redirected to the dashboard

## ✅ Verification

Test that everything is working:
```bash
cd backend
npm run test-apis
```

All endpoints should return success (✅).

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Run `npm run check-ip` in backend directory
- Add your IP to MongoDB Atlas Network Access
- Wait 1-2 minutes for changes to propagate
- Restart the backend server

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check browser console for CORS errors

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically use next available port

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check the [Known Issues](#-known-issues--caveats) section for limitations
- Explore the API endpoints using the test scripts


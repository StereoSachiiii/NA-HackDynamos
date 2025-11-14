# Quick Fix: Network Error During Signup

## ✅ Backend is Running
Your backend is confirmed running on port 5000. The issue is likely with the frontend connection.

## 🔧 Quick Fixes

### Option 1: Use Vite Proxy (Recommended)
The frontend is now configured to use Vite's proxy in development. Make sure:

1. **Frontend is running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **The API will use `/api/v1` which Vite proxies to `http://localhost:5000/api/v1`**

3. **If you still get errors, try:**
   - Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache
   - Check browser console (F12) for errors

### Option 2: Use Direct URL
If proxy doesn't work, create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Then restart the frontend dev server.

## 🔍 Verify Everything

1. **Backend running?** ✅ (You confirmed this)
   - Should see: `Nutrition Advisor API running on port 5000`

2. **Frontend running?**
   ```bash
   cd frontend
   npm run dev
   ```
   - Should see: `Local: http://localhost:5173/`

3. **Check browser console:**
   - Open http://localhost:5173
   - Press F12
   - Look for: `API Base URL: /api/v1` (or the full URL)
   - Check for any red errors

4. **Test connection:**
   - Open browser console
   - Type: `fetch('/api/v1').then(r => r.json()).then(console.log)`
   - Should return: `{success: true, message: "API v1 running"}`

## 🐛 Still Not Working?

1. **Check CORS:**
   - Backend `.env` should have: `CLIENT_URL=http://localhost:5173`
   - Restart backend after changing

2. **Check firewall:**
   - Temporarily disable Windows Firewall to test
   - Add exception for Node.js if needed

3. **Try different browser:**
   - Sometimes browser extensions cause issues
   - Try incognito/private mode

4. **Check ports:**
   - Backend: 5000
   - Frontend: 5173
   - Make sure nothing else is using these ports

## 📝 Current Configuration

- **Backend**: Running on http://localhost:5000 ✅
- **Frontend API URL**: Uses Vite proxy `/api/v1` in development
- **CORS**: Configured for http://localhost:5173

The code has been updated to use the Vite proxy automatically in development mode. Just restart your frontend dev server and try again!


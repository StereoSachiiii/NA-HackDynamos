# Troubleshooting Guide

## Network Error During Signup/Login

### Symptoms
- Error message: "Network error" or "Cannot connect to server"
- Registration/Login fails immediately
- No response from backend

### Common Causes & Solutions

#### 1. Backend Not Running
**Check:**
```bash
# Check if backend is running
curl http://localhost:5000/health
# OR
Invoke-WebRequest -Uri http://localhost:5000/health
```

**Solution:**
```bash
cd backend
npm run dev
```

You should see:
```
[INFO] Nutrition Advisor API running on port 5000 in development mode
[INFO] Health check: http://localhost:5000/health
```

#### 2. Wrong API URL
**Check:**
- Open browser console (F12)
- Look for: "API Base URL: ..."
- Should be: `http://localhost:5000/api/v1`

**Solution:**
- Create `frontend/.env` file:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api/v1
  ```
- Restart frontend dev server

#### 3. CORS Issues
**Symptoms:**
- Browser console shows CORS error
- Error: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
- Check `backend/.env` has:
  ```env
  CLIENT_URL=http://localhost:5173
  ```
- Restart backend server
- Clear browser cache

#### 4. Port Already in Use
**Symptoms:**
- Backend won't start
- Error: "Port 5000 is already in use"

**Solution:**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# OR change port in backend/.env
PORT=5001
```

#### 5. Firewall/Antivirus Blocking
**Symptoms:**
- Backend runs but frontend can't connect
- No errors in backend logs

**Solution:**
- Check Windows Firewall settings
- Temporarily disable antivirus to test
- Add exception for Node.js

#### 6. MongoDB Connection Issues
**Symptoms:**
- Backend starts but shows database disconnected
- Registration might work but other features fail

**Solution:**
```bash
cd backend
npm run check-ip
# Follow instructions to whitelist IP in MongoDB Atlas
```

## Quick Diagnostic Steps

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"success":true,"database":"connected",...}`

2. **Check API Base:**
   ```bash
   curl http://localhost:5000/api/v1
   ```
   Should return: `{"success":true,"message":"API v1 running"}`

3. **Test Registration Endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for errors
   - Check Network tab for failed requests

5. **Check Backend Logs:**
   - Look at terminal where backend is running
   - Check for error messages
   - Verify requests are being received

## Still Having Issues?

1. **Clear Everything:**
   ```bash
   # Clear browser cache and localStorage
   # In browser console:
   localStorage.clear()
   
   # Restart both servers
   # Backend: Ctrl+C then npm run dev
   # Frontend: Ctrl+C then npm run dev
   ```

2. **Verify Environment:**
   ```bash
   # Backend
   cd backend
   cat .env  # Check MONGO_URI and JWT_SECRET are set
   
   # Frontend
   cd frontend
   cat .env  # Check VITE_API_BASE_URL (optional)
   ```

3. **Test with API Script:**
   ```bash
   cd backend
   npm run test-apis
   ```
   All tests should pass ✅

4. **Check Node Version:**
   ```bash
   node --version  # Should be >= 18.18.0
   ```

## Common Error Messages

### "Network Error"
- Backend not running
- Wrong API URL
- Firewall blocking

### "User already exists"
- Email is already registered
- Try different email or login instead

### "Invalid credentials"
- Wrong email/password
- User doesn't exist

### "Validation failed"
- Missing required fields
- Invalid email format
- Password too short (< 6 characters)

### "Cannot read property 'data' of undefined"
- Network error occurred
- Check backend is running

## Getting Help

If none of these solutions work:
1. Check backend terminal for error messages
2. Check browser console (F12) for errors
3. Verify both servers are running
4. Test API endpoints directly with curl/Postman
5. Check MongoDB connection status


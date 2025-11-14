# Nutrition Advisor - Full Stack MERN Application

A comprehensive nutrition tracking and advisory platform tailored for Sri Lankan dietary needs. Built with Node.js/Express backend and React/Vite frontend.

## 🚀 Quick Start

> **TL;DR**: Install dependencies, configure `.env` files, run `npm run dev` in both backend and frontend directories.

### Prerequisites
- Node.js >= 18.18.0
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Quick Setup (5 Minutes)

See [SETUP.md](SETUP.md) for detailed step-by-step instructions.

**Quick version:**
1. Install: `npm run install:all` (from root) or install in each directory
2. Backend: Copy `backend/.env.example` to `backend/.env` and configure MongoDB
3. Frontend: Copy `frontend/.env.example` to `frontend/.env` (optional)
4. Run: `cd backend && npm run dev` (Terminal 1) and `cd frontend && npm run dev` (Terminal 2)
5. Access: http://localhost:5173

### Detailed Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NA-HackDynamos
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   
   Create a `.env` file in the `frontend/` directory (optional):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

4. **Run the Application**

   **Option 1: Run separately (Recommended for development)**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   **Option 2: Use root-level scripts (if available)**
   ```bash
   # From project root
   npm run dev:backend    # Starts backend
   npm run dev:frontend   # Starts frontend
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

## 📁 Project Structure

```
NA-HackDynamos/
├── backend/
│   ├── config/          # Configuration files (DB, constants)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, rate limiting
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── scripts/         # Utility scripts
│   ├── utils/           # Helper utilities
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service layer
│   │   └── utils/      # Frontend utilities
│   └── package.json
│
└── README.md
```

## 🎯 Features

### Implemented Features
- ✅ User authentication (Register, Login, Logout)
- ✅ JWT-based authentication with refresh tokens
- ✅ User profile management
- ✅ Daily nutrition summary
- ✅ Meal logging (structure ready)
- ✅ Nutrition insights
- ✅ Reminders system
- ✅ Tips and recommendations
- ✅ Goals management
- ✅ Food search
- ✅ Meal plans
- ✅ Protected routes
- ✅ Responsive UI with TailwindCSS

### API Endpoints

#### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/refresh` - Refresh access token
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile

#### Nutrition Tracking
- `GET /api/v1/logs/daily-summary` - Get daily nutrition summary
- `GET /api/v1/logs/insights` - Get personalized insights
- `GET /api/v1/logs/reminders` - Get reminders
- `POST /api/v1/logs` - Create meal log
- `GET /api/v1/logs` - List meal logs
- `POST /api/v1/logs/photo` - Upload meal photo

#### Goals & Plans
- `GET /api/v1/goals` - List nutrition goals
- `POST /api/v1/goals` - Create nutrition goal
- `GET /api/v1/goals/active` - Get active goal
- `GET /api/v1/meal-plans` - List meal plans

#### Content
- `GET /api/v1/tips` - Get nutrition tips
- `GET /api/v1/foods` - Search foods

## 🛠️ Available Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test-apis    # Test all API endpoints (Node.js)
npm run test-apis-curl # Test all API endpoints (PowerShell/curl)
npm run check-ip     # Get your IP for MongoDB Atlas whitelisting
npm run seed         # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database user
4. Whitelist your IP address (use `npm run check-ip` in backend)
5. Get your connection string and add to `.env`

### Environment Variables

**Backend (.env)**
- `MONGO_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

**Frontend (.env)**
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api/v1)

## 📋 Project Status

**Overall Completion**: ~75%

- ✅ Backend: 95% Complete (all APIs working)
- ✅ Frontend Core: 80% Complete (auth, routing, basic pages)
- ⚠️ Frontend Features: 60% Complete (missing meal logging & goal management UI)

**See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed status and unfinished features.**

## ⚠️ Known Issues & Caveats

### Critical Issues
1. **MongoDB IP Whitelisting**: If you get connection errors, ensure your IP is whitelisted in MongoDB Atlas. Run `npm run check-ip` in the backend directory.

2. **Language Enum Mismatch**: The API expects lowercase language codes (`en`, `si`, `ta`) but the frontend displays uppercase. This is handled automatically, but be aware when manually setting language preferences.

3. **Route Order**: Specialized routes (`/daily-summary`, `/insights`, `/reminders`) must come before parameterized routes (`/:id`) in `logRoutes.js` to avoid route conflicts.

### Unfinished/Incomplete Features

1. **Meal Logging UI**: 
   - Backend API is fully functional
   - Frontend UI for creating/editing meal logs is not implemented
   - Food selection and quantity input needed

2. **Image Upload**:
   - Backend endpoint exists (`/api/v1/logs/photo`)
   - Frontend upload component exists but needs integration
   - Cloudinary integration is optional (falls back to backend)

3. **Goal Creation UI**:
   - Backend fully supports goal creation
   - Frontend form for creating/editing goals is not implemented

4. **Meal Plan Display**:
   - API returns meal plans
   - Frontend display component needs implementation

5. **Food Database**:
   - Search functionality works
   - Food details display needs enhancement
   - Food selection for meal logging not implemented

6. **Error Handling**:
   - Basic error handling implemented
   - More user-friendly error messages needed
   - Network error handling could be improved

7. **Loading States**:
   - Some components have loading states
   - Not all API calls show loading indicators

8. **Form Validation**:
   - Basic validation exists
   - More comprehensive client-side validation needed

### Code Quality Issues

1. **Linting Errors**: Some files have ESLint warnings (console.log statements, unused variables). These are mostly in scripts and can be ignored for now.

2. **TypeScript**: Project uses JavaScript. Consider migrating to TypeScript for better type safety.

3. **Testing**: No unit or integration tests implemented. Test scripts exist but test files are missing.

4. **Documentation**: API documentation (Swagger/OpenAPI) not implemented.

### Performance Considerations

1. **Image Processing**: Photo upload uses async processing. Results may not be immediately available.

2. **Database Queries**: Some endpoints could benefit from pagination (currently returns all results).

3. **Caching**: No caching layer implemented. Consider Redis for production.

### Security Notes

1. **JWT Secret**: Ensure `JWT_SECRET` is strong and unique in production.

2. **Password Reset**: Password reset functionality exists but email service is not integrated (logs token to console in development).

3. **Rate Limiting**: Basic rate limiting implemented but may need tuning.

4. **Input Validation**: Server-side validation exists but could be more comprehensive.

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check if port 5000 is already in use
- Verify `JWT_SECRET` is set

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check CORS settings in backend
- Verify network/firewall settings

### Authentication issues
- Check browser console for errors
- Verify tokens are being stored in localStorage
- Check JWT_SECRET matches between environments
- Clear localStorage and try again

### API errors
- Check backend logs for detailed error messages
- Verify request format matches API expectations
- Check authentication token is valid
- Run `npm run test-apis` to verify endpoints

## 📝 Development Notes

### Adding New Features

1. **New API Endpoint**:
   - Add route in `backend/routes/`
   - Create controller in `backend/controllers/`
   - Add validation rules
   - Update API documentation

2. **New Frontend Page**:
   - Create component in `frontend/src/pages/`
   - Add route in `frontend/src/App.jsx`
   - Add navigation link if needed

3. **New Service**:
   - Create service file in `backend/services/`
   - Export functions
   - Import in controller

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test your changes
5. Submit a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

Built for HackDynamos hackathon. Special thanks to all contributors.

---

**Last Updated**: November 2025
**Status**: Functional but some features incomplete (see Known Issues section)

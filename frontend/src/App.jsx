import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import Home from './pages/Home';
import Tips from './pages/Tips';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MealLogs from './pages/MealLogs';
import Goals from './pages/Goals';
import MealPlans from './pages/MealPlans';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminFoods from './pages/Admin/AdminFoods';
import AdminGoals from './pages/Admin/AdminGoals';
import AdminTips from './pages/Admin/AdminTips';
import AdminMealLogs from './pages/Admin/AdminMealLogs';
import AdminMealPlans from './pages/Admin/AdminMealPlans';
import AdminNutritionGoals from './pages/Admin/AdminNutritionGoals';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <AdminProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                  <Navbar />
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/tips" element={
                <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                  <Navbar />
                  <main className="flex-grow">
                    <Tips />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/about" element={
                <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                  <Navbar />
                  <main className="flex-grow">
                    <About />
                  </main>
                  <Footer />
                </div>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Navbar />
                    <main className="flex-grow">
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/profile"
                element={
                  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Navbar />
                    <main className="flex-grow">
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/meal-logs"
                element={
                  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Navbar />
                    <main className="flex-grow">
                      <ProtectedRoute>
                        <MealLogs />
                      </ProtectedRoute>
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/goals"
                element={
                  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Navbar />
                    <main className="flex-grow">
                      <ProtectedRoute>
                        <Goals />
                      </ProtectedRoute>
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/meal-plans"
                element={
                  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Navbar />
                    <main className="flex-grow">
                      <ProtectedRoute>
                        <MealPlans />
                      </ProtectedRoute>
                    </main>
                    <Footer />
                  </div>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/foods"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminFoods />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/goals"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminGoals />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/tips"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminTips />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/meal-logs"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminMealLogs />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/meal-plans"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminMealPlans />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/nutrition-goals"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminNutritionGoals />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
          </Routes>
        </Router>
        </AdminProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


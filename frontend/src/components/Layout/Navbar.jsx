import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 shadow-lg border-b-2 border-primary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center space-x-4 md:space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/GovResolve (1).png" 
                alt="Nutrition Advisor Logo" 
                className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 rounded-lg"
              />
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Nutrition Advisor
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                to="/tips" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
              >
                Tips
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
              >
                About Us
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/meal-logs"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
                  >
                    Meal Logs
                  </Link>
                  <Link
                    to="/goals"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
                  >
                    Goals
                  </Link>
                  <Link
                    to="/meal-plans"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200"
                  >
                    Meal Plans
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-lg text-primary-700 hover:text-primary-800 hover:bg-primary-100 font-medium transition-all duration-200 border border-primary-200"
                >
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-lg text-primary-700 hover:text-primary-800 hover:bg-primary-50 font-medium transition-all duration-200 border border-primary-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


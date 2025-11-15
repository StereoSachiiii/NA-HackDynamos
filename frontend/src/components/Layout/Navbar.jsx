import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 shadow-lg border-b-2 border-primary-300 transition-colors duration-200">
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
                {t('navbar.appName')}
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 flex-nowrap">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200 whitespace-nowrap"
              >
                {t('navbar.home')}
              </Link>
              <Link 
                to="/tips" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200 whitespace-nowrap"
              >
                {t('navbar.tips')}
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200 whitespace-nowrap"
              >
                {t('navbar.about')}
              </Link>
              {user && (
                <>
                  <Link
                    to="/meal-logs"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200 whitespace-nowrap"
                  >
                    {t('navbar.mealLogs')}
                  </Link>
                  <Link
                    to="/goals"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200 whitespace-nowrap"
                  >
                    {t('navbar.goals')}
                  </Link>
                  <Link
                    to="/meal-plans"
                    className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-200 font-medium transition-all duration-200 whitespace-nowrap"
                  >
                    {t('navbar.mealPlans')}
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 cursor-pointer appearance-none pr-8"
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="si">SI</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
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
                  {t('navbar.logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-lg text-primary-700 hover:text-primary-800 hover:bg-primary-50 font-medium transition-all duration-200 border border-primary-300"
                >
                  {t('navbar.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('navbar.register')}
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


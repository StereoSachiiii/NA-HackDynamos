import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FoodSearch from '../components/Food/FoodSearch';
import BackgroundSlider from '../components/Layout/BackgroundSlider';

const Home = () => {
  const { user } = useAuth();

  // Background slider images - you can replace these with your own images
  // Place images in public/images/slider/ folder and reference them as /images/slider/image1.jpg
  const sliderImages = [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80',
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1920&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=80',
  ];

  return (
    <BackgroundSlider images={sliderImages} interval={5000}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 min-h-[600px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Your Personal Nutrition Advisor
              </h1>
              <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
                Track your meals, monitor your nutrition goals, and make informed dietary choices
                with our comprehensive nutrition management platform.
              </p>
              {!user && (
                <div className="flex justify-center space-x-4">
                  <Link to="/register" className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-3 bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-600">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Food Search Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Search Foods
              </h2>
              <FoodSearch />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 text-center border border-gray-200">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Track Nutrition</h3>
                  <p className="text-gray-600">
                    Log your meals and monitor your daily nutritional intake with detailed analytics.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 text-center border border-gray-200">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">Set Goals</h3>
                  <p className="text-gray-600">
                    Create personalized nutrition goals and track your progress over time.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 text-center border border-gray-200">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
                  <p className="text-gray-600">
                    Receive personalized tips and insights based on your eating patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BackgroundSlider>
  );
};

export default Home;


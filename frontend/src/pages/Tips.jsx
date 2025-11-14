import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TipCard from '../components/Tips/TipCard';
import { useAuth } from '../context/AuthContext';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTips = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/tips', {
          params: { isActive: true },
        });
        setTips(response.data.data || []);
      } catch (err) {
        setError('Failed to load tips');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [user]);

  // Professional nutrition background image
  const backgroundImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80';

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-800/70 to-blue-900/80"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Please sign in to view tips
            </h2>
            <p className="text-gray-600 mb-6">
              Tips are personalized based on your nutrition goals and activity.
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-800/70 to-blue-900/80"></div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-teal-800/70 to-blue-900/80"></div>
        <div className="relative z-10 text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-red-200">
            <p className="text-red-600 text-xl font-semibold">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-blue-900/85"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block mb-4">
            <span className="text-6xl">🥗</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Nutrition Tips
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto drop-shadow-lg">
            Expert advice to help you achieve your health and wellness goals
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              All Tips
            </button>
            <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Popular
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Recent
            </button>
          </div>
        </div>

        {/* Tips Grid */}
        {tips.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-emerald-200">
              <p className="text-gray-600 text-lg">No tips available at the moment.</p>
              <p className="text-gray-500 mt-2">Check back later for new nutrition tips!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tips;


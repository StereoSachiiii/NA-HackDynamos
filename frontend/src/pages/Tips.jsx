import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TipCard from '../components/Tips/TipCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [personalizedTips, setPersonalizedTips] = useState([]);
  const [generalTips, setGeneralTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'personalized', 'general', 'popular'
  const { user } = useAuth();
  const { t } = useLanguage();

  const updateTipsByFilter = useCallback((data, currentFilter) => {
    switch (currentFilter) {
      case 'personalized':
        setTips(data.personalized || []);
        break;
      case 'general':
        setTips(data.general || []);
        break;
      case 'popular':
        // Show personalized first, then general (popular = personalized + general sorted)
        const all = [...(data.personalized || []), ...(data.general || [])];
        setTips(all);
        break;
      case 'all':
      default:
        setTips(data.all || []);
        break;
    }
  }, []);

  useEffect(() => {
    const fetchTips = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch personalized tips
        const personalizedResponse = await api.get('/tips/personalized');
        const personalizedData = personalizedResponse.data.data || {};
        
        setPersonalizedTips(personalizedData.personalized || []);
        setGeneralTips(personalizedData.general || []);
        
        // Set default tips based on filter
        updateTipsByFilter(personalizedData, filter);
      } catch (err) {
        // Fallback to regular tips endpoint if personalized fails
        try {
          const response = await api.get('/tips', {
            params: { isActive: true },
          });
          const allTips = response.data.data || [];
          setTips(allTips);
          setPersonalizedTips([]);
          setGeneralTips(allTips);
        } catch (fallbackErr) {
          setError(t('tips.failedToLoad'));
          console.error(fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [user]);

  useEffect(() => {
    if (personalizedTips.length > 0 || generalTips.length > 0) {
      const data = {
        personalized: personalizedTips,
        general: generalTips,
        all: [...personalizedTips, ...generalTips]
      };
      updateTipsByFilter(data, filter);
    }
  }, [filter, personalizedTips, generalTips, updateTipsByFilter]);

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
              {t('tips.signInToView')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('tips.signInDescription')}
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('tips.signInNow')}
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
              {t('tips.retry')}
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
            {t('tips.title')}
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto drop-shadow-lg">
            {t('tips.subtitle')}
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
              }`}
            >
              {t('tips.allTips')}
            </button>
            {personalizedTips.length > 0 && (
              <button 
                onClick={() => setFilter('personalized')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  filter === 'personalized' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white' 
                    : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
                }`}
              >
                {t('tips.personalized')} ({personalizedTips.length})
              </button>
            )}
            <button 
              onClick={() => setFilter('popular')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                filter === 'popular' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
              }`}
            >
              {t('tips.popular')}
            </button>
            <button 
              onClick={() => setFilter('general')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                filter === 'general' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' 
                  : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
              }`}
            >
              {t('tips.general')}
            </button>
          </div>
        </div>

        {/* Tips Grid */}
        {tips.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-emerald-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 text-lg">{t('tips.noTips')}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{t('tips.checkBackLater')}</p>
              {filter === 'personalized' && personalizedTips.length === 0 && (
                <p className="text-emerald-600 dark:text-emerald-400 mt-4 text-sm">
                  {t('tips.createGoalForTips')}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {filter === 'personalized' && personalizedTips.length > 0 && (
              <div className="mb-6 text-center">
                <p className="text-emerald-100 dark:text-emerald-300 text-lg">
                  ✨ {personalizedTips.length} {personalizedTips.length !== 1 ? t('tips.personalizedCountPlural') : t('tips.personalizedCount')} {t('tips.basedOnGoals')}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {tips.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tips;


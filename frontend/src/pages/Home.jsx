import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  // Professional nutrition/health background image
  const backgroundImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80';

  const features = [
    {
      icon: '🍎',
      title: t('home.feature1Title'),
      description: t('home.feature1Desc')
    },
    {
      icon: '📊',
      title: t('home.feature2Title'),
      description: t('home.feature2Desc')
    },
    {
      icon: '🎯',
      title: t('home.feature3Title'),
      description: t('home.feature3Desc')
    },
    {
      icon: '💡',
      title: t('home.feature4Title'),
      description: t('home.feature4Desc')
    }
  ];

  return (
    <div 
      className="min-h-screen relative"
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
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="text-8xl">🥗</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto mb-8 drop-shadow-lg">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.getStarted')}
              </Link>
              <Link 
                to="/login" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.signIn')}
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
            {t('home.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-emerald-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-emerald-200/50 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              {t('home.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.startJourney')}
              </Link>
              <Link 
                to="/about" 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

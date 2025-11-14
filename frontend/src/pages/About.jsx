import { Link } from 'react-router-dom';

const About = () => {
  // Professional nutrition/health background image
  const backgroundImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1920&q=80';

  const features = [
    {
      icon: '🍎',
      title: 'Comprehensive Food Database',
      description: 'Detailed nutritional information for thousands of foods'
    },
    {
      icon: '📊',
      title: 'Personalized Tracking',
      description: 'Meal logging and tracking tailored to your goals'
    },
    {
      icon: '🎯',
      title: 'Goal Setting',
      description: 'Set and monitor your health and wellness objectives'
    },
    {
      icon: '💡',
      title: 'Smart Insights',
      description: 'Get tips and insights based on your eating patterns'
    },
    {
      icon: '🩺',
      title: 'Glycemic Load Tracking',
      description: 'Better blood sugar management with advanced metrics'
    },
    {
      icon: '📱',
      title: 'User-Friendly Interface',
      description: 'Easy-to-use platform that makes nutrition tracking simple'
    }
  ];

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
        <div className="text-center mb-16 pt-8">
          <div className="inline-block mb-6">
            <span className="text-7xl">🥗</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            About Nutrition Advisor
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto drop-shadow-lg mb-8">
            Empowering you to make informed dietary choices and achieve your health and wellness goals
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link 
              to="/tips" 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View Tips
            </Link>
            <Link 
              to="/" 
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-emerald-200/50">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🎯</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              Nutrition Advisor is dedicated to helping individuals make informed dietary choices
              and achieve their health and wellness goals through comprehensive nutrition tracking
              and personalized guidance. We believe that everyone deserves access to tools that
              make healthy eating simple, enjoyable, and sustainable.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-emerald-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
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

        {/* Approach Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-emerald-200">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">💚</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Approach</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-8">
              We believe in providing evidence-based nutrition information and tools that empower
              users to take control of their dietary health. Our platform combines scientific
              data with user-friendly interfaces to make nutrition tracking accessible and
              meaningful for everyone, regardless of their health knowledge or experience.
            </p>
            <div className="flex justify-center gap-4 flex-wrap mt-8">
              <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Science-Based
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                User-Friendly
              </button>
              <button className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Accessible
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-emerald-200/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are taking control of their nutrition and achieving their health goals.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sign Up Free
              </Link>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;


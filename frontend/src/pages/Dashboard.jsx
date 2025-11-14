import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { uploadImage } from '../services/imageUpload';

const Dashboard = () => {
  const { user } = useAuth();
  const [dailySummary, setDailySummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, insightsRes, remindersRes] = await Promise.all([
          api.get('/logs/daily-summary'),
          api.get('/logs/insights'),
          api.get('/logs/reminders'),
        ]);
        // API returns { success, date, summary: { totals, macroPercentages } }
        const summary = summaryRes.data.summary || {};
        const totals = summary.totals || {};
        setDailySummary({
          totalCalories: totals.calories || 0,
          totalProtein: totals.protein || 0,
          totalCarbs: totals.carbs || 0,
          totalFat: totals.fat || 0,
        });
        setInsights(insightsRes.data.data || []);
        setReminders(remindersRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set defaults on error
        setDailySummary({
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
        });
        setInsights([]);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file);
      if (result.success) {
        alert('Image uploaded successfully! Processing meal detection...');
        // Refresh dashboard to show updated data
        window.location.reload();
      }
    } catch (error) {
      alert('Failed to upload image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better readability - consistent with other pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-blue-900/85"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-emerald-100 drop-shadow-md">Track your nutrition journey today</p>
        </div>

        {/* Image Upload Card */}
        <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Meal Photo</h2>
          </div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary-500 file:to-primary-600 file:text-white hover:file:from-primary-600 hover:file:to-primary-700 file:transition-all file:shadow-lg file:cursor-pointer disabled:opacity-50"
            />
            {uploading && (
              <div className="mt-3 flex items-center text-primary-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-200 border-t-primary-600 mr-2"></div>
                <p className="text-sm font-medium">Uploading and processing...</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Summary Cards */}
        {dailySummary && (
          <div className="mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Today's Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Calories Card */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/90 text-sm font-medium mb-1">Calories</p>
                <p className="text-4xl font-bold text-white">{dailySummary.totalCalories || 0}</p>
                <p className="text-white/70 text-xs mt-2">kcal consumed</p>
              </div>

              {/* Protein Card */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/90 text-sm font-medium mb-1">Protein</p>
                <p className="text-4xl font-bold text-white">{dailySummary.totalProtein || 0}<span className="text-2xl">g</span></p>
                <p className="text-white/70 text-xs mt-2">muscle building</p>
              </div>

              {/* Carbs Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/90 text-sm font-medium mb-1">Carbs</p>
                <p className="text-4xl font-bold text-white">{dailySummary.totalCarbs || 0}<span className="text-2xl">g</span></p>
                <p className="text-white/70 text-xs mt-2">energy source</p>
              </div>

              {/* Fat Card */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/90 text-sm font-medium mb-1">Fat</p>
                <p className="text-4xl font-bold text-white">{dailySummary.totalFat || 0}<span className="text-2xl">g</span></p>
                <p className="text-white/70 text-xs mt-2">essential nutrients</p>
              </div>
            </div>
          </div>
        )}

        {/* Insights Section */}
        {insights.length > 0 && (
          <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Insights</h2>
            </div>
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl border-l-4 border-primary-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-gray-800 font-medium leading-relaxed">{insight.message || insight.text || 'Nutrition insight'}</p>
                  {insight.type && (
                    <span className="inline-block mt-3 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full shadow-sm">
                      {insight.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminders Section */}
        {reminders.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Reminders</h2>
            </div>
            <div className="space-y-4">
              {reminders.map((reminder, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-800 font-medium leading-relaxed">{reminder.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


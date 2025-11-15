import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { uploadImage } from '../services/imageUpload';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeGoal, setActiveGoal] = useState(null);
  const [timeRange, setTimeRange] = useState('today'); // 'today', 'week', 'month'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch today's summary
        const summaryRes = await api.get('/logs/daily-summary');
        const summary = summaryRes.data.summary || {};
        const totals = summary.totals || {};
        setDailySummary({
          totalCalories: totals.calories || 0,
          totalProtein: totals.protein || 0,
          totalCarbs: totals.carbs || 0,
          totalFat: totals.fat || 0,
          macroPercentages: summary.macroPercentages || {}
        });

        // Fetch weekly data
        const weeklyPromises = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          weeklyPromises.push(
            api.get('/logs/daily-summary', { params: { date: date.toISOString() } })
              .then(res => ({
                date: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                calories: res.data.summary?.totals?.calories || 0,
                protein: res.data.summary?.totals?.protein || 0,
                carbs: res.data.summary?.totals?.carbs || 0,
                fat: res.data.summary?.totals?.fat || 0
              }))
              .catch(() => ({
                date: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                calories: 0, protein: 0, carbs: 0, fat: 0
              }))
          );
        }
        const weeklyResults = await Promise.all(weeklyPromises);
        setWeeklyData(weeklyResults);

        // Fetch insights and reminders
        const [insightsRes, remindersRes, goalRes] = await Promise.all([
          api.get('/logs/insights'),
          api.get('/logs/reminders'),
          api.get('/goals/active').catch(() => ({ data: { data: null } }))
        ]);
        
        setInsights(insightsRes.data.data || []);
        setReminders(remindersRes.data.data || []);
        setActiveGoal(goalRes.data.data || null);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDailySummary({
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          macroPercentages: {}
        });
        setWeeklyData([]);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate weekly averages
  const weeklyAvg = weeklyData.length > 0 ? {
    calories: Math.round(weeklyData.reduce((sum, d) => sum + d.calories, 0) / weeklyData.length),
    protein: Math.round(weeklyData.reduce((sum, d) => sum + d.protein, 0) / weeklyData.length),
    carbs: Math.round(weeklyData.reduce((sum, d) => sum + d.carbs, 0) / weeklyData.length),
    fat: Math.round(weeklyData.reduce((sum, d) => sum + d.fat, 0) / weeklyData.length)
  } : null;

  // Find max calories for chart scaling
  const maxCalories = Math.max(...weeklyData.map(d => d.calories), activeGoal?.targetCalories || 2000, 1);

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('dashboard.title')}, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/meal-logs"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {t('dashboard.viewAllLogs')}
            </Link>
            <Link
              to="/goals"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {t('dashboard.manageGoals')}
            </Link>
          </div>
        </div>

        {/* Image Upload */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.uploadMealPhoto')}</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          {uploading && <p className="mt-2 text-gray-600">Uploading...</p>}
        </div>

        {/* Active Goal Banner */}
        {activeGoal && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 mb-8 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">{t('dashboard.activeGoal')}: {activeGoal.goalType}</h3>
                {activeGoal.targetCalories && (
                  <p className="text-emerald-100">
                    {t('dashboard.target')}: {activeGoal.targetCalories} kcal/day
                    {dailySummary && (
                      <span className="ml-2">
                        ({Math.round((dailySummary.totalCalories / activeGoal.targetCalories) * 100)}% today)
                      </span>
                    )}
                  </p>
                )}
              </div>
              <Link
                to="/goals"
                className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                {t('dashboard.viewGoal')}
              </Link>
            </div>
          </div>
        )}

        {/* Daily Summary */}
        {dailySummary && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('dashboard.todaySummary')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Calories</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {dailySummary.totalCalories || 0}
                </p>
                {activeGoal?.targetCalories && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${Math.min((dailySummary.totalCalories / activeGoal.targetCalories) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Protein</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(dailySummary.totalProtein || 0)}g
                </p>
                {dailySummary.macroPercentages?.protein && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {dailySummary.macroPercentages.protein.toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Carbs</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(dailySummary.totalCarbs || 0)}g
                </p>
                {dailySummary.macroPercentages?.carbs && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {dailySummary.macroPercentages.carbs.toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Fat</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(dailySummary.totalFat || 0)}g
                </p>
                {dailySummary.macroPercentages?.fat && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {dailySummary.macroPercentages.fat.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Weekly Chart */}
        {weeklyData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('dashboard.weeklyOverview')}</h2>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Calories per Day</span>
                {weeklyAvg && (
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Avg: {weeklyAvg.calories} kcal/day
                  </span>
                )}
              </div>
              <div className="flex items-end gap-2 h-48">
                {weeklyData.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-t">
                      <div
                        className={`absolute bottom-0 w-full rounded-t transition-all ${
                          day.calories > 0 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{ height: `${(day.calories / maxCalories) * 100}%` }}
                        title={`${day.calories} kcal`}
                      ></div>
                      {activeGoal?.targetCalories && (
                        <div
                          className="absolute w-full border-t-2 border-dashed border-blue-500 opacity-50"
                          style={{ bottom: `${(activeGoal.targetCalories / maxCalories) * 100}%` }}
                          title={`Target: ${activeGoal.targetCalories} kcal`}
                        ></div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                      <div className="font-medium">{day.day}</div>
                      <div className="text-xs">{day.calories}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {weeklyAvg && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Protein</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{weeklyAvg.protein}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Carbs</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{weeklyAvg.carbs}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Fat</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{weeklyAvg.fat}g</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {t('dashboard.insights')}
            </h2>
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                    <p className="text-gray-700 dark:text-gray-300">{insight.message || insight.text || 'Nutrition insight'}</p>
                    {insight.type && (
                      <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded">
                        {insight.type}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">{t('dashboard.noInsights')}</p>
            )}
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t('dashboard.reminders')}
            </h2>
            {reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.map((reminder, idx) => (
                  <div key={idx} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
                    <p className="text-gray-700 dark:text-gray-300">{reminder.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">{t('dashboard.noReminders')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


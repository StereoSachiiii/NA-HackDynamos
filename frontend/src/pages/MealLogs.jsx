import { useState, useEffect } from 'react';
import { mealLogService } from '../services/mealLogService';
import MealLogCard from '../components/MealLog/MealLogCard';
import MealLogForm from '../components/MealLog/MealLogForm';
import { useAuth } from '../context/AuthContext';

const MealLogs = () => {
  const { user } = useAuth();
  const [mealLogs, setMealLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [dateFilter, setDateFilter] = useState('');

  // Professional nutrition background image
  const backgroundImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80';

  useEffect(() => {
    if (user) {
      fetchMealLogs();
    }
  }, [user, dateFilter]);

  const fetchMealLogs = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (dateFilter) {
        const date = new Date(dateFilter);
        filters.from = date.toISOString();
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        filters.to = endDate.toISOString();
      }
      const response = await mealLogService.getMealLogs(filters);
      setMealLogs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch meal logs:', error);
      setMealLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingLog(null);
    fetchMealLogs();
  };

  const handleEdit = (mealLog) => {
    setEditingLog(mealLog);
    setShowForm(true);
  };

  const handleDelete = (logId) => {
    setMealLogs(mealLogs.filter(log => log._id !== logId));
  };

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
              Please sign in to view meal logs
            </h2>
            <p className="text-gray-600">
              Track your meals and nutrition journey with personalized logging.
            </p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-blue-900/85"></div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
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
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-blue-900/85"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 pt-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    Meal Logging
                  </h1>
                  <p className="text-xl text-emerald-100 drop-shadow-md">
                    Track your nutrition journey with comprehensive meal logging
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingLog(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Meal Log
            </button>
          </div>

          {/* Date Filter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Filter by Date
              </label>
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input-field w-full sm:w-64 border-2 border-emerald-200 focus:border-emerald-500"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingLog ? 'Edit Meal Log' : 'Create New Meal Log'}
              </h2>
            </div>
            <MealLogForm
              mealLog={editingLog}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingLog(null);
              }}
            />
          </div>
        )}

        {/* Meal Logs Grid */}
        {mealLogs.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-white/20 animate-fadeIn">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-700 text-xl font-semibold mb-2">
              {dateFilter ? 'No meal logs found for this date.' : 'No meal logs yet.'}
            </p>
            <p className="text-gray-600 mb-6">
              {dateFilter ? 'Try selecting a different date.' : 'Start tracking your meals to see them here!'}
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your First Meal Log
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {mealLogs.map((log) => (
              <MealLogCard
                key={log._id}
                mealLog={log}
                onUpdate={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealLogs;


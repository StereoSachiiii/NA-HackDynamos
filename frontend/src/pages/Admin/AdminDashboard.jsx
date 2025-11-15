import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>{error}</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Users', value: stats?.users || 0, icon: '👥', color: 'blue' },
    { label: 'Foods', value: stats?.foods || 0, icon: '🍎', color: 'green' },
    { label: 'Goals', value: stats?.goals || 0, icon: '🎯', color: 'purple' },
    { label: 'Tips', value: stats?.tips || 0, icon: '💡', color: 'yellow' },
    { label: 'Meal Logs', value: stats?.mealLogs || 0, icon: '📝', color: 'orange' },
    { label: 'Meal Plans', value: stats?.mealPlans || 0, icon: '🍽️', color: 'pink' },
    { label: 'Nutrition Goals', value: stats?.nutritionGoals || 0, icon: '📈', color: 'indigo' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;


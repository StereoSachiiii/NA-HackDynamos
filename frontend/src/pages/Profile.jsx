import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    themeMode: 'system',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        themeMode: user.themeMode || 'system',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.user);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700">
          {message && (
            <div className={`p-4 rounded-lg border ${
              message.includes('success') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
            }`}>
              {message}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="themeMode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Theme Mode
            </label>
            <select
              id="themeMode"
              name="themeMode"
              value={formData.themeMode}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose how the theme should be applied</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-red-200 dark:border-red-900/50">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-700 font-medium">
                Are you absolutely sure? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    setDeleting(true);
                    try {
                      await api.delete('/users/profile');
                      alert('Account deleted successfully');
                      navigate('/');
                      window.location.reload();
                    } catch (error) {
                      alert(error.response?.data?.message || 'Failed to delete account');
                      console.error(error);
                    } finally {
                      setDeleting(false);
                      setShowDeleteConfirm(false);
                    }
                  }}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors dark:text-gray-300"
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;


import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import GoalCard from '../components/Goal/GoalCard';
import GoalForm from '../components/Goal/GoalForm';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Goals = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [goals, setGoals] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    if (user) {
      fetchGoals();
      fetchActiveGoal();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await goalService.getGoals();
      setGoals(response.data || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveGoal = async () => {
    try {
      const response = await goalService.getActiveGoal();
      setActiveGoal(response.data);
    } catch (error) {
      // No active goal is fine
      setActiveGoal(null);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingGoal(null);
    fetchGoals();
    fetchActiveGoal();
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
    if (activeGoal?.id === goalId) {
      setActiveGoal(null);
    }
  };

  const handleActivate = () => {
    fetchGoals();
    fetchActiveGoal();
  };

  if (!user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-800/85 to-green-900/90"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            {t('goals.title')}
          </h2>
        </div>
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
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-teal-800/75 to-green-900/85"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                🎯 {t('goals.title')}
              </h1>
              <p className="text-xl text-emerald-100 drop-shadow-md">
                {t('goals.createFirst')}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingGoal(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('goals.createGoal')}
            </button>
          </div>
        </div>

        {/* Active Goal Section */}
        {activeGoal && (
          <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-emerald-400/50 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{t('goals.activeGoal')}</h2>
            </div>
            <GoalCard
              goal={activeGoal}
              onUpdate={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
            />
          </div>
        )}

        {/* Goal Form Section */}
        {showForm && (
          <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                {editingGoal ? t('common.edit') + ' ' + t('goals.title') : t('common.create') + ' ' + t('goals.title')}
              </h2>
            </div>
            <GoalForm
              goal={editingGoal}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingGoal(null);
              }}
            />
          </div>
        )}

        {/* Goals List Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                {t('goals.allGoals')}
              </h2>
              <p className="text-emerald-100 text-lg drop-shadow-md">
                {goals.length} {goals.length === 1 ? t('goals.title') : t('goals.allGoals')} {t('common.total') || 'total'}
              </p>
            </div>
            {goals.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-white/20 animate-fadeIn">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-xl font-medium mb-2">
                  {t('goals.noGoals')}
                </p>
                <p className="text-gray-600 mb-6">
                  {t('goals.createFirst')}
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {t('goals.createFirst')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={handleEdit}
                    onDelete={handleDelete}
                    onActivate={handleActivate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Goals;


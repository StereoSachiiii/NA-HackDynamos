import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminNutritionGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [users, setUsers] = useState([]);
  const [goalProfiles, setGoalProfiles] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    goalType: '',
    targetCalories: '',
    targetMacroSplit: { protein: 25, carbs: 50, fat: 25 },
    isActive: true
  });

  useEffect(() => {
    fetchGoals();
    fetchUsers();
    fetchGoalProfiles();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers({ limit: 100 });
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchGoalProfiles = async () => {
    try {
      const response = await adminService.getGoals({ limit: 100 });
      setGoalProfiles(response.data || []);
    } catch (err) {
      console.error('Failed to fetch goal profiles:', err);
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNutritionGoals({ page, limit: 20 });
      setGoals(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this nutrition goal?')) return;
    try {
      await adminService.deleteNutritionGoal(id);
      fetchGoals();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      user: goal.user?._id || goal.user || '',
      goalType: goal.goalType || '',
      targetCalories: goal.targetCalories || '',
      targetMacroSplit: goal.targetMacroSplit || { protein: 25, carbs: 50, fat: 25 },
      isActive: goal.isActive !== undefined ? goal.isActive : true
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setFormData({
      user: '',
      goalType: '',
      targetCalories: '',
      targetMacroSplit: { protein: 25, carbs: 50, fat: 25 },
      isActive: true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user) {
      alert('Please select a user');
      return;
    }
    if (!formData.goalType) {
      alert('Please select a goal type');
      return;
    }
    
    try {
      const submitData = {
        user: formData.user,
        goalType: formData.goalType,
        targetCalories: formData.targetCalories ? parseInt(formData.targetCalories) : undefined,
        targetMacroSplit: formData.targetMacroSplit,
        isActive: formData.isActive
      };
      
      if (editingGoal) {
        await adminService.updateNutritionGoal(editingGoal._id, submitData);
      } else {
        await adminService.createNutritionGoal(submitData);
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save nutrition goal');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nutrition Goals Management</h1>
        <button
          onClick={handleCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          + Add Nutrition Goal
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Goal Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Target Calories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Macro Split</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {goals.map((goal) => (
              <tr key={goal._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{goal.user?.name || goal.user?.email || goal.user?._id || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{goal.goalType || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{goal.targetCalories || 0} kcal</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {goal.targetMacroSplit ? `P:${goal.targetMacroSplit.protein}% C:${goal.targetMacroSplit.carbs}% F:${goal.targetMacroSplit.fat}%` : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${goal.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    {goal.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(goal)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-2">Edit</button>
                  <button onClick={() => handleDelete(goal._id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{editingGoal ? 'Edit Nutrition Goal' : 'Create Nutrition Goal'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">User *</label>
                <select value={formData.user} onChange={(e) => setFormData({...formData, user: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Goal Type *</label>
                <select value={formData.goalType} onChange={(e) => setFormData({...formData, goalType: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                  <option value="">Select a goal type...</option>
                  {goalProfiles.map(profile => (
                    <option key={profile._id} value={profile.name}>{profile.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Target Calories</label>
                <input type="number" value={formData.targetCalories} onChange={(e) => setFormData({...formData, targetCalories: e.target.value})} min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Protein %</label>
                  <input type="number" value={formData.targetMacroSplit.protein} onChange={(e) => setFormData({...formData, targetMacroSplit: {...formData.targetMacroSplit, protein: parseInt(e.target.value) || 0}})} min="0" max="100" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Carbs %</label>
                  <input type="number" value={formData.targetMacroSplit.carbs} onChange={(e) => setFormData({...formData, targetMacroSplit: {...formData.targetMacroSplit, carbs: parseInt(e.target.value) || 0}})} min="0" max="100" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fat %</label>
                  <input type="number" value={formData.targetMacroSplit.fat} onChange={(e) => setFormData({...formData, targetMacroSplit: {...formData.targetMacroSplit, fat: parseInt(e.target.value) || 0}})} min="0" max="100" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNutritionGoals;


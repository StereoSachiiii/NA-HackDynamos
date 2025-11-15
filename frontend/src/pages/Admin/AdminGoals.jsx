import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    macroSplit: { protein: 25, carbs: 50, fat: 25 },
    calorieBand: { min: 1600, max: 2200 },
    cautionTags: '',
    seasonTag: ''
  });

  useEffect(() => {
    fetchGoals();
  }, [page]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await adminService.getGoals({ page, limit: 20 });
      setGoals(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await adminService.deleteGoal(id);
      fetchGoals();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name || '',
      macroSplit: goal.macroSplit || { protein: 25, carbs: 50, fat: 25 },
      calorieBand: goal.calorieBand || { min: 1600, max: 2200 },
      cautionTags: goal.cautionTags?.join(', ') || '',
      seasonTag: goal.seasonTag || ''
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      macroSplit: { protein: 25, carbs: 50, fat: 25 },
      calorieBand: { min: 1600, max: 2200 },
      cautionTags: '',
      seasonTag: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        cautionTags: formData.cautionTags ? formData.cautionTags.split(',').map(t => t.trim()).filter(t => t) : []
      };
      
      if (editingGoal) {
        await adminService.updateGoal(editingGoal._id, submitData);
      } else {
        await adminService.createGoal(submitData);
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save goal');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Goals Management</h1>
        <button
          onClick={handleCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          + Add Goal
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Calorie Band</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Macro Split</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Season</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Caution Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {goals.map((goal) => (
              <tr key={goal._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{goal.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {goal.calorieBand ? `${goal.calorieBand.min}-${goal.calorieBand.max}` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {goal.macroSplit ? `P:${goal.macroSplit.protein}% C:${goal.macroSplit.carbs}% F:${goal.macroSplit.fat}%` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{goal.seasonTag || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {goal.cautionTags?.length > 0 ? goal.cautionTags.join(', ') : '-'}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{editingGoal ? 'Edit Goal' : 'Create Goal'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Calorie Min</label>
                  <input type="number" value={formData.calorieBand.min} onChange={(e) => setFormData({...formData, calorieBand: {...formData.calorieBand, min: parseInt(e.target.value) || 0}})} min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Calorie Max</label>
                  <input type="number" value={formData.calorieBand.max} onChange={(e) => setFormData({...formData, calorieBand: {...formData.calorieBand, max: parseInt(e.target.value) || 0}})} min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Protein %</label>
                  <input type="number" value={formData.macroSplit.protein} onChange={(e) => setFormData({...formData, macroSplit: {...formData.macroSplit, protein: parseInt(e.target.value) || 0}})} min="0" max="100" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Carbs %</label>
                  <input type="number" value={formData.macroSplit.carbs} onChange={(e) => setFormData({...formData, macroSplit: {...formData.macroSplit, carbs: parseInt(e.target.value) || 0}})} min="0" max="100" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fat %</label>
                  <input type="number" value={formData.macroSplit.fat} onChange={(e) => setFormData({...formData, macroSplit: {...formData.macroSplit, fat: parseInt(e.target.value) || 0}})} min="0" max="100" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Season Tag</label>
                <input type="text" value={formData.seasonTag} onChange={(e) => setFormData({...formData, seasonTag: e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Caution Tags (comma-separated)</label>
                <input type="text" value={formData.cautionTags} onChange={(e) => setFormData({...formData, cautionTags: e.target.value})} placeholder="e.g., diabetes, high-blood-pressure" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
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

export default AdminGoals;


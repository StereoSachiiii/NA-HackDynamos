import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminMealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goalType: '',
    calorieTarget: '',
    macroSplit: { protein: 25, carbs: 50, fat: 25 },
    isPublished: true,
    days: []
  });

  useEffect(() => {
    fetchMealPlans();
  }, [page]);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMealPlans({ page, limit: 20 });
      setMealPlans(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal plan?')) return;
    try {
      await adminService.deleteMealPlan(id);
      fetchMealPlans();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      goalType: plan.goalType || '',
      calorieTarget: plan.calorieTarget || '',
      macroSplit: plan.macroSplit || { protein: 25, carbs: 50, fat: 25 },
      isPublished: plan.isPublished !== undefined ? plan.isPublished : true,
      days: plan.days || []
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      goalType: '',
      calorieTarget: '',
      macroSplit: { protein: 25, carbs: 50, fat: 25 },
      isPublished: true,
      days: []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        calorieTarget: formData.calorieTarget ? parseInt(formData.calorieTarget) : undefined
      };
      
      if (editingPlan) {
        await adminService.updateMealPlan(editingPlan._id, submitData);
      } else {
        await adminService.createMealPlan(submitData);
      }
      setShowModal(false);
      fetchMealPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save meal plan');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meal Plans Management</h1>
        <button
          onClick={handleCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          + Add Meal Plan
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Goal Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Calorie Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mealPlans.map((plan) => (
              <tr key={plan._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{plan.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {plan.description ? (plan.description.length > 40 ? plan.description.substring(0, 40) + '...' : plan.description) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{plan.goalType || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{plan.calorieTarget || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{plan.days?.length || 0} days</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${plan.isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    {plan.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(plan)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-2">Edit</button>
                  <button onClick={() => handleDelete(plan._id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{editingPlan ? 'Edit Meal Plan' : 'Create Meal Plan'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Goal Type *</label>
                  <input type="text" value={formData.goalType} onChange={(e) => setFormData({...formData, goalType: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Calorie Target</label>
                  <input type="number" value={formData.calorieTarget} onChange={(e) => setFormData({...formData, calorieTarget: e.target.value})} min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
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
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Published</span>
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

export default AdminMealPlans;


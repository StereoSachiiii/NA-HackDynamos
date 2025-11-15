import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    localName: '',
    category: '',
    servingSizeGrams: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    glycemicLoad: 0,
    culturalNotes: '',
    tags: ''
  });

  useEffect(() => {
    fetchFoods();
  }, [page, search]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await adminService.getFoods({ page, limit: 20, search });
      setFoods(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await adminService.deleteFood(id);
      fetchFoods();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name || '',
      localName: food.localName || '',
      category: food.category || '',
      servingSizeGrams: food.servingSizeGrams || 100,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      fiber: food.fiber || 0,
      glycemicLoad: food.glycemicLoad || 0,
      culturalNotes: food.culturalNotes || '',
      tags: food.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      localName: '',
      category: '',
      servingSizeGrams: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      glycemicLoad: 0,
      culturalNotes: '',
      tags: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };
      
      if (editingFood) {
        await adminService.updateFood(editingFood._id, submitData);
      } else {
        await adminService.createFood(submitData);
      }
      setShowModal(false);
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save food item');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Foods Management</h1>
        <button
          onClick={handleCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          + Add Food
        </button>
      </div>
      <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full max-w-md px-4 py-2 border rounded mb-4 dark:bg-gray-800 dark:text-white" />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Local Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Calories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Protein</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Carbs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">GL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {foods.map((food) => (
              <tr key={food._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{food.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.localName || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.category}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.calories || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.protein?.toFixed(1) || '0'}g</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.carbs?.toFixed(1) || '0'}g</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.fat?.toFixed(1) || '0'}g</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{food.glycemicLoad || 0}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(food)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-2">Edit</button>
                  <button onClick={() => handleDelete(food._id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{editingFood ? 'Edit Food' : 'Create Food'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Local Name</label>
                  <input type="text" value={formData.localName} onChange={(e) => setFormData({...formData, localName: e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category *</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Serving Size (g)</label>
                  <input type="number" value={formData.servingSizeGrams} onChange={(e) => setFormData({...formData, servingSizeGrams: parseFloat(e.target.value) || 100})} min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Calories *</label>
                  <input type="number" value={formData.calories} onChange={(e) => setFormData({...formData, calories: parseFloat(e.target.value) || 0})} required min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Protein (g)</label>
                  <input type="number" value={formData.protein} onChange={(e) => setFormData({...formData, protein: parseFloat(e.target.value) || 0})} min="0" step="0.1" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Carbs (g)</label>
                  <input type="number" value={formData.carbs} onChange={(e) => setFormData({...formData, carbs: parseFloat(e.target.value) || 0})} min="0" step="0.1" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fat (g)</label>
                  <input type="number" value={formData.fat} onChange={(e) => setFormData({...formData, fat: parseFloat(e.target.value) || 0})} min="0" step="0.1" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fiber (g)</label>
                  <input type="number" value={formData.fiber} onChange={(e) => setFormData({...formData, fiber: parseFloat(e.target.value) || 0})} min="0" step="0.1" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Glycemic Load *</label>
                  <input type="number" value={formData.glycemicLoad} onChange={(e) => setFormData({...formData, glycemicLoad: parseFloat(e.target.value) || 0})} required min="0" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="e.g., healthy, local, traditional" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cultural Notes</label>
                <textarea value={formData.culturalNotes} onChange={(e) => setFormData({...formData, culturalNotes: e.target.value})} rows="3" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
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

export default AdminFoods;


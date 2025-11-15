import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminMealLogs = () => {
  const [mealLogs, setMealLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    mealType: 'Breakfast',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    foodEntries: [],
    notes: ''
  });

  useEffect(() => {
    fetchMealLogs();
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers({ limit: 100 });
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchMealLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMealLogs({ page, limit: 20 });
      setMealLogs(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal log?')) return;
    try {
      await adminService.deleteMealLog(id);
      fetchMealLogs();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    const date = new Date(log.date);
    setFormData({
      user: log.user?._id || log.user || '',
      mealType: log.mealType || 'Breakfast',
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
      foodEntries: log.foodEntries || [],
      notes: log.notes || ''
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingLog(null);
    setFormData({
      user: '',
      mealType: 'Breakfast',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      foodEntries: [],
      notes: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user) {
      alert('Please select a user');
      return;
    }
    
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const submitData = {
        user: formData.user,
        mealType: formData.mealType,
        date: dateTime.toISOString(),
        foodEntries: formData.foodEntries || [],
        notes: formData.notes || undefined
      };
      
      if (editingLog) {
        await adminService.updateMealLog(editingLog._id, submitData);
      } else {
        await adminService.createMealLog(submitData);
      }
      setShowModal(false);
      fetchMealLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save meal log');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meal Logs Management</h1>
        <button
          onClick={handleCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          + Add Meal Log
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Meal Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Food Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Calories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Macros</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mealLogs.map((log) => (
              <tr key={log._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{log.user?.name || log.user?.email || log.user?._id || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(log.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.mealType}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.foodEntries?.length || 0} items</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.summaryCache?.calories?.toFixed(0) || 0} kcal</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {log.summaryCache ? `P:${log.summaryCache.protein?.toFixed(1) || 0}g C:${log.summaryCache.carbs?.toFixed(1) || 0}g F:${log.summaryCache.fat?.toFixed(1) || 0}g` : '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(log)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-2">Edit</button>
                  <button onClick={() => handleDelete(log._id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{editingLog ? 'Edit Meal Log' : 'Create Meal Log'}</h2>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Meal Type *</label>
                  <select value={formData.mealType} onChange={(e) => setFormData({...formData, mealType: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Supper">Supper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Time *</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                <p>Note: Food entries can be added later. This creates a basic meal log entry that can be edited to add food items.</p>
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

export default AdminMealLogs;


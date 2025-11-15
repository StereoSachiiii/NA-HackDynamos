import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    defaultMessage: '',
    triggerEvent: '',
    seasonTag: '',
    isActive: true,
    localizedMessages: []
  });

  useEffect(() => {
    fetchTips();
  }, [page]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTips({ page, limit: 20 });
      setTips(response.data);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tip?')) return;
    try {
      await adminService.deleteTip(id);
      fetchTips();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (tip) => {
    setEditingTip(tip);
    setFormData({
      key: tip.key || '',
      defaultMessage: tip.defaultMessage || '',
      triggerEvent: tip.triggerEvent || '',
      seasonTag: tip.seasonTag || '',
      isActive: tip.isActive !== undefined ? tip.isActive : true,
      localizedMessages: tip.localizedMessages || []
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingTip(null);
    setFormData({
      key: '',
      defaultMessage: '',
      triggerEvent: '',
      seasonTag: '',
      isActive: true,
      localizedMessages: []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTip) {
        await adminService.updateTip(editingTip._id, formData);
      } else {
        await adminService.createTip(formData);
      }
      setShowModal(false);
      fetchTips();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save tip');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tips Management</h1>
        <button
          onClick={handleCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          + Add Tip
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Trigger Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Season</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Languages</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tips.map((tip) => (
              <tr key={tip._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{tip.key}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {tip.defaultMessage ? (tip.defaultMessage.length > 50 ? tip.defaultMessage.substring(0, 50) + '...' : tip.defaultMessage) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{tip.triggerEvent || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{tip.seasonTag || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${tip.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    {tip.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {tip.localizedMessages?.length > 0 ? tip.localizedMessages.map(m => m.language).join(', ') : 'EN only'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(tip)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-2">Edit</button>
                  <button onClick={() => handleDelete(tip._id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{editingTip ? 'Edit Tip' : 'Create Tip'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Key *</label>
                <input type="text" value={formData.key} onChange={(e) => setFormData({...formData, key: e.target.value})} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Default Message (EN) *</label>
                <textarea value={formData.defaultMessage} onChange={(e) => setFormData({...formData, defaultMessage: e.target.value})} required rows="3" className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Trigger Event</label>
                  <input type="text" value={formData.triggerEvent} onChange={(e) => setFormData({...formData, triggerEvent: e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Season Tag</label>
                  <input type="text" value={formData.seasonTag} onChange={(e) => setFormData({...formData, seasonTag: e.target.value})} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
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

export default AdminTips;


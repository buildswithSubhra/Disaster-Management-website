import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FaTrash, FaBan, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers({ limit: 100, search });
      setUsers(res.data?.users || res.data || []);
    } catch {
      setUsers([{ id: '1', name: 'Admin User', email: 'admin@disaster.com', phone: '+91-9000000000', role: 'admin', status: 'active' }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async (id, status) => {
    const newStatus = status === 'active' ? 'suspended' : 'active';
    try { await adminService.updateUserStatus(id, newStatus); setUsers(p => p.map(u => (u.id === id || u._id === id) ? { ...u, status: newStatus } : u)); toast.success(`User ${newStatus}.`); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user?')) return;
    try { await adminService.deleteUser(id); setUsers(p => p.filter(u => u.id !== id && u._id !== id)); toast.success('Deleted.'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  if (loading) return <LoadingSpinner />;

  const filtered = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <motion.div variants={item}>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage all registered users</p>
      </motion.div>

      <motion.div variants={item}>
        <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field max-w-sm" />
      </motion.div>

      <motion.div variants={item} className="card overflow-x-auto p-0">
        <table className="w-full min-w-[480px]">
          <thead className="bg-gray-50/50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Name</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Role</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Status</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((u, i) => (
              <motion.tr
                key={u.id || u._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800"
              >
                <td className="px-3 sm:px-5 py-3.5"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{u.name}</p><p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p></td>
                <td className="px-3 sm:px-5 py-3.5"><span className="badge bg-navy-50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-400 capitalize">{u.role}</span></td>
                <td className="px-3 sm:px-5 py-3.5"><span className={`badge ${u.status === 'active' ? 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-400' : 'bg-danger-50 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'}`}>{u.status}</span></td>
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex gap-1">
                    <button onClick={() => handleToggle(u.id || u._id, u.status)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-warning-600 dark:hover:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/30 rounded-md transition-colors cursor-pointer" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                      {u.status === 'active' ? <FaBan className="h-3.5 w-3.5" /> : <FaCheckCircle className="h-3.5 w-3.5" />}
                    </button>
                    {u.role !== 'admin' && <button onClick={() => handleDelete(u.id || u._id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-md transition-colors cursor-pointer"><FaTrash className="h-3.5 w-3.5" /></button>}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default ManageUsers;

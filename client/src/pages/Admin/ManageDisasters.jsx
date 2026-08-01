import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaEye, FaUserPlus, FaTrash, FaPlus, FaMap } from 'react-icons/fa';
import { toast } from 'react-toastify';
import disasterService from '../../services/disasterService';
import rescuerService from '../../services/rescuerService';
import SeverityBadge from '../../components/SeverityBadge';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import MapView from '../../components/MapView';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const ManageDisasters = () => {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [rescuers, setRescuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [assignModal, setAssignModal] = useState({ open: false, disasterId: null });
  const [createModal, setCreateModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [newDisaster, setNewDisaster] = useState({ title: '', type: 'Flood', description: '', severity: 'Medium', address: '', peopleAffected: '', emergencyContact: '' });

  const fetchData = async () => {
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      if (severityFilter) params.severity = severityFilter;
      const [dRes, rRes] = await Promise.all([disasterService.getAllDisasters(params), rescuerService.getAllRescuers()]);
      setDisasters(dRes.data?.disasters || dRes.data || []);
      setTotalPages(dRes.data?.totalPages || 1);
      setRescuers(rRes.data?.rescuers || rRes.data || []);
    } catch {
      setDisasters([{ id: '1', title: 'Flood in Mumbai', type: 'Flood', severity: 'High', status: 'In Progress', createdAt: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, typeFilter, statusFilter, severityFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async () => {
    if (!newDisaster.title.trim()) return toast.error('Title is required');
    try {
      await disasterService.createDisaster({ ...newDisaster, peopleAffected: newDisaster.peopleAffected ? parseInt(newDisaster.peopleAffected) : undefined });
      toast.success('Disaster report created.');
      setCreateModal(false);
      setNewDisaster({ title: '', type: 'Flood', description: '', severity: 'Medium', address: '', peopleAffected: '', emergencyContact: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleAssign = async (rescuerId) => {
    try { await disasterService.assignRescuer(assignModal.disasterId, rescuerId); toast.success('Rescuer assigned!'); setAssignModal({ open: false, disasterId: null }); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try { await disasterService.deleteDisaster(id); toast.success('Deleted.'); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleExport = () => {
    const csv = [['Title', 'Type', 'Severity', 'Status', 'Date'], ...disasters.map(d => [d.title, d.type, d.severity, d.status, new Date(d.createdAt).toLocaleDateString()])].map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'disasters.csv'; a.click();
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Disaster Management</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage all disaster reports</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowMap(!showMap)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all cursor-pointer ${showMap ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <FaMap className="h-3.5 w-3.5" /> {showMap ? 'Hide Map' : 'Map View'}
          </motion.button>
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
          >Export CSV</motion.button>
          <motion.button
            onClick={() => setCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          ><FaPlus className="h-3.5 w-3.5" /> New report</motion.button>
        </div>
      </motion.div>

      <motion.div variants={item} className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchData()} className="input-field md:col-span-2" />
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="">All Types</option>
            {['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Building Collapse', 'Road Accident'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="">All Status</option>
            {['Pending', 'Assigned', 'In Progress', 'Rescued', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={severityFilter} onChange={e => { setSeverityFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="">All Severity</option>
            {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </motion.div>

      {showMap && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <MapView disasters={disasters} height="350px" />
        </motion.div>
      )}

      <motion.div variants={item} className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Title</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Type</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Severity</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Status</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Date</th>
                <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {disasters.map((d, i) => (
                <motion.tr
                  key={d.id || d._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-200">{d.title}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{d.type}</td>
                  <td className="px-5 py-3.5"><SeverityBadge severity={d.severity} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-gray-400 dark:text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/admin/disasters/${d.id || d._id}`)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-navy-800 dark:hover:text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-900/30 rounded-md transition-colors cursor-pointer"><FaEye className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setAssignModal({ open: true, disasterId: d.id || d._id })} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors cursor-pointer"><FaUserPlus className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(d.id || d._id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors cursor-pointer"><FaTrash className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">Next</button>
            </div>
          </div>
        )}
      </motion.div>

      <Modal isOpen={assignModal.open} onClose={() => setAssignModal({ open: false, disasterId: null })} title="Assign Rescuer">
        <div className="space-y-2">
          {rescuers.map(r => (
            <div key={r.id || r._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{r.availability} &middot; {r.skills?.join(', ')}</p>
              </div>
              <button onClick={() => handleAssign(r.id || r._id)} disabled={r.availability !== 'Available'} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-40 cursor-pointer">Assign</button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Disaster Report">
        <div className="space-y-4">
          <div><label className="form-label">Title *</label><input type="text" value={newDisaster.title} onChange={e => setNewDisaster(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Disaster title" /></div>
          <div><label className="form-label">Type</label><select value={newDisaster.type} onChange={e => setNewDisaster(p => ({ ...p, type: e.target.value }))} className="input-field">{['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Building Collapse', 'Road Accident'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label className="form-label">Severity</label><select value={newDisaster.severity} onChange={e => setNewDisaster(p => ({ ...p, severity: e.target.value }))} className="input-field">{['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="form-label">Description</label><textarea value={newDisaster.description} onChange={e => setNewDisaster(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows="3" placeholder="Details..." /></div>
          <div><label className="form-label">Address</label><input type="text" value={newDisaster.address} onChange={e => setNewDisaster(p => ({ ...p, address: e.target.value }))} className="input-field" placeholder="Location" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">People Affected</label><input type="number" value={newDisaster.peopleAffected} onChange={e => setNewDisaster(p => ({ ...p, peopleAffected: e.target.value }))} className="input-field" min="0" /></div>
            <div><label className="form-label">Emergency Contact</label><input type="tel" value={newDisaster.emergencyContact} onChange={e => setNewDisaster(p => ({ ...p, emergencyContact: e.target.value }))} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setCreateModal(false)} className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">Cancel</button>
            <button onClick={handleCreate} className="btn-primary cursor-pointer">Create Report</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ManageDisasters;

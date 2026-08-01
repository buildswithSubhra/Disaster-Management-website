import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import rescuerService from '../../services/rescuerService';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageRescuers = () => {
  const [rescuers, setRescuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ name: '', email: '', phone: '', skills: '', availability: 'Available' });

  const fetchData = async () => {
    try { const r = await rescuerService.getAllRescuers({ limit: 100 }); setRescuers(r.data?.rescuers || r.data || []); }
    catch { setRescuers([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm({ name: '', email: '', phone: '', skills: '', availability: 'Available' }); setModal({ open: true, mode: 'add', data: null }); };
  const openEdit = (r) => { setForm({ name: r.name, email: r.email, phone: r.phone, skills: r.skills?.join(', ') || '', availability: r.availability }); setModal({ open: true, mode: 'edit', data: r }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      if (modal.mode === 'add') await rescuerService.createRescuer(data);
      else await rescuerService.updateRescuer(modal.data.id || modal.data._id, data);
      toast.success(`Rescuer ${modal.mode === 'add' ? 'created' : 'updated'}!`);
      setModal({ open: false, mode: 'add', data: null }); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await rescuerService.deleteRescuer(id); toast.success('Deleted.'); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Rescuers</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage rescue personnel</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><FaPlus className="h-3.5 w-3.5" />Add</button>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[520px]">
          <thead className="bg-gray-50/50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Name</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Contact</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Skills</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Status</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {rescuers.map(r => (
              <tr key={r.id || r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800">
                <td className="px-3 sm:px-5 py-3.5"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.name}</p><p className="text-xs text-gray-400 dark:text-gray-500">{r.email}</p></td>
                <td className="px-3 sm:px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{r.phone}</td>
                <td className="px-3 sm:px-5 py-3.5"><div className="flex flex-wrap gap-1">{r.skills?.map(s => <span key={s} className="badge bg-navy-50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-400">{s}</span>)}</div></td>
                <td className="px-3 sm:px-5 py-3.5"><StatusBadge status={r.availability} /></td>
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-navy-800 dark:hover:text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-900/30 rounded-md transition-colors"><FaEdit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(r.id || r._id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-md transition-colors"><FaTrash className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, mode: 'add', data: null })} title={modal.mode === 'add' ? 'Add Rescuer' : 'Edit Rescuer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="form-label">Name</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" required /></div>
          <div><label className="form-label">Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" required disabled={modal.mode === 'edit'} /></div>
          <div><label className="form-label">Phone</label><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" /></div>
          <div><label className="form-label">Skills (comma separated)</label><input type="text" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} className="input-field" placeholder="Medical, Fire Fighting" /></div>
          <div><label className="form-label">Availability</label>
            <select value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))} className="input-field">{['Available', 'Busy', 'Offline'].map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2"><FaSave className="h-3.5 w-3.5" />{modal.mode === 'add' ? 'Create' : 'Update'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageRescuers;

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FaPlus, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import shelterService from '../../services/shelterService';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const ManageShelters = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ name: '', capacity: '', availableBeds: '', contact: '', address: '', lat: '', lng: '' });

  const fetchData = async () => {
    try { const r = await shelterService.getAllShelters({ limit: 100 }); setShelters(r.data?.shelters || r.data || []); }
    catch { setShelters([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm({ name: '', capacity: '', availableBeds: '', contact: '', address: '', lat: '', lng: '' }); setModal({ open: true, mode: 'add', data: null }); };
  const openEdit = (s) => { setForm({ name: s.name, capacity: s.capacity, availableBeds: s.availableBeds, contact: s.contact, address: s.location?.address || '', lat: s.location?.lat || '', lng: s.location?.lng || '' }); setModal({ open: true, mode: 'edit', data: s }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { name: form.name, capacity: parseInt(form.capacity), availableBeds: parseInt(form.availableBeds), contact: form.contact, location: { address: form.address, lat: parseFloat(form.lat) || 0, lng: parseFloat(form.lng) || 0 } };
      if (modal.mode === 'add') await shelterService.createShelter(data);
      else await shelterService.updateShelter(modal.data.id || modal.data._id, data);
      toast.success(`Shelter ${modal.mode === 'add' ? 'created' : 'updated'}!`);
      setModal({ open: false, mode: 'add', data: null }); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await shelterService.deleteShelter(id); toast.success('Deleted.'); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Shelters</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage emergency shelters</p></div>
        <motion.button
          onClick={openAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex items-center gap-2 text-sm cursor-pointer"
        ><FaPlus className="h-3.5 w-3.5" />Add</motion.button>
      </motion.div>

      <motion.div variants={item} className="card overflow-x-auto p-0">
        <table className="w-full min-w-[520px]">
          <thead className="bg-gray-50/50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Name</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Location</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Capacity</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Contact</th>
              <th className="px-3 sm:px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {shelters.map((s, i) => (
              <motion.tr
                key={s.id || s._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800"
              >
                <td className="px-3 sm:px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</td>
                <td className="px-3 sm:px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{s.location?.address || 'N/A'}</td>
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5"><div className="bg-success-500 h-1.5 rounded-full" style={{ width: `${(s.availableBeds / s.capacity) * 100}%` }}></div></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{s.availableBeds}/{s.capacity}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{s.contact}</td>
                <td className="px-3 sm:px-5 py-3.5">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-navy-800 dark:hover:text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-900/30 rounded-md transition-colors cursor-pointer"><FaEdit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(s.id || s._id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-md transition-colors cursor-pointer"><FaTrash className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, mode: 'add', data: null })} title={modal.mode === 'add' ? 'Add Shelter' : 'Edit Shelter'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="form-label">Name</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="form-label">Capacity</label><input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="input-field" required /></div>
            <div><label className="form-label">Available Beds</label><input type="number" value={form.availableBeds} onChange={e => setForm(p => ({ ...p, availableBeds: e.target.value }))} className="input-field" required /></div>
          </div>
          <div><label className="form-label">Address</label><input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="form-label">Latitude</label><input type="number" step="any" value={form.lat} onChange={e => setForm(p => ({ ...p, lat: e.target.value }))} className="input-field" /></div>
            <div><label className="form-label">Longitude</label><input type="number" step="any" value={form.lng} onChange={e => setForm(p => ({ ...p, lng: e.target.value }))} className="input-field" /></div>
          </div>
          <div><label className="form-label">Contact</label><input type="text" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} className="input-field" /></div>
          <button type="submit" className="btn-primary flex items-center gap-2 cursor-pointer"><FaSave className="h-3.5 w-3.5" />{modal.mode === 'add' ? 'Create' : 'Update'}</button>
        </form>
      </Modal>
    </motion.div>
  );
};

export default ManageShelters;

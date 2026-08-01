import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaEye, FaFilter, FaSearch } from 'react-icons/fa';
import disasterService from '../../services/disasterService';
import SeverityBadge from '../../components/SeverityBadge';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const MyReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await disasterService.getMyDisasters();
        setReports(res.data?.disasters || res.data || []);
      } catch {
        setReports([
          { id: '1', title: 'Flood in Downtown', type: 'Flood', severity: 'High', status: 'In Progress', createdAt: new Date().toISOString(), address: '123 Main St' },
          { id: '2', title: 'Building Fire', type: 'Fire', severity: 'Critical', status: 'Assigned', createdAt: new Date().toISOString(), address: '456 Oak Ave' },
          { id: '3', title: 'Minor Earthquake', type: 'Earthquake', severity: 'Low', status: 'Completed', createdAt: new Date().toISOString(), address: '789 Pine Rd' },
        ]);
      } finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === 'all' || r.status?.toLowerCase() === filter;
    const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || r.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <LoadingSpinner message="Loading your reports..." />;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Citizen Reports</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">My Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track the status of your disaster reports.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input type="text" placeholder="Search reports..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 dark:text-gray-500 h-4 w-4" />
            <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field">
              {['all', 'pending', 'assigned', 'in progress', 'rescued', 'completed'].map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Type</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Severity</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredReports.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No reports found</td></tr>
            ) : filteredReports.map((r, i) => (
              <motion.tr
                key={r.id || r._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.title}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{r.address}</p></td>
                <td className="px-6 py-4"><span className="text-sm capitalize text-gray-600 dark:text-gray-400">{r.type}</span></td>
                <td className="px-6 py-4"><SeverityBadge severity={r.severity} /></td>
                <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate(`/user/reports/${r.id || r._id}`)} className="p-2 text-navy-800 hover:bg-navy-50 rounded-lg transition-colors cursor-pointer">
                    <FaEye className="h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default MyReports;

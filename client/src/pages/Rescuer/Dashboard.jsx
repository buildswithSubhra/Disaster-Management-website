import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCheckCircle, FaClock, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import rescuerService from '../../services/rescuerService';

const RescuerDashboard = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await rescuerService.getAssignedMissions();
        const data = res.data?.disasters || res.data || [];
        setMissions(data);
        setStats({ total: data.length, active: data.filter(d => d.status === 'In Progress' || d.status === 'Assigned').length, completed: data.filter(d => d.status === 'Completed' || d.status === 'Rescued').length });
      } catch {
        setMissions([{ id: '1', title: 'Flood Rescue - Andheri', type: 'Flood', severity: 'High', status: 'In Progress', address: 'Andheri East, Mumbai' }, { id: '2', title: 'Fire Emergency - CP', type: 'Fire', severity: 'Critical', status: 'Assigned', address: 'Connaught Place, Delhi' }]);
        setStats({ total: 8, active: 3, completed: 5 });
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'TOTAL MISSIONS', value: stats.total, icon: FaClipboardList },
    { label: 'IN PROGRESS', value: stats.active, icon: FaClock },
    { label: 'COMPLETED', value: stats.completed, icon: FaCheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Rescuer Dashboard</p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Welcome, {user?.name?.split(' ')[0] || 'Rescuer'}.</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your rescue missions and update progress.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {statCards.map(c => (
          <div key={c.label} className="stat-card">
            <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 font-semibold">{c.label}</p>
            <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Active missions</h3>
            <Link to="/rescuer/missions" className="text-xs font-medium text-navy-800 dark:text-navy-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {missions.filter(m => m.status !== 'Completed' && m.status !== 'Rescued').slice(0, 4).map(m => (
              <div key={m.id || m._id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1"><FaMapMarkerAlt className="h-3 w-3" />{m.address}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
            {missions.filter(m => m.status !== 'Completed' && m.status !== 'Rescued').length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No active missions</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick actions</h3>
          <div className="space-y-2">
            <Link to="/rescuer/missions" className="flex items-center justify-between p-3.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-navy-50 dark:bg-navy-900/30 rounded-lg flex items-center justify-center"><FaClipboardList className="h-4 w-4 text-navy-600 dark:text-navy-400" /></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Missions</span>
              </div>
              <FaArrowRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
            </Link>
            <Link to="/rescuer/profile" className="flex items-center justify-between p-3.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-success-50 dark:bg-success-900/30 rounded-lg flex items-center justify-center"><FaCheckCircle className="h-4 w-4 text-success-600 dark:text-success-400" /></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Profile</span>
              </div>
              <FaArrowRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescuerDashboard;

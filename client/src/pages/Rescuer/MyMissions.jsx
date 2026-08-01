import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import rescuerService from '../../services/rescuerService';
import SeverityBadge from '../../components/SeverityBadge';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  const fetchMissions = async () => {
    try {
      const res = await rescuerService.getAssignedMissions();
      setMissions(res.data?.disasters || res.data || []);
    } catch {
      setMissions([
        { id: '1', title: 'Flood Rescue - Mumbai', type: 'Flood', severity: 'High', status: 'In Progress', address: 'Andheri East, Mumbai', latitude: 19.076, longitude: 72.877, peopleAffected: 100 },
        { id: '2', title: 'Fire Emergency - Delhi', type: 'Fire', severity: 'Critical', status: 'Assigned', address: 'Connaught Place, Delhi', latitude: 28.613, longitude: 77.209, peopleAffected: 50 },
        { id: '3', title: 'Earthquake Relief - Pune', type: 'Earthquake', severity: 'Medium', status: 'Completed', address: 'FC Road, Pune', latitude: 18.52, longitude: 73.856, peopleAffected: 200 },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMissions(); }, []);

  const statusFlow = ['Pending', 'Assigned', 'In Progress', 'Rescued', 'Completed'];

  const handleProgress = async (missionId, currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex >= statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIndex + 1];
    try {
      await rescuerService.updateMissionProgress(missionId, nextStatus);
      setMissions(prev => prev.map(m => (m.id === missionId || m._id === missionId) ? { ...m, status: nextStatus } : m));
      toast.success(`Mission updated to ${nextStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    }
  };

  const filtered = missions.filter(m => {
    if (tab === 'active') return m.status !== 'Completed' && m.status !== 'Rescued';
    return m.status === 'Completed' || m.status === 'Rescued';
  });

  if (loading) return <LoadingSpinner message="Loading missions..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Rescue Operations</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">My Missions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">View and manage your assigned rescue missions.</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['active', 'completed'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-navy-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 card p-12 text-center text-sm text-gray-400 dark:text-gray-500">No {tab} missions</div>
        ) : filtered.map(m => {
          const currentStep = statusFlow.indexOf(m.status);
          return (
            <div key={m.id || m._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{m.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{m.type} &middot; {m.address}</p>
                </div>
                <SeverityBadge severity={m.severity} />
              </div>
              {m.peopleAffected && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">People affected: {m.peopleAffected}</p>}
              <div className="flex items-center gap-2 mb-4">
                {statusFlow.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${i <= currentStep ? 'bg-navy-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>{i + 1}</div>
                    {i < statusFlow.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-navy-800' : 'bg-gray-100 dark:bg-gray-700'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={m.status} />
                {currentStep < statusFlow.length - 1 && (
                  <button onClick={() => handleProgress(m.id || m._id, m.status)} className="btn-primary text-xs flex items-center gap-1">
                    Update to {statusFlow[currentStep + 1]} <FaArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              {(m.latitude || m.longitude) && (
                <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                  <a href={`https://www.google.com/maps?q=${m.latitude},${m.longitude}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-navy-800 hover:underline flex items-center gap-1">
                    <FaMapMarkerAlt /> View on Map
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyMissions;

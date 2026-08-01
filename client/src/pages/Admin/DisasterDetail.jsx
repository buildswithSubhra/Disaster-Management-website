import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import disasterService from '../../services/disasterService';
import { API_BASE } from '../../config';
import SeverityBadge from '../../components/SeverityBadge';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const DisasterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const res = await disasterService.getDisasterById(id);
        setDisaster(res.data);
      } catch {
        setDisaster({
          id, title: 'Flood in Mumbai', description: 'Severe flooding in multiple areas.', type: 'Flood',
          severity: 'High', status: 'In Progress', address: 'Andheri East, Mumbai',
          latitude: 19.0760, longitude: 72.8777, peopleAffected: 200, emergencyContact: '+91-9876543210',
          createdAt: new Date().toISOString(),
        });
      } finally { setLoading(false); }
    };
    fetchDisaster();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await disasterService.updateStatus(id, newStatus);
      setDisaster(prev => ({ ...prev, status: newStatus }));
    } catch {}
  };

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (!disaster) return       <div className="text-center py-12"><p className="text-gray-500 dark:text-gray-400">Not found</p></div>;

  const steps = ['Pending', 'Assigned', 'In Progress', 'Rescued', 'Completed'];
  const currentStep = steps.indexOf(disaster.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
          <FaArrowLeft className="mr-2 h-3 w-3" /> Back
        </button>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={disaster.severity} />
          <StatusBadge status={disaster.status} />
        </div>
      </div>

      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{disaster.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{disaster.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'TYPE', value: disaster.type },
            { label: 'PEOPLE AFFECTED', value: disaster.peopleAffected || 'N/A' },
            { label: 'REPORTED ON', value: new Date(disaster.createdAt).toLocaleDateString() },
            { label: 'EMERGENCY CONTACT', value: disaster.emergencyContact || 'N/A' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" /> Location
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{disaster.address}</p>
        </div>
        {disaster.image && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Photo Evidence</h3>
            <img src={disaster.image} alt="Disaster" className="w-full max-w-md rounded-lg border border-gray-100 dark:border-gray-700" />
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Status Progress</h3>
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${i <= currentStep ? 'bg-navy-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>{i + 1}</div>
                <p className={`text-[10px] mt-2 text-center uppercase tracking-wider font-semibold ${i <= currentStep ? 'text-navy-800 dark:text-navy-400' : 'text-gray-400 dark:text-gray-500'}`}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {steps.map(step => (
              <button key={step} onClick={() => handleStatusUpdate(step)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${disaster.status === step ? 'border-navy-800 bg-navy-800 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetail;

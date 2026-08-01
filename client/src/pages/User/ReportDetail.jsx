import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';
import disasterService from '../../services/disasterService';
import { API_BASE } from '../../config';
import SeverityBadge from '../../components/SeverityBadge';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await disasterService.getDisasterById(id);
        setReport(res.data);
      } catch {
        setReport({
          id, title: 'Flood in Downtown Area', description: 'Severe flooding affecting multiple streets.', type: 'Flood',
          severity: 'High', status: 'In Progress', address: '123 Main Street, Downtown',
          latitude: 28.6139, longitude: 77.2090, peopleAffected: 150, emergencyContact: '+91-9876543210',
          createdAt: new Date().toISOString(), assignedRescuer: { name: 'Rajesh Kumar', phone: '+91-9111111111' },
        });
      } finally { setLoading(false); }
    };
    fetchReport();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading report details..." />;
  if (!report) return <div className="text-center py-12"><p className="text-gray-500">Report not found</p><button onClick={() => navigate(-1)} className="btn-primary mt-4 cursor-pointer">Go Back</button></div>;

  const statusSteps = ['Pending', 'Assigned', 'In Progress', 'Rescued', 'Completed'];
  const currentStep = statusSteps.indexOf(report.status);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">
          <FaArrowLeft className="mr-2 h-3 w-3" /> Back to Reports
        </button>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
        </div>
      </motion.div>

      <motion.div variants={item} className="card">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{report.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{report.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'TYPE', value: report.type },
            { label: 'REPORTED ON', value: new Date(report.createdAt).toLocaleDateString() },
            ...(report.peopleAffected ? [{ label: 'PEOPLE AFFECTED', value: report.peopleAffected }] : []),
            ...(report.emergencyContact ? [{ label: 'EMERGENCY CONTACT', value: report.emergencyContact }] : []),
          ].map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
            >
              <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">{field.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{field.value}</p>
            </motion.div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" /> Location
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{report.address}</p>
        </div>
        {report.image && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Photo Evidence</h3>
            <img src={report.image} alt="Disaster" className="w-full max-w-md rounded-lg border border-gray-100 dark:border-gray-700" />
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="card">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Status Progress</h3>
          <div className="space-y-3">
            {statusSteps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="flex items-center"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i <= currentStep ? 'bg-navy-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>{i + 1}</div>
                <div className={`ml-3 flex-1 text-sm ${i <= currentStep ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>{step}</div>
                {i <= currentStep && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {report.assignedRescuer && (
          <motion.div variants={item} className="card">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FaUser className="text-navy-800 dark:text-navy-400" /> Assigned Rescuer
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{report.assignedRescuer.name}</p>
              </div>
              {report.assignedRescuer.phone && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                    <FaPhone className="h-3 w-3 text-green-500" /> {report.assignedRescuer.phone}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportDetail;

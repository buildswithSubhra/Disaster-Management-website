import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FaSearch, FaHospital, FaPhone, FaBed, FaMapMarkerAlt, FaMap } from 'react-icons/fa';
import shelterService from '../../services/shelterService';
import LoadingSpinner from '../../components/LoadingSpinner';
import MapView from '../../components/MapView';
import SpotlightCard from '../../components/SpotlightCard';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const NearbyShelters = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await shelterService.getAllShelters();
        setShelters(res.data?.shelters || res.data || []);
      } catch {
        setShelters([
          { id: '1', name: 'Mumbai Central Relief Center', capacity: 500, availableBeds: 120, location: { address: 'Mumbai Central, Mumbai' }, contact: '+91-22-23081000' },
          { id: '2', name: 'Delhi Municipal Shelter', capacity: 800, availableBeds: 350, location: { address: 'ITO, New Delhi' }, contact: '+91-11-23384500' },
        ]);
      } finally { setLoading(false); }
    };
    fetchShelters();
  }, []);

  const filteredShelters = shelters.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <LoadingSpinner message="Loading shelters..." />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Emergency Shelters</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Nearby Shelters</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Find emergency shelters near you.</p>
        </motion.div>
      </div>

      <SpotlightCard glowColor="59, 130, 246">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input type="text" placeholder="Search shelters by name or location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-field pl-10" />
          </div>
          <motion.button
            onClick={() => setShowMap(!showMap)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${showMap ? 'bg-navy-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <FaMap className="h-4 w-4" /> {showMap ? 'Hide Map' : 'Show Map'}
          </motion.button>
        </div>
      </SpotlightCard>

      {showMap && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MapView shelters={filteredShelters} height="350px" />
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredShelters.map(shelter => (
          <SpotlightCard
            key={shelter.id || shelter._id}
            glowColor={shelter.availableBeds > 0 ? '34, 197, 94' : '239, 68, 68'}
            size="md"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-navy-50 dark:bg-navy-900/30 p-2 rounded-lg"><FaHospital className="h-4 w-4 text-navy-800 dark:text-navy-400" /></div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{shelter.name}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-gray-300 dark:text-gray-600" /> {shelter.location?.address || 'N/A'}
            </p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <FaBed className="text-navy-800 dark:text-navy-400" /> {shelter.availableBeds}/{shelter.capacity} beds
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${shelter.availableBeds > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {shelter.availableBeds > 0 ? 'Available' : 'Full'}
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-3">
              <motion.div
                className="bg-navy-800 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((shelter.capacity - shelter.availableBeds) / shelter.capacity) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            {shelter.contact && (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <FaPhone className="text-gray-300 dark:text-gray-600" /> {shelter.contact}
              </p>
            )}
          </SpotlightCard>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NearbyShelters;

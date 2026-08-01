import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FaExclamationTriangle, FaUserInjured, FaHospital, FaCheckCircle } from 'react-icons/fa';
import StatsChart from '../../components/StatsChart';
import StatusBadge from '../../components/StatusBadge';
import SpotlightCard from '../../components/SpotlightCard';
import ScrollReveal from '../../components/ScrollReveal';
import adminService from '../../services/adminService';
import disasterService from '../../services/disasterService';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalDisasters: 0, totalRescuers: 0, availableRescuers: 0, totalShelters: 0, disasters: { pending: 0, completed: 0, inProgress: 0 } });
  const [analytics, setAnalytics] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a, d] = await Promise.all([adminService.getDashboardStats(), adminService.getAnalytics(), disasterService.getAllDisasters({ limit: 5 })]);
        setStats(s.data); setAnalytics(a.data); setRecent(d.data?.disasters || d.data || []);
      } catch {
        setStats({ totalUsers: 53, totalDisasters: 100, totalRescuers: 5, availableRescuers: 3, totalShelters: 20, disasters: { pending: 20, completed: 18, inProgress: 15 } });
        setAnalytics({ monthlyReports: { '07-02': 12, '07-03': 16, '07-04': 15, '07-05': 6, '07-06': 18, '07-07': 14, '07-08': 10 }, disasterByType: { Flood: 15, Fire: 15, Earthquake: 14, Cyclone: 14, Landslide: 14, 'Building Collapse': 14, 'Road Accident': 14 }, disasterBySeverity: { Low: 27, Medium: 30, High: 26, Critical: 18 } });
        setRecent([{ id: '1', title: 'Flood in Mumbai', type: 'Flood', severity: 'High', status: 'In Progress', createdAt: new Date().toISOString() }, { id: '2', title: 'Fire in Delhi', type: 'Fire', severity: 'Critical', status: 'Pending', createdAt: new Date().toISOString() }]);
      }
    };
    load();
  }, []);

  const monthlyData = analytics?.monthlyReports ? Object.entries(analytics.monthlyReports).map(([name, value]) => ({ name, value })) : [];
  const typeData = analytics?.disasterByType ? Object.entries(analytics.disasterByType).map(([name, value]) => ({ name, value })) : [];
  const severityData = analytics?.disasterBySeverity ? Object.entries(analytics.disasterBySeverity).map(([name, value]) => ({ name, value })) : [];

  const statCards = [
    { label: 'TOTAL REPORTS', value: stats.totalDisasters || 0, icon: FaExclamationTriangle, glow: '239, 68, 68' },
    { label: 'ACTIVE MISSIONS', value: (stats.disasters?.pending || 0) + (stats.disasters?.inProgress || 0), icon: FaUserInjured, glow: '245, 158, 11' },
    { label: 'RESOLVED', value: stats.disasters?.completed || 0, icon: FaCheckCircle, glow: '34, 197, 94' },
    { label: 'SHELTERS', value: stats.totalShelters || 0, icon: FaHospital, glow: '59, 130, 246' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      <motion.div variants={item}>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Operations</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Command overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Live pulse of reports, missions, users and shelters.</p>
      </motion.div>

      <ScrollReveal direction="up" distance={30}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((c, i) => (
            <SpotlightCard key={c.label} glowColor={c.glow} size="md">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 font-semibold truncate">{c.label}</p>
                  <motion.p
                    className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {c.value}
                  </motion.p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl">
                  <c.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal direction="left" distance={40}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SpotlightCard glowColor="59, 130, 246" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Reports last 7 days</h3>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Daily Volume</span>
            </div>
            <StatsChart type="area" data={monthlyData} height={240} xAxisKey="name" yAxisKey="value" />
          </SpotlightCard>
          <SpotlightCard glowColor="139, 92, 246">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">By severity</h3>
            <StatsChart type="pie" data={severityData} height={280} />
          </SpotlightCard>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="right" distance={40}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpotlightCard glowColor="34, 197, 94">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Reports by type</h3>
            <StatsChart type="bar" data={typeData} height={220} />
          </SpotlightCard>
          <SpotlightCard glowColor="245, 158, 11">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent reports</h3>
            <div className="space-y-3">
              {recent.map((d, i) => (
                <motion.div
                  key={d.id || d._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{d.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{d.type}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <StatusBadge status={d.severity} />
                    <StatusBadge status={d.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </ScrollReveal>
    </motion.div>
  );
};

export default AdminDashboard;

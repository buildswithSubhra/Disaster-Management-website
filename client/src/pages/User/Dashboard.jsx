import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaPlus, FaChartLine, FaHistory, FaShieldAlt, FaNewspaper } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import SpotlightCard from '../../components/SpotlightCard';
import GlowButton from '../../components/GlowButton';
import EmergencyAlertBanner from '../../components/EmergencyAlertBanner';
import ActivityTimeline from '../../components/ActivityTimeline';
import SafetyTips from '../../components/SafetyTips';
import StatsChart from '../../components/StatsChart';
import ScrollReveal from '../../components/ScrollReveal';
import disasterService from '../../services/disasterService';
import shelterService from '../../services/shelterService';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const UserDashboard = () => {
  const auth = useAuth();
  const [reports, setReports] = React.useState([]);
  const [stats, setStats] = React.useState({ total: 0, inProgress: 0, resolved: 0, shelters: 0 });

  React.useEffect(() => {
    const load = async () => {
      try {
        const [dRes, sRes] = await Promise.all([
          disasterService.getMyDisasters({ limit: 5 }),
          shelterService.getAllShelters({ limit: 1 })
        ]);
        const data = dRes.data?.disasters || dRes.data || [];
        setReports(data);
        setStats({
          total: dRes.data?.total || data.length,
          inProgress: data.filter(d => d.status === 'In Progress').length,
          resolved: data.filter(d => d.status === 'Completed' || d.status === 'Rescued').length,
          shelters: sRes.data?.total || sRes.data?.shelters?.length || 0
        });
      } catch {
        setReports([{ id: '1', title: 'Flood', type: 'Flood', severity: 'High', status: 'Pending', address: 'Kolkata', createdAt: new Date().toISOString() }, { id: '2', title: 'Fire incident near Ahmedabad', type: 'Fire', severity: 'High', status: 'In Progress', address: 'Ahmedabad', createdAt: new Date().toISOString() }]);
        setStats({ total: 4, inProgress: 4, resolved: 0, shelters: 20 });
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'TOTAL REPORTS', value: stats.total, glow: '239, 68, 68' },
    { label: 'IN PROGRESS', value: stats.inProgress, glow: '245, 158, 11' },
    { label: 'RESOLVED', value: stats.resolved, glow: '34, 197, 94' },
    { label: 'NEARBY SHELTERS', value: stats.shelters, glow: '59, 130, 246' },
  ];

  // Mock chart data
  const weeklyData = [
    { name: 'Mon', value: 2 },
    { name: 'Tue', value: 4 },
    { name: 'Wed', value: 1 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 3 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 4 },
  ];

  const categoryData = [
    { name: 'Flood', value: 12 },
    { name: 'Fire', value: 8 },
    { name: 'Earthquake', value: 5 },
    { name: 'Cyclone', value: 7 },
    { name: 'Other', value: 3 },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      {/* Emergency Alert Banner */}
      <motion.div variants={item}>
        <EmergencyAlertBanner />
      </motion.div>

      {/* Header */}
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 font-semibold">Citizen Dashboard</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">Hello, {auth.user?.name?.split(' ')[0] || 'User'}.</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">File incidents, track their status, and find nearby shelters.</p>
        </div>
        <Link to="/user/report" className="flex-shrink-0">
          <GlowButton variant="primary">
            <FaPlus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">New report</span>
          </GlowButton>
        </Link>
      </motion.div>

      {/* Stat Cards with Scroll Reveal */}
      <ScrollReveal direction="up" distance={30}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((c, i) => (
            <SpotlightCard key={c.label} glowColor={c.glow} size="md">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 font-semibold truncate">{c.label}</p>
              <motion.p
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                {c.value}
              </motion.p>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>

      {/* Charts Row with Scroll Reveal */}
      <ScrollReveal direction="left" distance={40}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
          <SpotlightCard glowColor="59, 130, 246">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaChartLine className="h-4 w-4 text-navy-800 dark:text-navy-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Weekly Reports</h3>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">This Week</span>
            </div>
            <StatsChart type="area" data={weeklyData} height={180} xAxisKey="name" yAxisKey="value" />
          </SpotlightCard>

          <SpotlightCard glowColor="139, 92, 246">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaNewspaper className="h-4 w-4 text-navy-800 dark:text-navy-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Reports by Category</h3>
              </div>
            </div>
            <StatsChart type="bar" data={categoryData} height={180} />
          </SpotlightCard>
        </div>
      </ScrollReveal>

      {/* Main Content Grid with Scroll Reveal */}
      <ScrollReveal direction="right" distance={40}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Reports */}
          <SpotlightCard glowColor="59, 130, 246" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaHistory className="h-4 w-4 text-navy-800 dark:text-navy-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Recent Reports</h3>
              </div>
              <Link to="/user/reports" className="text-[10px] sm:text-xs font-semibold text-navy-800 dark:text-navy-400 hover:underline cursor-pointer">View all</Link>
            </div>
            <div className="space-y-1">
              {reports.slice(0, 4).map((r, i) => (
                <motion.div
                  key={r.id || r._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{r.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0" />
                      <span className="truncate">{r.address || r.type}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <StatusBadge status={r.severity} />
                    <StatusBadge status={r.status} />
                  </div>
                </motion.div>
              ))}
              {reports.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No reports yet</p>
              )}
            </div>
          </SpotlightCard>

          {/* Quick Actions + Safety Tips */}
          <div className="space-y-4">
            <SpotlightCard glowColor="139, 92, 246">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { to: '/user/report', title: 'Report a disaster', desc: 'File a new incident report', color: 'bg-danger-50 text-danger-600' },
                  { to: '/user/shelters', title: 'Find shelters', desc: 'Locate nearby emergency shelters', color: 'bg-info-50 text-info-600' },
                  { to: '/user/reports', title: 'My reports', desc: 'Track status of your reports', color: 'bg-success-50 text-success-600' },
                  { to: '/user/profile', title: 'My profile', desc: 'Manage account settings', color: 'bg-warning-50 text-warning-600' },
                ].map((action, i) => (
                  <motion.div
                    key={action.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  >
                    <Link to={action.to} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <span className="text-xs font-bold">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{action.title}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{action.desc}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard glowColor="34, 197, 94">
              <div className="flex items-center gap-2 mb-3">
                <FaShieldAlt className="h-4 w-4 text-success-600" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Safety Tip</h3>
              </div>
              <SafetyTips />
            </SpotlightCard>
          </div>
        </div>
      </ScrollReveal>

      {/* Activity Timeline with Scroll Reveal */}
      <ScrollReveal direction="up" distance={50}>
        <SpotlightCard glowColor="245, 158, 11">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaHistory className="h-4 w-4 text-navy-800 dark:text-navy-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recent Activity</h3>
            </div>
            <button className="text-xs font-semibold text-navy-800 dark:text-navy-400 hover:underline cursor-pointer">View all</button>
          </div>
          <ActivityTimeline />
        </SpotlightCard>
      </ScrollReveal>
    </motion.div>
  );
};

export default UserDashboard;

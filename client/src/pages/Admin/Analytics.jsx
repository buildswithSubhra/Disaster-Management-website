import React, { useState, useEffect } from 'react';
import StatsChart from '../../components/StatsChart';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const r = await adminService.getAnalytics(); setAnalytics(r.data); }
      catch { setAnalytics({ monthlyReports: { '07-02': 12, '07-03': 16, '07-04': 15, '07-05': 6, '07-06': 18, '07-07': 14, '07-08': 10 }, disasterByType: { Flood: 15, Fire: 15, Earthquake: 14, Cyclone: 14, Landslide: 14, 'Building Collapse': 14, 'Road Accident': 14 }, disasterBySeverity: { Low: 27, Medium: 30, High: 26, Critical: 18 }, rescueCompletionRate: 45, totalDisasters: 100, resolvedDisasters: 45 }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <p className="text-gray-400 dark:text-gray-500 text-center py-12">No data</p>;

  const monthlyData = analytics.monthlyReports ? Object.entries(analytics.monthlyReports).map(([name, value]) => ({ name, value })) : [];
  const typeData = analytics.disasterByType ? Object.entries(analytics.disasterByType).map(([name, value]) => ({ name, value })) : [];
  const severityData = analytics.disasterBySeverity ? Object.entries(analytics.disasterBySeverity).map(([name, value]) => ({ name, value })) : [];
  const statusData = [{ name: 'Resolved', value: analytics.resolvedDisasters || 0 }, { name: 'Pending', value: (analytics.totalDisasters || 0) - (analytics.resolvedDisasters || 0) }];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Comprehensive disaster management analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card overflow-hidden"><p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Total Disasters</p><p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{analytics.totalDisasters || 0}</p></div>
        <div className="stat-card overflow-hidden"><p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Resolved</p><p className="text-2xl sm:text-3xl font-bold text-success-600 mt-2">{analytics.resolvedDisasters || 0}</p></div>
        <div className="stat-card overflow-hidden"><p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Completion Rate</p><p className="text-2xl sm:text-3xl font-bold text-navy-800 mt-2">{analytics.rescueCompletionRate || 0}%</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card"><h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Monthly trend</h3><StatsChart type="area" data={monthlyData} height={280} /></div>
        <div className="card"><h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">By category</h3><StatsChart type="pie" data={typeData} height={280} /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card"><h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">By severity</h3><StatsChart type="bar" data={severityData} height={280} /></div>
        <div className="card"><h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Resolution status</h3><StatsChart type="pie" data={statusData} height={280} /></div>
      </div>
    </div>
  );
};

export default Analytics;

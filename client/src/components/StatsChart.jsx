import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#1a2332', '#dc2626', '#f59e0b', '#16a34a', '#8b5cf6', '#06b6d4', '#ec4899'];
const DARK_COLORS = ['#60a5fa', '#dc2626', '#f59e0b', '#16a34a', '#a78bfa', '#22d3ee', '#f472b6'];

const StatsChart = ({ type = 'bar', data = [], title, height = 300, xAxisKey = 'name', yAxisKey = 'value' }) => {
  const { dark } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="card">
        {title && <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-64 text-sm text-gray-400 dark:text-gray-500">No data available</div>
      </div>
    );
  }

  const gridColor = dark ? '#374151' : '#e5e7eb';
  const textColor = dark ? '#9ca3af' : '#6b7280';
  const tooltipBg = dark ? '#1f2937' : '#ffffff';
  const tooltipBorder = dark ? '#374151' : 'none';
  const tooltipText = dark ? '#e5e7eb' : '#1f293b';
  const tooltipStyle = { borderRadius: '8px', border: `1px solid ${tooltipBorder}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', backgroundColor: tooltipBg, color: tooltipText };
  const tickStyle = { fontSize: 12, fill: textColor };
  const common = { data, margin: { top: 5, right: 10, left: -10, bottom: 5 } };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        const barColors = dark ? DARK_COLORS : COLORS;
        return (
          <BarChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisKey} tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: textColor, fontSize: '11px' }} />
            <Bar dataKey={yAxisKey} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
            </Bar>
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisKey} tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: textColor, fontSize: '11px' }} />
            <Line type="monotone" dataKey={yAxisKey} stroke={COLORS[0]} strokeWidth={2} dot={{ fill: COLORS[0], strokeWidth: 2 }} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisKey} tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: textColor, fontSize: '11px' }} />
            <Area type="monotone" dataKey={yAxisKey} stroke={dark ? '#60a5fa' : COLORS[0]} fillOpacity={0.3} fill={dark ? '#60a5fa' : COLORS[0]} />
          </AreaChart>
        );
      case 'pie':
        const pieColors = dark ? DARK_COLORS : COLORS;
        const labelColor = dark ? '#e5e7eb' : '#374151';
        return (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%"
              labelLine={{ stroke: labelColor, strokeWidth: 1 }}
              label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 25;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                const pct = `${(percent * 100).toFixed(0)}%`;
                return (
                  <text x={x} y={y} fill={labelColor} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={500}>
                    {`${name}: ${pct}`}
                  </text>
                );
              }}
              outerRadius={80} innerRadius={35} fill="#8884d8" dataKey={yAxisKey}
              paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: textColor }} />
          </PieChart>
        );
      default: return null;
    }
  };

  return (
    <div className="overflow-hidden">
      {title && <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>{renderChart()}</ResponsiveContainer>
    </div>
  );
};

export default StatsChart;

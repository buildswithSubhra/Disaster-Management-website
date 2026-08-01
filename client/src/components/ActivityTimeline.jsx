import React from 'react';
import { motion } from 'motion/react';
import { FaCheckCircle, FaUserPlus, FaExclamationTriangle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const mockActivities = [
  {
    id: 1,
    type: 'assigned',
    icon: FaUserPlus,
    iconColor: 'text-info-500',
    iconBg: 'bg-info-50',
    title: 'Rescuer assigned to your report',
    description: 'Rajesh Kumar has been assigned to "Flood in Downtown"',
    time: '15 min ago',
  },
  {
    id: 2,
    type: 'status',
    icon: FaCheckCircle,
    iconColor: 'text-success-500',
    iconBg: 'bg-success-50',
    title: 'Report status updated',
    description: '"Urban Flooding - Andheri East" marked as Rescued',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'alert',
    icon: FaExclamationTriangle,
    iconColor: 'text-warning-500',
    iconBg: 'bg-warning-50',
    title: 'New emergency alert',
    description: 'Cyclone warning issued for Gujarat coast',
    time: '2 hours ago',
  },
  {
    id: 4,
    type: 'location',
    icon: FaMapMarkerAlt,
    iconColor: 'text-danger-500',
    iconBg: 'bg-danger-50',
    title: 'Disaster reported near you',
    description: 'Building collapse reported 2.3 km from your location',
    time: '3 hours ago',
  },
  {
    id: 5,
    type: 'status',
    icon: FaCheckCircle,
    iconColor: 'text-success-500',
    iconBg: 'bg-success-50',
    title: 'Report resolved',
    description: '"School Building Damaged - FC Road" has been resolved',
    time: '5 hours ago',
  },
];

const ActivityTimeline = () => {
  return (
    <div className="space-y-1">
      {mockActivities.map((activity, i) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default"
        >
          <div className={`p-2 rounded-lg ${activity.iconBg} flex-shrink-0`}>
            <activity.icon className={`h-3.5 w-3.5 ${activity.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">{activity.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.description}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
            <FaClock className="h-2.5 w-2.5" />
            {activity.time}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityTimeline;

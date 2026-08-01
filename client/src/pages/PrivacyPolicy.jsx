import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft } from 'react-icons/fa';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you use ReliefOps, we may collect personal information including your name, email address, phone number, and location data. We also collect usage data such as device information, IP address, and browsing activity on our platform. Disaster reports you submit may include location coordinates, descriptions, and any media you attach.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to provide and improve our disaster management services, coordinate emergency responses, send you important alerts and notifications, communicate with you about your account, and ensure the safety and security of our platform. Location data is used specifically for disaster reporting and rescue coordination purposes.`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell your personal information to third parties. We may share your information with emergency responders and rescue teams when you submit a disaster report, with government agencies as required by law, and with service providers who assist in operating our platform. All sharing is done in accordance with applicable data protection laws.`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including encryption of data in transit and at rest, secure authentication mechanisms, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '5. Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide you services. Disaster reports may be retained for historical analysis and emergency preparedness purposes. You may request deletion of your account and associated data at any time.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to access, correct, or delete your personal information. You can update your profile information at any time through your account settings. You may also opt out of non-essential communications. For data-related requests, please contact our support team.`,
  },
  {
    title: '7. Cookies',
    content: `ReliefOps uses cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of certain features.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of ReliefOps after changes constitutes acceptance of the updated policy.`,
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-navy-400 text-sm mb-12">Last updated: January 2025</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              className="bg-navy-900/30 dark:bg-gray-800/50 border border-white/5 dark:border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold mb-3">{section.title}</h2>
              <p className="text-navy-300 text-sm leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

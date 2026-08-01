import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FaArrowLeft } from 'react-icons/fa';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using ReliefOps, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.`,
  },
  {
    title: '2. User Accounts',
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to keep your information up to date. You must be at least 18 years old to create an account.`,
  },
  {
    title: '3. Acceptable Use',
    content: `You agree to use ReliefOps only for its intended purpose of disaster reporting, emergency response coordination, and related activities. You will not submit false or misleading disaster reports, misuse the platform, attempt to gain unauthorized access, or interfere with the platform's operation.`,
  },
  {
    title: '4. Disaster Reports',
    content: `When submitting disaster reports, you agree to provide accurate and truthful information to the best of your knowledge. False reporting of emergencies is a serious offense and may result in account termination and legal action. You grant ReliefOps the right to share your reports with relevant emergency services.`,
  },
  {
    title: '5. Intellectual Property',
    content: `All content, design, graphics, and other materials on ReliefOps are owned by or licensed to us and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the platform without our express written permission.`,
  },
  {
    title: '6. Limitation of Liability',
    content: `ReliefOps is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform. While we strive for accuracy, we do not guarantee that disaster information will be complete, current, or error-free. Emergency situations should always be reported through official emergency services as well.`,
  },
  {
    title: '7. Account Termination',
    content: `We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion. You may also voluntarily delete your account through your profile settings. Upon termination, your access to the platform will be revoked.`,
  },
  {
    title: '8. Governing Law',
    content: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms or your use of ReliefOps shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.`,
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-navy-950 dark:bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-white text-sm mb-8 transition-colors">
          <FaArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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

export default TermsOfService;

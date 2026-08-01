import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import {
  FaExclamationTriangle, FaShieldAlt, FaHospital, FaUsers,
  FaArrowRight, FaClock, FaBell,
  FaHeartbeat, FaHandshake, FaChartLine, FaGlobeAsia
} from 'react-icons/fa';
import GradientText from '../components/GradientText';
import GlowButton from '../components/GlowButton';
import SpotlightCard from '../components/SpotlightCard';
import AnimatedBackground from '../components/AnimatedBackground';
import ScrollReveal, { RevealWords } from '../components/ScrollReveal';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const DECELERATE = [0.16, 1, 0.3, 1];

const AnimatedCounter = ({ target, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
    />
  );
};

const Landing = () => {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroCopyY = useTransform(heroScroll, [0, 1], [0, -150]);
  const heroCopyOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.08]);

  return (
    <div className="relative bg-white dark:bg-gray-900">
      <ScrollProgress />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatedBackground />

        <motion.div
          style={{ y: heroCopyY, opacity: heroCopyOpacity, scale: heroScale }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: DECELERATE }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-white/70 tracking-wide">REAL-TIME DISASTER RESPONSE PLATFORM</span>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
            <RevealWords text="Every second counts." className="block" />
            <br />
            <span className="block">
              <RevealWords text="We make them count." wordClassName="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: DECELERATE }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Report disasters, coordinate rescue missions, and find safe shelters —
            all in one unified platform built for communities that refuse to stand still.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: DECELERATE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'rescuer' ? '/rescuer/dashboard' : '/user/dashboard'}>
                <GlowButton variant="primary" className="text-base px-8 py-3.5">
                  Go to Dashboard <FaArrowRight className="h-4 w-4" />
                </GlowButton>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <GlowButton variant="primary" className="text-base px-8 py-3.5">
                    Get Started <FaArrowRight className="h-4 w-4" />
                  </GlowButton>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 text-base font-semibold text-white/70 hover:text-white border border-white/10 dark:border-gray-600 hover:border-white/20 dark:hover:border-gray-500 rounded-xl transition-all cursor-pointer"
                  >
                    Sign in
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/30 dark:text-gray-400 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <FaShieldAlt className="h-4 w-4" />
              <span>Trusted by 53+ users</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
            <div className="flex items-center gap-2">
              <FaClock className="h-4 w-4" />
              <span>24/7 monitoring</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
            <div className="flex items-center gap-2">
              <FaGlobeAsia className="h-4 w-4" />
              <span>Pan-India coverage</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], height: [6, 12, 6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative py-16 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-10 sm:mb-16">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-navy-400 dark:text-white/30 font-semibold mb-3">Platform Features</p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-navy-900 dark:text-white tracking-tight">
                Built for{' '}
                <GradientText from="#60a5fa" to="#a78bfa">emergency response</GradientText>
              </h2>
              <p className="text-navy-500 dark:text-white/40 mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base">
                Everything you need to report, track, and respond to disasters — from citizens on the ground to coordinators in the field.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FaExclamationTriangle,
                title: 'Report Disasters',
                desc: 'File incident reports with location, severity, and real-time status tracking.',
                glow: '239, 68, 68',
                color: 'bg-danger-500/10 text-danger-500',
              },
              {
                icon: FaHospital,
                title: 'Find Shelters',
                desc: 'Locate nearby emergency shelters with capacity and availability updates.',
                glow: '59, 130, 246',
                color: 'bg-info-500/10 text-info-500',
              },
              {
                icon: FaUsers,
                title: 'Coordinate Rescue',
                desc: 'Assign rescuers, track missions, and manage emergency response in real time.',
                glow: '139, 92, 246',
                color: 'bg-purple-500/10 text-purple-400',
              },
              {
                icon: FaChartLine,
                title: 'Live Analytics',
                desc: 'Monitor disaster trends, severity distribution, and response metrics.',
                glow: '34, 197, 94',
                color: 'bg-success-500/10 text-success-500',
              },
            ].map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={i * 0.1}>
                <SpotlightCard glowColor={f.glow} className="h-full bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-5`}
                  >
                    <f.icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-navy-500 dark:text-white/40 leading-relaxed">{f.desc}</p>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPACT STATS ===== */}
      <section className="relative py-12 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up">
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-navy-50 to-navy-100 dark:from-gray-800 dark:to-gray-900 border border-navy-200 dark:border-white/5 p-6 sm:p-12 md:p-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-info-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                {[
                  { value: 100, suffix: '+', label: 'Disasters Reported', color: 'text-danger-500' },
                  { value: 20, suffix: '+', label: 'Emergency Shelters', color: 'text-info-500' },
                  { value: 5, suffix: '+', label: 'Active Rescuers', color: 'text-success-500' },
                  { value: 24, suffix: '/7', label: 'Response System', color: 'text-warning-500' },
                ].map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={i * 0.1}>
                    <div className="text-center">
                      <p className={`text-2xl sm:text-4xl md:text-5xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-navy-500 dark:text-white/30 font-medium">{stat.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-16 sm:py-32 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-10 sm:mb-16">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-navy-400 dark:text-white/30 font-semibold mb-3">How It Works</p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-navy-900 dark:text-white tracking-tight">
                Three steps to{' '}
                <GradientText from="#f472b6" to="#fb923c">safety</GradientText>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-navy-300 dark:via-white/10 to-transparent" />

            {[
              {
                step: '01',
                icon: FaBell,
                title: 'Report',
                desc: 'Citizens file disaster reports with precise location, severity level, and affected population data.',
                glow: '239, 68, 68',
              },
              {
                step: '02',
                icon: FaHandshake,
                title: 'Coordinate',
                desc: 'Admins review reports, assign available rescuers, and dispatch teams to affected areas.',
                glow: '59, 130, 246',
              },
              {
                step: '03',
                icon: FaHeartbeat,
                title: 'Respond',
                desc: 'Rescuers reach the scene, update mission status, and mark incidents as resolved in real time.',
                glow: '34, 197, 94',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} direction="up" delay={i * 0.15}>
                <div className="relative text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/5 mb-4 sm:mb-6 shadow-sm dark:shadow-glow"
                  >
                    <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-navy-600 dark:text-white/70" />
                  </motion.div>
                  <div className="inline-block px-3 py-1 bg-navy-100 dark:bg-white/5 rounded-full mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-xs font-bold text-navy-500 dark:text-white/50 tracking-wider">STEP {item.step}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-navy-500 dark:text-white/40 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-16 sm:py-32 bg-gray-50 dark:bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal direction="up" distance={40}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 border border-navy-200 dark:border-white/5 p-8 sm:p-16 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-info-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-info-500/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4 sm:mb-6">
                  <RevealWords text={user ? "Welcome back!" : "Ready to make a difference?"} className="block" />
                </h2>
                <p className="text-navy-500 dark:text-white/60 text-sm sm:text-lg mb-6 sm:mb-10 max-w-xl mx-auto">
                  {user ? "You're already part of the ReliefOps community. Head to your dashboard." : "Join ReliefOps today. Report emergencies, coordinate rescues, and help your community stay safe."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  {user ? (
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'rescuer' ? '/rescuer/dashboard' : '/user/dashboard'}>
                      <GlowButton variant="primary" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5">
                        Go to Dashboard <FaArrowRight className="h-4 w-4" />
                      </GlowButton>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <GlowButton variant="primary" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5">
                          Create Account <FaArrowRight className="h-4 w-4" />
                        </GlowButton>
                      </Link>
                      <Link to="/login">
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-navy-600 dark:text-white/70 hover:text-navy-900 dark:hover:text-white border border-navy-300 dark:border-white/20 hover:border-navy-400 dark:hover:border-white/40 rounded-xl transition-all cursor-pointer"
                        >
                          Sign in
                        </motion.button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

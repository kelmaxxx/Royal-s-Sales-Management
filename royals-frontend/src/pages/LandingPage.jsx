import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Crown,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  ArrowRight
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const floatingAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const hoverScale = {
  scale: 1.05,
  y: -8,
  transition: { duration: 0.3 }
};

// Reusable Section component with scroll animation
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// 3D Phone Mockup Component with Mouse Parallax
const PhoneMockup3D = ({ imageSrc = "/Realistic_smartphone_mockup__Isometric_smartphone_set-removebg-preview.png" }) => {
  const ref = useRef(null);
  
  // Mouse parallax values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseXPos);
    y.set(mouseYPos);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <div 
      className="w-full flex justify-center items-center"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <motion.div
        // Levitation animation
        animate={{ y: [0, -20, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 6, 
          ease: "easeInOut" 
        }}
        // 3D rotation based on mouse
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[300px] md:w-[400px] z-10"
      >
        {/* The iPhone Image */}
        <motion.img 
          src={imageSrc} 
          alt="iPhone 17 App Mockup" 
          className="w-full h-auto drop-shadow-2xl" 
          style={{ 
            transform: "translateZ(20px)",
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))"
          }}
        />
        
        {/* Optional: Glare Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[3rem] pointer-events-none z-20"></div>
        
        {/* Floating Badge */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm"
          style={{ transform: "translateZ(40px)" }}
        >
          Live Updates
        </motion.div>
      </motion.div>
      
      {/* Shadow that stays on the floor */}
      <motion.div 
        animate={{ scale: [1, 0.85, 1], opacity: [0.4, 0.2, 0.4] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute -bottom-10 w-48 h-8 bg-black/30 blur-xl rounded-[100%] z-0"
      />
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for different sections
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const featuresY = useTransform(scrollYProgress, [0.1, 0.4], [100, -50]);
  const productY = useTransform(scrollYProgress, [0.3, 0.6], [100, -50]);
  const analyticsY = useTransform(scrollYProgress, [0.5, 0.8], [100, -50]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              style={{ y: heroY, opacity: heroOpacity }}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                <img src="/royals-logo.png" alt="Royal's Logo" className="w-6 h-6 object-contain" />
                <span className="text-sm font-medium text-slate-700">Royal's Sales Management</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight"
              >
                Simple, smart sales management.
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl"
              >
                Manage products, record sales, and see insights — all in one place. 
                Built for small businesses.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-slate-700 font-semibold hover:text-slate-900 transition-colors"
                >
                  See Demo
                </button>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Trusted by local businesses</p>
                  <p>Managing 10,000+ products daily</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image/Card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: heroY }}
              className="relative"
            >
              <motion.div
                animate={floatingAnimation}
                className="relative rounded-3xl overflow-hidden shadow-2xl bg-white"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1">
                        <img src="/royals-logo.png" alt="Royal's Logo" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Royal's Dashboard</p>
                        <p className="text-slate-400 text-sm">Sales Overview</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {[
                        { label: 'Today Sales', value: '₱12,450', icon: TrendingUp },
                        { label: 'Products', value: '234', icon: Package },
                        { label: 'Transactions', value: '45', icon: ShoppingCart },
                        { label: 'Revenue', value: '₱89.2K', icon: BarChart3 }
                      ].map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
                          <stat.icon className="w-5 h-5 text-amber-500 mb-2" />
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-slate-400 text-sm">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-10 -right-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-20" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection id="features" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ y: featuresY }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-amber-600 font-semibold mb-2">FEATURES</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-extrabold text-slate-900">
              Everything you need to manage sales
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            style={{ y: featuresY }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: LayoutDashboard,
                title: 'Dashboard',
                description: 'One place for daily sales, quick actions, and status at a glance.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Package,
                title: 'Product Management',
                description: 'Add, edit, and track product stock and pricing easily.',
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                icon: ShoppingCart,
                title: 'Sales Tracking',
                description: 'Fast transaction entry and accurate totals with minimal clicks.',
                color: 'from-amber-500 to-amber-600'
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Revenue and inventory insights to help decisions.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={hoverScale}
                className="group bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Product & Sales Preview Section */}
      <AnimatedSection className="py-24 px-6 lg:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Floating Phone Mockup */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ y: productY }}
              className="relative flex justify-center"
            >
              {/* 3D iPhone Mockup */}
              <PhoneMockup3D />

              {/* Background Decoration */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20" />
              </div>
            </motion.div>

            {/* Right - Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              style={{ y: productY }}
              className="space-y-6"
            >
              <motion.p variants={fadeInUp} className="text-amber-600 font-semibold">MOBILE READY</motion.p>
              
              <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-extrabold text-slate-900">
                Your catalog, ready on any device.
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed">
                Add products fast, show customers availability, and close sales on the spot.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-4 pt-4">
                {[
                  'Centralized product catalog',
                  'Fast sales entry',
                  'Clear reports'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <p className="text-slate-700 font-medium">{item}</p>
                  </div>
                ))}
              </motion.div>

              <motion.button
                variants={fadeInUp}
                onClick={() => navigate('/login')}
                className="mt-8 px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
              >
                Try It Now
                <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Analytics & Reports CTA Banner */}
      <AnimatedSection className="py-24 px-6 lg:px-12 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ y: analyticsY }}
          className="max-w-7xl mx-auto"
        >
          <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left - Text Content */}
                <div className="space-y-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl lg:text-5xl font-extrabold text-white"
                  >
                    Turn numbers into decisions.
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-slate-300 leading-relaxed"
                  >
                    Real-time summary of revenue, best-sellers, and stock alerts.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 pt-4"
                  >
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Create Account
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-slate-900 transition-all duration-300"
                    >
                      Sign In
                    </button>
                  </motion.div>
                </div>

                {/* Right - Chart Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700"
                  >
                    {/* Mock Chart */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Revenue Trend</h3>
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      
                      <div className="flex items-end gap-2 h-40">
                        {[60, 80, 45, 90, 70, 85, 95].map((height, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-lg min-h-[20%]"
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div>
                          <p className="text-slate-400 text-xs">This Week</p>
                          <p className="text-white font-bold text-lg">₱45.2K</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Growth</p>
                          <p className="text-emerald-400 font-bold text-lg">+23%</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Orders</p>
                          <p className="text-white font-bold text-lg">128</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-50" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-10" />
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/royals-logo.png" alt="Royal's Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-slate-900">Royal's</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Docs</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</a>
            </div>

            <p className="text-slate-600 text-sm">
              © 2025 Royal's. Built for the Royal store.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;

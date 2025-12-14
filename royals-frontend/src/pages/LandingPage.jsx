import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
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
import Phone3DModel from '../components/Phone3DModel';

// Scroll-driven animation variants (no continuous animations)
const scrollFadeIn = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
  },
  exit: {
    opacity: 0,
    y: -60,
    transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

// Staggered container - elements animate in sequence
const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1 // Reverse order when exiting
    }
  }
};

// Hover only - no continuous animation
const hoverScale = {
  scale: 1.05,
  y: -8,
  transition: { duration: 0.3 }
};

// Scroll-driven section component - animates both in and out
const ScrollDrivenSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false, // Allow re-triggering
    margin: "-10%", // Trigger earlier
    amount: 0.3 // Need 30% visible to trigger
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "exit"}
      variants={scrollFadeIn}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// This component is no longer needed - removed all continuous animations

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
      {/* Navigation Bar - Fixed at Top */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto px-6 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-3">
              <img 
                src="/1765288782147.png" 
                alt="Royal's Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="poppins-bold text-xl text-slate-900">Royal's Sales Management</span>
            </div>

            {/* Navigation Links & Button - Right Side */}
            <div className="flex items-center gap-8">
              <a href="#about" className="poppins-medium hidden md:block text-slate-600 hover:text-slate-900 transition-colors">
                About Us
              </a>
              <a href="#features" className="poppins-medium hidden md:block text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#sales-product" className="poppins-medium hidden md:block text-slate-600 hover:text-slate-900 transition-colors">
                Sales and Product
              </a>
              <a href="#analytics" className="poppins-medium hidden md:block text-slate-600 hover:text-slate-900 transition-colors">
                Analytics
              </a>
              
              {/* Get Started Button */}
              <button
                onClick={() => navigate('/login')}
                className="poppins-medium px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern Minimalist SaaS */}
      <section className="relative min-h-screen bg-white pt-20">
        <div className="mx-auto px-6 lg:px-16 xl:px-24 h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Headline - Extremely Large, Bold, Sans-serif with Roboto */}
              <h1 className="roboto-headline text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-6 leading-[0.95] tracking-tight">
                Simple, smart sales management
              </h1>

              {/* Subtext - Clean and Readable with Poppins */}
              <p className="poppins-regular text-xl md:text-2xl text-slate-600 leading-relaxed max-w-xl">
                Manage products, record sales, and see insights — all in one place. Built for small businesses.
              </p>
            </motion.div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              {/* Floating Dashboard Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="poppins-semibold text-white">Sales Dashboard</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                      <div className="poppins-bold text-2xl text-amber-900">$12.5K</div>
                      <div className="poppins-regular text-xs text-amber-700 mt-1">Revenue</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                      <div className="poppins-bold text-2xl text-blue-900">248</div>
                      <div className="poppins-regular text-xs text-blue-700 mt-1">Sales</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                      <div className="poppins-bold text-2xl text-green-900">156</div>
                      <div className="poppins-regular text-xs text-green-700 mt-1">Products</div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="space-y-3">
                    <h4 className="poppins-semibold text-sm text-slate-700">Weekly Performance</h4>
                    <div className="flex items-end justify-between h-32 gap-2">
                      {[65, 85, 72, 90, 78, 95, 88].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent Sales */}
                  <div className="space-y-2">
                    <h4 className="poppins-semibold text-sm text-slate-700">Recent Sales</h4>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
                          <div>
                            <div className="poppins-medium text-sm text-slate-900">Product {i}</div>
                            <div className="poppins-regular text-xs text-slate-500">2 mins ago</div>
                          </div>
                        </div>
                        <div className="poppins-semibold text-sm text-green-600">+${(Math.random() * 100 + 50).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Accent Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section - Scroll Driven with Stagger */}
      <ScrollDrivenSection id="features" className="py-24 px-6 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto">
          {/* Title - animates first */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-10%", amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={scrollFadeIn} className="text-amber-600 font-semibold mb-2">FEATURES</motion.p>
            <motion.h2 variants={scrollFadeIn} className="text-4xl lg:text-5xl font-extrabold text-slate-900">
              Everything you need to manage sales
            </motion.h2>
          </motion.div>

          {/* Feature Cards - animate in stair pattern */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, margin: "-10%", amount: 0.3 }}
            variants={staggerContainer}
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
                variants={scrollFadeIn}
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
      </ScrollDrivenSection>

      {/* Product & Sales Preview Section - 3D Phone appears first, then text */}
      <ScrollDrivenSection id="sales-product" className="py-24 px-6 lg:px-16 xl:px-24 bg-slate-50">
        <div className="mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - 3D Phone Model (animates FIRST) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-10%", amount: 0.3 }}
              variants={scrollFadeIn}
              transition={{ duration: 0.6, delay: 0 }} // No delay - appears first
              className="relative flex justify-center"
            >
              {/* 3D iPhone Model with Scroll-based Tilt */}
              <Phone3DModel />

              {/* Background Decoration */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-20" />
              </div>
            </motion.div>

            {/* Right - Text Content (animates AFTER phone with stagger) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, margin: "-10%", amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.p variants={scrollFadeIn} className="text-amber-600 font-semibold">MOBILE READY</motion.p>
              
              <motion.h2 variants={scrollFadeIn} className="text-4xl lg:text-5xl font-extrabold text-slate-900">
                Your catalog, ready on any device.
              </motion.h2>

              <motion.p variants={scrollFadeIn} className="text-lg text-slate-600 leading-relaxed">
                Add products fast, show customers availability, and close sales on the spot.
              </motion.p>

              <motion.div variants={scrollFadeIn} className="space-y-4 pt-4">
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
                variants={scrollFadeIn}
                onClick={() => navigate('/login')}
                className="mt-8 px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
              >
                Try It Now
                <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </ScrollDrivenSection>

      {/* Analytics & Reports CTA Banner - Text first, then chart */}
      <ScrollDrivenSection id="analytics" className="py-24 px-6 lg:px-16 xl:px-24 bg-white">
        <div className="mx-auto">
          <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left - Text Content (staggered animation) */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-10%", amount: 0.3 }}
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  <motion.h2
                    variants={scrollFadeIn}
                    className="text-4xl lg:text-5xl font-extrabold text-white"
                  >
                    Turn numbers into decisions.
                  </motion.h2>

                  <motion.p
                    variants={scrollFadeIn}
                    className="text-lg text-slate-300 leading-relaxed"
                  >
                    Real-time summary of revenue, best-sellers, and stock alerts.
                  </motion.p>

                  <motion.div
                    variants={scrollFadeIn}
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
                </motion.div>

                {/* Right - Chart Preview (appears after text, NO FLOATING) */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, margin: "-10%", amount: 0.3 }}
                  variants={scrollFadeIn}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700">
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
                            viewport={{ once: false }}
                            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
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
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-50" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-10" />
          </div>
        </div>
      </ScrollDrivenSection>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-16 xl:px-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto">
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

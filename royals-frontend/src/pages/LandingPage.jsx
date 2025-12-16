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
  ArrowRight,
  LayoutGrid,
  Box
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

      {/* Hero Section - ClickCart Inspired Centered Layout */}
      <section className="relative min-h-screen bg-white pt-20 overflow-hidden">
        {/* Background Grid Pattern (Subtle) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
        
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 text-center">
          
          {/* Centered Headlines */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6 mb-16 relative"
          >
            {/* Decorator blob behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl -z-10" />
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Simple, smart <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">sales management</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Manage products, record sales, and see insights — all in one place. 
              Built specifically for small businesses to grow faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-amber-400 text-slate-900 rounded-full font-bold text-lg hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Dashboard Preview Section (The "ClickCart" Layout) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mt-12 mx-auto max-w-6xl"
          >
            
            {/* Floating Card Left (Sales Screenshot) */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -6 }}
              animate={{ opacity: 1, x: 0, rotate: -6 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden lg:block absolute -left-12 top-20 z-20 bg-white rounded-2xl shadow-2xl border border-slate-100 transform -rotate-6 w-64 overflow-hidden"
            >
              <img 
                src="/sales-ss.png" 
                alt="Sales Management" 
                className="w-full h-auto"
              />
            </motion.div>

            {/* Main Dashboard Interface with Screenshot */}
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden relative z-10 mx-auto">
              {/* Fake Browser Header */}
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 text-xs text-slate-400 font-medium">Sales Dashboard</div>
              </div>

              {/* Main Dashboard Screenshot */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-slate-50/50"
              >
                <img 
                  src="/main-ss.png" 
                  alt="Main Dashboard" 
                  className="w-full h-auto"
                />
              </motion.div>
            </div>

            {/* Floating Card Right (Report Screenshot) */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 3 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden lg:block absolute -right-12 bottom-20 z-20 bg-white rounded-2xl shadow-2xl border border-slate-100 transform rotate-3 w-64 overflow-hidden"
            >
              <img 
                src="/report-ss.png" 
                alt="Reports & Analytics" 
                className="w-full h-auto"
              />
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Features Section - Amber Background with ClickCart Layout */}
      <section className="py-24 px-4 bg-[rgb(245,158,11)]">
        <div className="max-w-7xl mx-auto">
          
          {/* Headline Section - Using Slate 900 for contrast on Amber */}
          <div className="text-center mb-20">
            <h2 className="text-slate-900 font-bold tracking-wider uppercase mb-4">
              Features
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to manage sales
            </h3>
          </div>

          {/* Grid Layout for Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Dashboard Card */}
            <div className="p-8 rounded-[2rem] transition-transform duration-300 hover:-translate-y-2 bg-white text-slate-900 shadow-xl shadow-amber-700/20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-amber-500 text-slate-900">
                <LayoutGrid className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">
                Dashboard
              </h4>
              <p className="leading-relaxed text-lg text-slate-600">
                One place for daily sales, quick actions, and status at a glance.
              </p>
            </div>

            {/* Product Management Card - Highlighted */}
            <div className="p-8 rounded-[2rem] transition-transform duration-300 hover:-translate-y-2 bg-slate-900 text-white shadow-2xl shadow-slate-900/50">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white text-amber-500">
                <Package className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-bold mb-4">
                <span className="text-amber-500">Product</span> <span className="text-white">Management</span>
              </h4>
              <p className="leading-relaxed text-lg text-slate-300">
                Add, edit, and track product stock and pricing easily.
              </p>
            </div>

            {/* Sales Tracking Card */}
            <div className="p-8 rounded-[2rem] transition-transform duration-300 hover:-translate-y-2 bg-white text-slate-900 shadow-xl shadow-amber-700/20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-amber-500 text-slate-900">
                <ShoppingCart className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-bold mb-4">
                <span className="text-amber-500">Sales</span> <span className="text-slate-900">Tracking</span>
              </h4>
              <p className="leading-relaxed text-lg text-slate-600">
                Fast transaction entry and accurate totals with minimal clicks.
              </p>
            </div>

            {/* Analytics Card */}
            <div className="p-8 rounded-[2rem] transition-transform duration-300 hover:-translate-y-2 bg-white text-slate-900 shadow-xl shadow-amber-700/20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-amber-500 text-slate-900">
                <BarChart3 className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">
                Analytics
              </h4>
              <p className="leading-relaxed text-lg text-slate-600">
                Revenue and inventory insights to help decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product & Sales Preview Section - 3D Phone appears first, then text */}
      <section id="sales-product" className="py-24 px-6 lg:px-16 xl:px-24 bg-slate-900">
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
              <motion.p variants={scrollFadeIn} className="text-amber-500 font-semibold">MOBILE READY</motion.p>
              
              <motion.h2 variants={scrollFadeIn} className="text-4xl lg:text-5xl font-extrabold text-white">
                Your catalog, ready on any device.
              </motion.h2>

              <motion.p variants={scrollFadeIn} className="text-lg text-slate-300 leading-relaxed">
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
                    <p className="text-white font-medium">{item}</p>
                  </div>
                ))}
              </motion.div>

              <motion.button
                variants={scrollFadeIn}
                onClick={() => navigate('/login')}
                className="mt-8 px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-full hover:bg-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
              >
                Try It Now
                <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

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

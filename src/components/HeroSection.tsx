'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, fadeInDown, staggerContainer, slideInBottom, floatingAnimation, textReveal, cardHover } from '@/lib/animations';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: ['Making a', 'Difference', 'Together'],
      subtitle: 'Join Bawaliya Seva Sansthan in creating positive change in our community.',
      stats: { value: '10K+', label: 'Lives Impacted', color: 'text-green-300' }
    },
    {
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: ['Education for', 'Every Child', 'Matters'],
      subtitle: 'Through education, healthcare, and social welfare programs.',
      stats: { value: '500+', label: 'People Helped', color: 'text-blue-300' }
    },
    {
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
      title: ['Building', 'Better', 'Tomorrow'],
      subtitle: 'Empowering communities through sustainable development.',
      stats: { value: '50+', label: 'Active Programs', color: 'text-yellow-300' }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const parallaxOffset = {
    x: typeof window !== 'undefined' ? (mousePosition.x - window.innerWidth / 2) * 0.01 : 0,
    y: typeof window !== 'undefined' ? (mousePosition.y - window.innerHeight / 2) * 0.01 : 0,
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5 }}
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-purple-900/80" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 min-h-screen flex items-center">
        <motion.div
          className="w-full"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Left Content - Now Full Width */}
          <div className="space-y-8 max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInDown} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentSlide}
                  className="text-4xl md:text-6xl font-bold leading-tight text-white"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {slides[currentSlide].title.map((word, index) => (
                    <motion.span
                      key={index}
                      className={`block ${index === 1 ? 'text-yellow-300' : ''}`}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            <motion.p 
              variants={textReveal}
              className="text-xl text-blue-100 leading-relaxed"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.span>
              </AnimatePresence>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={slideInBottom}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-800 transition-all duration-300 backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Animated Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-yellow-300"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  500+
                </motion.div>
                <div className="text-sm text-blue-100">People Helped</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl font-bold text-green-300"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  50+
                </motion.div>
                <div className="text-sm text-blue-100">Programs</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className={`text-3xl font-bold ${slides[currentSlide].stats.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, scale: [1, 1.1, 1] }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, scale: { duration: 2, repeat: Infinity, delay: 1 } }}
                  >
                    {slides[currentSlide].stats.value}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="text-sm text-blue-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {slides[currentSlide].stats.label}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-yellow-300 w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => setCurrentSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
      
      {/* Enhanced Wave Shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <motion.svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            animate={{
              d: [
                "M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z",
                "M0 120L60 105C120 90 240 75 360 85C480 95 600 50 720 55C840 60 960 85 1080 90C1200 95 1320 85 1380 85L1440 85V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z",
                "M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>
    </section>
  );
}

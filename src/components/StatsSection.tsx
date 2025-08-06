'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000, isInView: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationId = requestAnimationFrame(updateCount);
      }
    };

    animationId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationId);
  }, [end, duration, isInView]);

  return count;
};

// StatItem component to properly use the hook
const StatItem = ({ stat, index, inView }: { stat: any, index: number, inView: boolean }) => {
  const count = useCountUp(stat.number, 2000 + index * 200, inView);
  
  return (
    <motion.div
      className="relative group"
      variants={scaleIn}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
          <div className="text-6xl">{stat.icon}</div>
        </div>
        
        {/* Gradient Border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        <div className="relative z-10">
          {/* Icon */}
          <motion.div 
            className="text-4xl mb-4"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {stat.icon}
          </motion.div>
          
          {/* Number */}
          <motion.div 
            className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              delay: index * 0.1 + 0.3 
            }}
            viewport={{ once: true }}
          >
            {stat.prefix}{inView ? count.toLocaleString() : 0}{stat.suffix}
          </motion.div>
          
          {/* Label */}
          <motion.div 
            className="text-xl font-semibold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
            viewport={{ once: true }}
          >
            {stat.label}
          </motion.div>
          
          {/* Description */}
          <motion.div 
            className="text-sm text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
            viewport={{ once: true }}
          >
            {stat.description}
          </motion.div>
        </div>
        
        {/* Hover Effect */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />
      </div>
    </motion.div>
  );
};

export default function StatsSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const stats = [
    {
      number: 500,
      suffix: "+",
      label: "People Helped",
      description: "Dedicated volunteers working for the community",
      color: "from-blue-500 to-blue-600",
      icon: "👥"
    },
    {
      number: 10,
      suffix: "L+",
      prefix: "₹",
      label: "Funds Raised",
      description: "Transparent utilization for community programs",
      color: "from-green-500 to-green-600",
      icon: "💰"
    },
    {
      number: 50,
      suffix: "+",
      label: "Programs Completed",
      description: "Successful initiatives across various sectors",
      color: "from-purple-500 to-purple-600",
      icon: "🎯"
    },
    {
      number: 10000,
      suffix: "+",
      label: "Lives Impacted",
      description: "Direct beneficiaries of our programs",
      color: "from-orange-500 to-orange-600",
      icon: "❤️"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Impact in 
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Numbers
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Every number represents real lives touched and communities transformed through our collective efforts.
          </motion.p>
        </motion.div>
        
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} inView={inView} />
          ))}
        </motion.div>
        
        {/* Progress Bars */}
        <motion.div
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Growth Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Community Satisfaction", percentage: 95, color: "bg-blue-500" },
              { label: "Program Success Rate", percentage: 88, color: "bg-green-500" },
              { label: "Community Reach", percentage: 92, color: "bg-purple-500" },
              { label: "Transparency Score", percentage: 98, color: "bg-orange-500" }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${item.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2 + 1 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-6">
            Want to be part of these amazing numbers? Join our mission today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Become a Volunteer
            </motion.a>
            <motion.a
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Make a Donation
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

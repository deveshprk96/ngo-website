'use client';

import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';
import { BookOpen, Heart, Leaf, Users, Target, Award, Globe } from 'lucide-react';

export default function AboutSection() {
  const focusAreas = [
    {
      icon: BookOpen,
      title: "Education",
      description: "Providing quality education and literacy programs",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Heart,
      title: "Healthcare",
      description: "Medical camps and health awareness programs",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Leaf,
      title: "Environment",
      description: "Tree plantation and clean environment initiatives",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Skill development and economic empowerment",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const achievements = [
    { icon: Target, title: "Mission Driven", description: "Clear goals and transparent operations" },
    { icon: Award, title: "Recognized Impact", description: "Certified and trusted by communities" },
    { icon: Globe, title: "Sustainable Approach", description: "Long-term solutions for lasting change" }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            variants={fadeInLeft}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                About{' '}
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Hope Foundation
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Established in 2024, Hope Foundation is a registered non-profit organization 
                dedicated to improving the lives of underprivileged communities through 
                sustainable development programs.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-900">Our Core Focus Areas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {focusAreas.map((area, index) => (
                  <motion.div
                    key={area.title}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start space-x-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <motion.div 
                        className={`w-12 h-12 ${area.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <area.icon className={`w-6 h-6 ${area.color}`} />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {area.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Achievements */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-gray-900">Why Choose Us</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <achievement.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Image/Visual */}
          <motion.div 
            className="relative"
            variants={fadeInRight}
          >
            {/* Main Image Container */}
            <motion.div 
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Floating Elements */}
              <motion.div 
                className="absolute top-6 right-6 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div 
                className="absolute bottom-6 left-6 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>

              {/* Central Content */}
              <div className="text-center space-y-6">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                    transition: { duration: 0.8 }
                  }}
                >
                  <Target className="w-12 h-12 text-white" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    To create sustainable positive change in communities through 
                    education, healthcare, environmental conservation, and social empowerment.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6">
                  <motion.div 
                    className="text-center p-4 bg-white rounded-xl shadow-sm"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-2xl font-bold text-blue-600">2024</div>
                    <div className="text-sm text-gray-600">Established</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-white rounded-xl shadow-sm"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Transparent</div>
                  </motion.div>
                </div>

                {/* Action Button */}
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More About Us
                </motion.button>
              </div>
            </motion.div>

            {/* Background Decorations */}
            <motion.div 
              className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-200 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

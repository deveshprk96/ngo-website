'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { UserPlus, Heart, HandHeart, Calendar } from 'lucide-react';

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [] as string[],
    interests: [] as string[],
    experience: '',
    motivation: '',
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('availability.')) {
        const availabilityKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          availability: {
            ...prev.availability,
            [availabilityKey]: checkbox.checked
          }
        }));
      } else if (name === 'interests' || name === 'skills') {
        setFormData(prev => ({
          ...prev,
          [name]: checkbox.checked 
            ? [...prev[name as keyof typeof prev] as string[], value]
            : (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
        }));
      }
    } else if (name.startsWith('emergencyContact.')) {
      const contactKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '',
          occupation: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          skills: [] as string[],
          interests: [] as string[],
          experience: '',
          motivation: '',
          availability: {
            weekdays: false,
            weekends: false,
            evenings: false
          },
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          }
        });
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Become a <span className="text-green-600">Volunteer</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join our community of dedicated volunteers and make a meaningful difference in the lives of others.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Volunteer Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Volunteer With Us?</h2>
              <p className="text-lg text-gray-600">Make a real impact while gaining valuable experience and connections</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Make a Difference",
                  description: "Directly impact lives and communities through meaningful work"
                },
                {
                  icon: UserPlus,
                  title: "Build Skills",
                  description: "Develop new skills and gain valuable experience in social work"
                },
                {
                  icon: HandHeart,
                  title: "Connect",
                  description: "Meet like-minded people and build lasting friendships"
                },
                {
                  icon: Calendar,
                  title: "Flexible Time",
                  description: "Choose volunteer opportunities that fit your schedule"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="text-center p-6 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h2>
              <p className="text-lg text-gray-600">Choose from various ways to contribute your time and skills</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Education Support",
                  description: "Help teach children and adults in our education programs",
                  timeCommitment: "2-4 hours per week",
                  skills: "Teaching, Patience, Communication"
                },
                {
                  title: "Healthcare Assistance",
                  description: "Support our medical camps and health awareness programs",
                  timeCommitment: "4-6 hours per month",
                  skills: "Healthcare background preferred"
                },
                {
                  title: "Event Organization",
                  description: "Help organize community events and fundraising activities",
                  timeCommitment: "Flexible timing",
                  skills: "Event planning, Coordination"
                },
                {
                  title: "Administrative Support",
                  description: "Assist with office work, data entry, and documentation",
                  timeCommitment: "3-5 hours per week",
                  skills: "Computer skills, Organization"
                },
                {
                  title: "Community Outreach",
                  description: "Help spread awareness about our programs in communities",
                  timeCommitment: "Weekends",
                  skills: "Communication, Local language"
                },
                {
                  title: "Digital Marketing",
                  description: "Manage social media and create content for our campaigns",
                  timeCommitment: "2-3 hours per week",
                  skills: "Social media, Content creation"
                }
              ].map((opportunity, index) => (
                <motion.div
                  key={opportunity.title}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{opportunity.title}</h3>
                  <p className="text-gray-600 mb-4">{opportunity.description}</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Time Commitment:</span> {opportunity.timeCommitment}</p>
                    <p><span className="font-medium">Skills Needed:</span> {opportunity.skills}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
              <p className="text-lg text-gray-600">Fill out the form below to start your volunteer journey</p>
            </motion.div>

            <motion.div
              className="bg-gray-50 p-8 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600">Thank you for your interest in volunteering with us. We'll review your application and get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        required
                        min="16"
                        max="80"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Mumbai"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Areas of Interest
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['Education Support', 'Healthcare Assistance', 'Event Organization', 'Administrative Support', 'Community Outreach', 'Digital Marketing'].map((interest) => (
                        <label key={interest} className="flex items-center">
                          <input
                            type="checkbox"
                            name="interests"
                            value={interest}
                            checked={formData.interests.includes(interest)}
                            onChange={handleInputChange}
                            className="mr-2 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Availability
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="availability.weekdays"
                          checked={formData.availability.weekdays}
                          onChange={handleInputChange}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Weekdays</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="availability.weekends"
                          checked={formData.availability.weekends}
                          onChange={handleInputChange}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Weekends</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="availability.evenings"
                          checked={formData.availability.evenings}
                          onChange={handleInputChange}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Evenings</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Relevant Experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={4}
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us about any relevant experience or skills you have..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to volunteer with us?
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      rows={3}
                      value={formData.motivation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us about your motivation to volunteer..."
                    ></textarea>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          id="emergencyContact.name"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="emergencyContact.phone"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          id="emergencyContact.relationship"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Father/Mother/Spouse"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Users, Clock, Filter } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  registeredParticipants: any[];
  maxParticipants?: number;
  isActive: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === 'upcoming') {
        params.append('upcoming', 'true');
      }
      
      const response = await fetch(`/api/events?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data); // API returns events directly, not data.events
        }
      } else {
        console.log('API response not ok, using demo events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      console.log('Using demo events due to error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  // Demo events if no events loaded
  const demoEvents = [
    {
      _id: '1',
      title: 'Community Health Camp',
      description: 'Free medical checkup and consultation for all community members. Our qualified doctors will provide basic health screening, blood pressure checks, and general health advice.',
      date: '2025-08-15',
      time: '9:00 AM',
      venue: 'Community Center, Mumbai',
      registeredParticipants: [],
      maxParticipants: 100,
      isActive: true
    },
    {
      _id: '2',
      title: 'Tree Plantation Drive',
      description: 'Join us in making our city greener. Plant trees and spread awareness about environmental conservation. Refreshments and saplings will be provided.',
      date: '2025-08-20',
      time: '7:00 AM',
      venue: 'Shivaji Park, Mumbai',
      registeredParticipants: [],
      maxParticipants: 50,
      isActive: true
    },
    {
      _id: '3',
      title: 'Education Workshop',
      description: 'Digital literacy workshop for underprivileged children and their parents. Learn basic computer skills and internet safety.',
      date: '2025-08-25',
      time: '2:00 PM',
      venue: 'Hope Foundation Center',
      registeredParticipants: [],
      maxParticipants: 30,
      isActive: true
    },
    {
      _id: '4',
      title: 'Women Empowerment Seminar',
      description: 'A comprehensive seminar on women rights, financial independence, and career development opportunities.',
      date: '2025-07-01',
      time: '10:00 AM',
      venue: 'Conference Hall, Mumbai',
      registeredParticipants: [],
      maxParticipants: 75,
      isActive: true
    }
  ];

  const displayEvents = events.length > 0 ? events : demoEvents;
  const filteredEvents = displayEvents.filter(event => {
    if (filter === 'upcoming') return isUpcoming(event.date);
    if (filter === 'past') return !isUpcoming(event.date);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Events
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us in our community events and be part of the positive change we're creating together.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>All Events</span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming</span>
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Past Events</span>
            </button>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isUpcoming(event.date)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isUpcoming(event.date) ? 'Upcoming' : 'Past'}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        {event.venue}
                      </div>
                      {event.maxParticipants && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          {event.registeredParticipants.length}/{event.maxParticipants} registered
                        </div>
                      )}
                    </div>
                    
                    {isUpcoming(event.date) ? (
                      <div className="flex flex-col space-y-2">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Register Now
                        </button>
                        <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                          Learn More
                        </button>
                      </div>
                    ) : (
                      <button className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                        Event Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600">
                {filter === 'upcoming' 
                  ? 'No upcoming events at the moment. Stay tuned for new announcements!'
                  : filter === 'past'
                  ? 'No past events to display.'
                  : 'No events available.'
                }
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-blue-600 text-white p-8 md:p-12 rounded-2xl text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated on Our Events
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't miss out on our community events. Join our newsletter or follow us on social media 
              to get notified about upcoming events and programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors">
                Subscribe to Newsletter
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition-colors">
                Follow Us on Social Media
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

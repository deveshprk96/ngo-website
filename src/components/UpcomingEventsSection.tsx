'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  registeredCount: number;
  maxParticipants?: number;
}

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/events?upcoming=true&limit=3');
      if (response.ok) {
        const data = await response.json();
        // Handle both old and new API response formats
        const eventsArray = Array.isArray(data) ? data : (data.events || []);
        setEvents(eventsArray);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Dummy events for demo
  const dummyEvents = [
    {
      _id: '1',
      title: 'Community Health Camp',
      description: 'Free medical checkup and consultation for all community participants.',
      date: '2025-08-15',
      time: '9:00 AM',
      venue: 'Community Center, Mumbai',
      registeredCount: 45,
      maxParticipants: 100
    },
    {
      _id: '2',
      title: 'Tree Plantation Drive',
      description: 'Join us in making our city greener. Plant trees and spread awareness about environmental conservation.',
      date: '2025-08-20',
      time: '7:00 AM',
      venue: 'Shivaji Park, Mumbai',
      registeredCount: 23,
      maxParticipants: 50
    },
    {
      _id: '3',
      title: 'Education Workshop',
      description: 'Digital literacy workshop for underprivileged children and their parents.',
      date: '2025-08-25',
      time: '2:00 PM',
      venue: 'Bawaliya Seva Sansthan Center',
      registeredCount: 18,
      maxParticipants: 30
    }
  ];

  const displayEvents = (events && events.length > 0) ? events : dummyEvents;

  if (loading && (!events || events.length === 0)) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join us in our upcoming events and be part of the positive change we're creating together.
          </p>
        </div>
        
        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                      Upcoming
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registeredCount}/{event.maxParticipants} interested
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/events/${event._id}`}
                      className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Learn More
                    </Link>
                    <Link
                      href="/donate"
                      className="w-full border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      Support Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600">Stay tuned for our exciting upcoming events!</p>
          </div>
        )}
        
        {displayEvents.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All Events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

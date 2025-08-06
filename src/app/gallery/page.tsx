'use client';

import { useState, useEffect } from 'react';
import { Camera, Video, Calendar, Users, Filter, Grid, List } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  eventId?: string;
  tags: string[];
  uploadedAt: Date;
  isPublic: boolean;
}

interface Event {
  _id: string;
  title: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedEvent, setSelectedEvent] = useState('all');

  // Demo gallery items
  const demoGalleryItems: GalleryItem[] = [
    {
      _id: '1',
      title: 'Tree Plantation Drive 2024',
      description: 'Community members planting trees in the village',
      mediaType: 'image',
      mediaUrl: '/api/placeholder/600/400',
      eventId: '1',
      tags: ['environment', 'community', 'plantation'],
      uploadedAt: new Date('2024-01-15'),
      isPublic: true
    },
    {
      _id: '2',
      title: 'Education Program Highlights',
      description: 'Children participating in our literacy program',
      mediaType: 'video',
      mediaUrl: '/api/placeholder/video/600/400',
      thumbnailUrl: '/api/placeholder/600/400',
      eventId: '2',
      tags: ['education', 'children', 'learning'],
      uploadedAt: new Date('2024-01-20'),
      isPublic: true
    },
    {
      _id: '3',
      title: 'Healthcare Camp Setup',
      description: 'Medical professionals setting up the health camp',
      mediaType: 'image',
      mediaUrl: '/api/placeholder/600/400',
      eventId: '3',
      tags: ['healthcare', 'medical', 'camp'],
      uploadedAt: new Date('2024-02-01'),
      isPublic: true
    },
    {
      _id: '4',
      title: 'Volunteer Training Session',
      description: 'New volunteers learning about our programs',
      mediaType: 'image',
      mediaUrl: '/api/placeholder/600/400',
      tags: ['volunteers', 'training', 'community'],
      uploadedAt: new Date('2024-02-10'),
      isPublic: true
    },
    {
      _id: '5',
      title: 'Food Distribution Drive',
      description: 'Distributing meals to underprivileged families',
      mediaType: 'video',
      mediaUrl: '/api/placeholder/video/600/400',
      thumbnailUrl: '/api/placeholder/600/400',
      eventId: '4',
      tags: ['food', 'distribution', 'help'],
      uploadedAt: new Date('2024-02-15'),
      isPublic: true
    },
    {
      _id: '6',
      title: 'Women Empowerment Workshop',
      description: 'Skills training for women in rural areas',
      mediaType: 'image',
      mediaUrl: '/api/placeholder/600/400',
      eventId: '5',
      tags: ['women', 'empowerment', 'skills'],
      uploadedAt: new Date('2024-02-20'),
      isPublic: true
    }
  ];

  const demoEvents: Event[] = [
    { _id: '1', title: 'Tree Plantation Drive' },
    { _id: '2', title: 'Education Program Launch' },
    { _id: '3', title: 'Healthcare Camp' },
    { _id: '4', title: 'Food Distribution' },
    { _id: '5', title: 'Women Empowerment Workshop' }
  ];

  useEffect(() => {
    // In a real app, fetch from API
    // fetchGalleryItems();
    // fetchEvents();
    
    // Using demo data
    setGalleryItems(demoGalleryItems);
    setEvents(demoEvents);
    setLoading(false);
  }, []);

  const filteredItems = galleryItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return item.mediaType === 'image';
    if (filter === 'videos') return item.mediaType === 'video';
    return true;
  }).filter(item => {
    if (selectedEvent === 'all') return true;
    return item.eventId === selectedEvent;
  });

  const getEventTitle = (eventId?: string) => {
    if (!eventId) return 'General';
    const event = events.find(e => e._id === eventId);
    return event?.title || 'Unknown Event';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo & Video Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore moments from our impactful initiatives and witness the positive change we're creating together
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Media Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('images')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    filter === 'images'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  Photos
                </button>
                <button
                  onClick={() => setFilter('videos')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    filter === 'videos'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Videos
                </button>
              </div>
            </div>

            {/* Event Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'masonry'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more content.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Media Display */}
                <div className="relative aspect-video bg-gray-200">
                  {item.mediaType === 'image' ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={item.thumbnailUrl || item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <Video className="h-8 w-8 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      item.mediaType === 'image'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.mediaType === 'image' ? (
                        <Camera className="h-3 w-3" />
                      ) : (
                        <Video className="h-3 w-3" />
                      )}
                      {item.mediaType === 'image' ? 'Photo' : 'Video'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  {/* Event Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{getEventTitle(item.eventId)}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Upload Date */}
                  <div className="text-xs text-gray-500">
                    {item.uploadedAt.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {galleryItems.filter(item => item.mediaType === 'image').length}
              </div>
              <div className="text-gray-600">Photos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {galleryItems.filter(item => item.mediaType === 'video').length}
              </div>
              <div className="text-gray-600">Videos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {events.length}
              </div>
              <div className="text-gray-600">Events Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {galleryItems.reduce((acc, item) => acc + item.tags.length, 0)}
              </div>
              <div className="text-gray-600">Total Tags</div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, MessageSquare, Share2, Bookmark, Search, Filter, ChevronRight } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  category: 'announcement' | 'news' | 'event' | 'success-story' | 'volunteer';
  tags: string[];
  featured: boolean;
  publishedAt: Date;
  updatedAt: Date;
  status: 'published' | 'draft';
  views: number;
  likes: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'featured'>('latest');

  // Demo posts data
  const demoPosts: Post[] = [
    {
      _id: '1',
      title: 'New Education Center Opening in Rural Maharashtra',
      content: `We are thrilled to announce the opening of our 5th education center in rural Maharashtra. This new facility will serve over 200 children in the region, providing quality education and skill development programs.

The center features:
- Modern classrooms with digital learning tools
- Computer lab with 20 systems
- Library with over 1000 books
- Science laboratory
- Skill development workshop area

Special thanks to our donors and volunteers who made this possible. The inauguration ceremony will be held on March 15th, 2024.`,
      summary: 'Our new education center in Maharashtra will serve 200+ children with modern facilities and comprehensive learning programs.',
      author: 'Dr. Amita Patel',
      category: 'announcement',
      tags: ['education', 'rural-development', 'children', 'infrastructure'],
      featured: true,
      publishedAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-02-25'),
      status: 'published',
      views: 1250,
      likes: 89
    },
    {
      _id: '2',
      title: 'Success Story: From Beneficiary to Teacher',
      content: `Meet Priya Sharma, who joined our education program 10 years ago as a shy 8-year-old from a underprivileged background. Today, she is a qualified teacher working at our education center in Gujarat.

Priya's journey is a testament to the power of education and determination. After completing her schooling through our program, she received a scholarship for higher education and graduated with a B.Ed degree.

"Hope Foundation didn't just educate me, they believed in me when no one else did," says Priya. She now teaches 45 children and is pursuing her master's degree.

This is the impact we strive for - creating a cycle of empowerment that transforms entire communities.`,
      summary: 'Former beneficiary Priya Sharma becomes a teacher, showcasing the transformative power of education and our programs.',
      author: 'Meera Reddy',
      category: 'success-story',
      tags: ['success-story', 'education', 'empowerment', 'teacher'],
      featured: true,
      publishedAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20'),
      status: 'published',
      views: 2100,
      likes: 156
    },
    {
      _id: '3',
      title: 'Volunteer Recruitment Drive - March 2024',
      content: `Join our mission to create positive change! We are looking for passionate volunteers to join our various programs across different locations.

Current openings:
- Teaching volunteers for education centers
- Healthcare assistants for medical camps
- Environmental coordinators for tree plantation drives
- Social media volunteers for awareness campaigns
- Event coordinators for fundraising activities

Requirements:
- Commitment of minimum 10 hours per month
- Passion for social service
- Basic communication skills
- Willingness to travel to rural areas (for field volunteers)

Benefits:
- Certificate of volunteer service
- Training and skill development
- Opportunity to make real impact
- Networking with like-minded people

Apply by filling out our online form or visiting our office. Training starts from March 10th, 2024.`,
      summary: 'Join our volunteer team! Multiple opportunities available across education, healthcare, environment, and event coordination.',
      author: 'Rajesh Gupta',
      category: 'volunteer',
      tags: ['volunteers', 'recruitment', 'training', 'opportunities'],
      featured: false,
      publishedAt: new Date('2024-02-18'),
      updatedAt: new Date('2024-02-18'),
      status: 'published',
      views: 850,
      likes: 67
    },
    {
      _id: '4',
      title: 'Monthly Health Camp Schedule - March 2024',
      content: `We are organizing free health camps across 15 villages in March 2024. These camps will provide basic health checkups, medicines, and health awareness sessions.

Schedule:
- March 5: Rampur Village (9 AM - 5 PM)
- March 8: Sundarpur Village (9 AM - 5 PM)
- March 12: Krishnanagar Village (9 AM - 5 PM)
- March 15: Gokulpur Village (9 AM - 5 PM)
- March 19: Shivpuri Village (9 AM - 5 PM)
- March 22: Hanumanganj Village (9 AM - 5 PM)
- March 26: Raghunathpur Village (9 AM - 5 PM)
- March 29: Bankebihari Village (9 AM - 5 PM)

Services include:
- General health checkup
- Blood pressure monitoring
- Blood sugar testing
- Eye examination
- Basic medicines distribution
- Health awareness sessions

All services are completely free. Please bring your identification documents.`,
      summary: 'Free health camps scheduled for March 2024 across 15 villages with comprehensive medical services.',
      author: 'Dr. Vikram Shah',
      category: 'event',
      tags: ['healthcare', 'medical-camp', 'free-service', 'rural-health'],
      featured: false,
      publishedAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
      status: 'published',
      views: 1400,
      likes: 92
    },
    {
      _id: '5',
      title: 'Annual Report 2023-24 Released',
      content: `We are pleased to share our Annual Report for 2023-24, highlighting our achievements, challenges, and impact over the past year.

Key Achievements:
- Served 5,000+ beneficiaries across 50 villages
- Established 3 new education centers
- Conducted 120 health camps
- Planted 10,000 trees
- Trained 200 women in skill development
- Provided scholarships to 150 students

Financial Transparency:
- Total funds raised: ₹2.5 crores
- Program expenses: 85%
- Administrative costs: 10%
- Fundraising costs: 5%

Download the complete report from our website or collect a physical copy from our office. We thank all our donors, volunteers, and partners for their continued support.`,
      summary: 'Our 2023-24 Annual Report showcases significant achievements including 5000+ beneficiaries served and complete financial transparency.',
      author: 'Sunita Singh',
      category: 'news',
      tags: ['annual-report', 'achievements', 'transparency', 'impact'],
      featured: true,
      publishedAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      status: 'published',
      views: 1800,
      likes: 134
    },
    {
      _id: '6',
      title: 'Environment Day Celebration - Tree Plantation Drive',
      content: `Join us for World Environment Day celebration on June 5th, 2024, with a massive tree plantation drive across 10 locations.

Event Details:
- Date: June 5, 2024
- Time: 7:00 AM - 11:00 AM
- Locations: 10 villages in Maharashtra and Gujarat
- Target: Plant 2,000 saplings in one day

Registration:
- Online registration mandatory
- Registration fee: ₹100 (includes sapling and refreshments)
- Group discounts available for 10+ participants
- Students get 50% discount with valid ID

What we provide:
- Saplings and planting materials
- Expert guidance on plantation
- Breakfast and refreshments
- Certificate of participation
- GPS coordinates for future monitoring

Register now and be part of this green initiative! Limited slots available.`,
      summary: 'World Environment Day tree plantation drive on June 5th - join us to plant 2000 saplings across 10 locations.',
      author: 'Arjun Kumar',
      category: 'event',
      tags: ['environment', 'tree-plantation', 'world-environment-day', 'green-initiative'],
      featured: false,
      publishedAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-02-08'),
      status: 'published',
      views: 950,
      likes: 78
    }
  ];

  useEffect(() => {
    // In a real app, fetch from API
    // fetchPosts();
    
    // Using demo data
    setPosts(demoPosts);
    setLoading(false);
  }, []);

  const categories = [
    { value: 'all', label: 'All Posts', count: posts.length },
    { value: 'announcement', label: 'Announcements', count: posts.filter(p => p.category === 'announcement').length },
    { value: 'news', label: 'News', count: posts.filter(p => p.category === 'news').length },
    { value: 'event', label: 'Events', count: posts.filter(p => p.category === 'event').length },
    { value: 'success-story', label: 'Success Stories', count: posts.filter(p => p.category === 'success-story').length },
    { value: 'volunteer', label: 'Volunteer Opportunities', count: posts.filter(p => p.category === 'volunteer').length }
  ];

  const filteredPosts = posts
    .filter(post => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
      if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !post.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  const getCategoryColor = (category: string) => {
    const colors = {
      'announcement': 'bg-blue-100 text-blue-800',
      'news': 'bg-green-100 text-green-800',
      'event': 'bg-purple-100 text-purple-800',
      'success-story': 'bg-yellow-100 text-yellow-800',
      'volunteer': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Announcements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest news, announcements, success stories, and volunteer opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, announcements, news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'featured')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {/* Featured Posts */}
            {filteredPosts.filter(post => post.featured).length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  {filteredPosts.filter(post => post.featured).map(post => (
                    <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                            {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <div className="text-sm text-gray-500">
                            {post.publishedAt.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {post.views} views
                            </div>
                          </div>
                          
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                            Read More
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCategory === 'all' ? 'All Posts' : categories.find(c => c.value === selectedCategory)?.label}
              </h2>
              <div className="space-y-6">
                {filteredPosts.filter(post => selectedCategory === 'all' || !post.featured).map(post => (
                  <article key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(post.category)}`}>
                              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {post.featured && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-md">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.publishedAt.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.summary}</p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{post.tags.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {post.views} views
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-gray-600">Total Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {posts.filter(p => p.featured).length}
              </div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {posts.reduce((acc, post) => acc + post.views, 0)}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {posts.reduce((acc, post) => acc + post.likes, 0)}
              </div>
              <div className="text-gray-600">Total Likes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

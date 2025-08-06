'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  FileText, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User
} from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  type: 'notice' | 'blog' | 'announcement';
  author: string;
  image?: string;
  tags: string[];
  isPublished: boolean;
  isPinned: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostsManagement() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // New post form state
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: session?.user?.name || 'Admin',
    category: 'news' as Post['category'],
    status: 'draft' as Post['status'],
    featuredImage: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !session.user?.role || !['admin', 'super_admin', 'moderator'].includes(session.user.role)) {
      redirect('/admin/login');
    }

    fetchPosts();
  }, [session, status]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        const postsArray = Array.isArray(data) ? data : data.posts || [];
        setPosts(postsArray);
        setFilteredPosts(postsArray);
      } else {
        // Use demo data if API fails
        const demoPosts: Post[] = [
          {
            _id: '1',
            title: 'Community Health Camp Success',
            content: 'Our recent health camp was a great success with over 200 people receiving free checkups.',
            excerpt: 'Over 200 people received free medical checkups at our recent community health camp.',
            author: 'Admin',
            category: 'news',
            status: 'published',
            publishedAt: '2025-08-01',
            createdAt: '2025-08-01',
            updatedAt: '2025-08-01'
          },
          {
            _id: '2',
            title: 'New Education Program Launch',
            content: 'We are excited to announce the launch of our new digital literacy program.',
            excerpt: 'New digital literacy program launched for underprivileged children.',
            author: 'Admin',
            category: 'announcement',
            status: 'published',
            publishedAt: '2025-07-28',
            createdAt: '2025-07-28',
            updatedAt: '2025-07-28'
          }
        ];
        setPosts(demoPosts);
        setFilteredPosts(demoPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use demo data on error
      const demoPosts: Post[] = [
        {
          _id: '1',
          title: 'Community Health Camp Success',
          content: 'Our recent health camp was a great success with over 200 people receiving free checkups.',
          excerpt: 'Over 200 people received free medical checkups at our recent community health camp.',
          author: 'Admin',
          category: 'news',
          status: 'published',
          publishedAt: '2025-08-01',
          createdAt: '2025-08-01',
          updatedAt: '2025-08-01'
        }
      ];
      setPosts(demoPosts);
      setFilteredPosts(demoPosts);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and filters
  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, statusFilter, categoryFilter]);

  const handleAddPost = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postForm,
          publishedAt: postForm.status === 'published' ? new Date().toISOString() : null
        })
      });

      if (response.ok) {
        fetchPosts();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const resetForm = () => {
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      author: session?.user?.name || 'Admin',
      category: 'news',
      status: 'draft',
      featuredImage: ''
    });
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Posts & News Management</h1>
          <p className="mt-2 text-gray-600">Create and manage news posts, announcements, and stories</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="news">News</option>
                <option value="announcement">Announcement</option>
                <option value="story">Story</option>
                <option value="update">Update</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Post
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {post.featuredImage && (
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first post</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Post
            </button>
          </div>
        )}
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Post</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value as Post['category']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                    <option value="story">Story</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={postForm.status}
                    onChange={(e) => setPostForm({...postForm, status: e.target.value as Post['status']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

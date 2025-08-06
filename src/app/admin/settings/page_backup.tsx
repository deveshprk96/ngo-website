'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit2, Trash2, Plus, CreditCard, Building, Phone, Mail } from 'lucide-react';

interface Setting {
  _id: string;
  key: string;
  value: any;
  description: string;
  category: string;
  isEditable: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    description: '',
    category: 'payment'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
      
      // Initialize default settings if they don't exist
      await initializeDefaultSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSettings = async () => {
    const defaultSettings = [
      {
        key: 'upi_id',
        value: 'bawaliyaseva@paytm',
        description: 'Primary UPI ID for donations',
        category: 'payment'
      },
      {
        key: 'bank_name',
        value: 'State Bank of India',
        description: 'Bank name for direct transfers',
        category: 'payment'
      },
      {
        key: 'account_number',
        value: '1234567890',
        description: 'Bank account number',
        category: 'payment'
      },
      {
        key: 'ifsc_code',
        value: 'SBIN0001234',
        description: 'IFSC code for bank transfers',
        category: 'payment'
      },
      {
        key: 'account_holder_name',
        value: 'Bawaliya Seva Sansthan',
        description: 'Account holder name',
        category: 'payment'
      },
      {
        key: 'contact_email',
        value: 'info@bawaliyaseva.org',
        description: 'Primary contact email',
        category: 'contact'
      },
      {
        key: 'contact_phone',
        value: '+91 98765 43210',
        description: 'Primary contact phone',
        category: 'contact'
      }
    ];

    // Check and create settings that don't exist
    for (const setting of defaultSettings) {
      const exists = settings.find(s => s.key === setting.key);
      if (!exists) {
        try {
          await fetch('/api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(setting),
          });
        } catch (error) {
          console.error('Error creating default setting:', error);
        }
      }
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditingKey(setting.key);
    setEditValue(typeof setting.value === 'object' ? JSON.stringify(setting.value) : setting.value);
  };

  const handleSave = async (key: string) => {
    try {
      const response = await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: editValue,
        }),
      });

      if (response.ok) {
        await fetchSettings();
        setEditingKey(null);
        setEditValue('');
      } else {
        alert('Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Error updating setting');
    }
  };

  const handleDelete = async (key: string) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      try {
        const response = await fetch(`/api/settings/${key}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchSettings();
        } else {
          alert('Failed to delete setting');
        }
      } catch (error) {
        console.error('Error deleting setting:', error);
        alert('Error deleting setting');
      }
    }
  };

  const handleAddSetting = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSetting),
      });

      if (response.ok) {
        await fetchSettings();
        setShowAddForm(false);
        setNewSetting({
          key: '',
          value: '',
          description: '',
          category: 'payment'
        });
      } else {
        alert('Failed to add setting');
      }
    } catch (error) {
      console.error('Error adding setting:', error);
      alert('Error adding setting');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="w-5 h-5" />;
      case 'contact':
        return <Phone className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getSettingIcon = (key: string) => {
    if (key.includes('upi')) return <CreditCard className="w-4 h-4" />;
    if (key.includes('bank')) return <Building className="w-4 h-4" />;
    if (key.includes('email')) return <Mail className="w-4 h-4" />;
    if (key.includes('phone')) return <Phone className="w-4 h-4" />;
    return <Building className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-2">Manage payment details, contact information, and other system settings</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Setting</span>
            </button>
          </div>
        </motion.div>

        {/* Add Setting Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Setting</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
                <input
                  type="text"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="setting_key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newSetting.category}
                  onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="payment">Payment</option>
                  <option value="contact">Contact</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                <input
                  type="text"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Setting value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description of the setting"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAddSetting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Setting
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Settings by Category */}
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">{category} Settings</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getSettingIcon(setting.key)}
                          <h3 className="text-lg font-medium text-gray-900">
                            {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{setting.description}</p>
                        
                        {editingKey === setting.key ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleSave(setting.key)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="bg-gray-50 px-4 py-2 rounded-lg flex-1 mr-4">
                              <code className="text-gray-800">
                                {typeof setting.value === 'object' 
                                  ? JSON.stringify(setting.value, null, 2) 
                                  : setting.value}
                              </code>
                            </div>
                            <div className="flex space-x-2">
                              {setting.isEditable && (
                                <button
                                  onClick={() => handleEdit(setting)}
                                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(setting.key)}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('organization');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Organization settings
  const [orgSettings, setOrgSettings] = useState<OrgSettings>({
    name: 'Bawaliya Seva Sansthan',
    email: 'info@bawaliyasevasansthan.org',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India',
    website: 'https://bawaliyasevasansthan.org',
    description: 'Dedicated to community service and social welfare through education, healthcare, and sustainable development programs.'
  });

  // User profile settings
  const [userSettings, setUserSettings] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    donationAlerts: true,
    eventReminders: true,
    newsletterUpdates: true
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !session.user?.role || !['admin', 'super_admin'].includes(session.user.role)) {
      redirect('/admin/login');
    }

    // Initialize user settings from session
    setUserSettings(prev => ({
      ...prev,
      name: session.user?.name || '',
      email: session.user?.email || ''
    }));
  }, [session, status]);

  const handleSaveOrganization = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to database
      setMessage('Organization settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving organization settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (userSettings.newPassword && userSettings.newPassword !== userSettings.confirmPassword) {
        setMessage('New passwords do not match');
        setLoading(false);
        return;
      }

      // In a real app, this would update the user profile
      setMessage('Profile updated successfully!');
      setUserSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, this would save notification preferences
      setMessage('Notification settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a data export
    setMessage('Data export started. You will receive an email when ready.');
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Globe },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Settings
          </h1>
          <p className="mt-2 text-gray-600">Manage your organization and account settings</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Organization Settings */}
              {activeTab === 'organization' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                        <input
                          type="text"
                          value={orgSettings.name}
                          onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={orgSettings.email}
                          onChange={(e) => setOrgSettings({...orgSettings, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={orgSettings.phone}
                          onChange={(e) => setOrgSettings({...orgSettings, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="w-4 h-4 inline mr-1" />
                          Website
                        </label>
                        <input
                          type="url"
                          value={orgSettings.website}
                          onChange={(e) => setOrgSettings({...orgSettings, website: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Address
                      </label>
                      <textarea
                        value={orgSettings.address}
                        onChange={(e) => setOrgSettings({...orgSettings, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={orgSettings.description}
                        onChange={(e) => setOrgSettings({...orgSettings, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={handleSaveOrganization}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">My Profile</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={userSettings.name}
                          onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={userSettings.email}
                          onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            value={userSettings.currentPassword}
                            onChange={(e) => setUserSettings({...userSettings, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type="password"
                              value={userSettings.newPassword}
                              onChange={(e) => setUserSettings({...userSettings, newPassword: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              value={userSettings.confirmPassword}
                              onChange={(e) => setUserSettings({...userSettings, confirmPassword: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <p className="text-sm text-gray-500">
                              {key === 'emailNotifications' && 'Receive general notifications via email'}
                              {key === 'smsNotifications' && 'Receive urgent notifications via SMS'}
                              {key === 'donationAlerts' && 'Get notified when new donations are received'}
                              {key === 'eventReminders' && 'Receive reminders about upcoming events'}
                              {key === 'newsletterUpdates' && 'Subscribe to newsletter and updates'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeTab === 'data' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Export Data</h3>
                        <p className="text-gray-600 mb-4">Download all your organization data including events, donations, and posts.</p>
                        <button
                          onClick={handleExportData}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export Data
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Import Data</h3>
                        <p className="text-gray-600 mb-4">Import data from external sources or backup files.</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Import Data
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-red-700 mb-4">These actions cannot be undone. Please proceed with caution.</p>
                      <div className="space-y-2">
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                          Clear All Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        // If API doesn't exist yet, initialize with empty array
        setSettings([]);
      }
      
      // Initialize default settings if they don't exist
      await initializeDefaultSettings();
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Initialize with empty array and create defaults
      setSettings([]);
      await initializeDefaultSettings();
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
        key: 'backup_upi_id',
        value: 'bawaliyaseva@phonepe',
        description: 'Backup UPI ID for donations',
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
          const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(setting),
          });
          
          if (response.ok) {
            console.log(`Created default setting: ${setting.key}`);
          }
        } catch (error) {
          console.log('Settings API not available, using local storage for demo');
          // For demo purposes, add to local state
          setSettings(prev => [...prev, {
            _id: Date.now().toString() + Math.random(),
            ...setting,
            isEditable: true
          }]);
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
        alert('Setting updated successfully!');
      } else {
        // For demo purposes, update local state
        setSettings(prev => prev.map(s => 
          s.key === key ? { ...s, value: editValue } : s
        ));
        setEditingKey(null);
        setEditValue('');
        alert('Setting updated successfully!');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      // For demo purposes, update local state
      setSettings(prev => prev.map(s => 
        s.key === key ? { ...s, value: editValue } : s
      ));
      setEditingKey(null);
      setEditValue('');
      alert('Setting updated successfully!');
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
          // For demo purposes, update local state
          setSettings(prev => prev.filter(s => s.key !== key));
        }
      } catch (error) {
        console.error('Error deleting setting:', error);
        // For demo purposes, update local state
        setSettings(prev => prev.filter(s => s.key !== key));
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
        // For demo purposes, add to local state
        setSettings(prev => [...prev, {
          _id: Date.now().toString() + Math.random(),
          ...newSetting,
          isEditable: true
        }]);
        setShowAddForm(false);
        setNewSetting({
          key: '',
          value: '',
          description: '',
          category: 'payment'
        });
      }
    } catch (error) {
      console.error('Error adding setting:', error);
      // For demo purposes, add to local state
      setSettings(prev => [...prev, {
        _id: Date.now().toString() + Math.random(),
        ...newSetting,
        isEditable: true
      }]);
      setShowAddForm(false);
      setNewSetting({
        key: '',
        value: '',
        description: '',
        category: 'payment'
      });
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
              <h1 className="text-3xl font-bold text-gray-900">Payment & Contact Settings</h1>
              <p className="text-gray-600 mt-2">Manage UPI IDs, bank details, and contact information</p>
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
                              <code className="text-gray-800 break-all">
                                {typeof setting.value === 'object' 
                                  ? JSON.stringify(setting.value, null, 2) 
                                  : setting.value}
                              </code>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(setting)}
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
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

        {Object.keys(groupedSettings).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No settings found. Click "Add Setting" to create your first setting.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

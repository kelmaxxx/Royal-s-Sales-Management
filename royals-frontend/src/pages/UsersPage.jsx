import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Shield, Mail, Phone, X } from 'lucide-react';
import { usersAPI } from '../services/api';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    password: '',
    status: 'Active',
  });

  // Initial users data
  const initialUsers = [
    {
      id: 1,
      name: 'Kelmaxxx',
      email: 'admin@royalsales.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      joinDate: 'Jan 15, 2023',
      avatar: 'HK',
      avatarColor: 'bg-blue-600',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@royalsales.com',
      phone: '+1 (555) 234-5678',
      role: 'Staff',
      status: 'Active',
      joinDate: 'Mar 20, 2023',
      avatar: 'SJ',
      avatarColor: 'bg-emerald-600',
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.c@royalsales.com',
      phone: '+1 (555) 345-6789',
      role: 'Staff',
      status: 'Active',
      joinDate: 'May 10, 2023',
      avatar: 'MC',
      avatarColor: 'bg-purple-600',
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily.b@royalsales.com',
      phone: '+1 (555) 456-7890',
      role: 'Staff',
      status: 'Active',
      joinDate: 'Jul 05, 2023',
      avatar: 'EB',
      avatarColor: 'bg-pink-600',
    },
    {
      id: 5,
      name: 'David Miller',
      email: 'david.m@royalsales.com',
      phone: '+1 (555) 567-8901',
      role: 'Staff',
      status: 'Inactive',
      joinDate: 'Sep 12, 2023',
      avatar: 'DM',
      avatarColor: 'bg-gray-600',
    },
  ];

  // Users data from API
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usersAPI.getAll();
      // Map is_active to status for frontend
      const usersWithStatus = data.map(user => ({
        ...user,
        status: user.is_active ? 'Active' : 'Inactive'
      }));
      setUsers(usersWithStatus);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate random avatar color
  const getAvatarColor = () => {
    const colors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-red-600',
      'bg-yellow-600',
      'bg-teal-600',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      // Prevent editing admin users
      if (user.role === 'Admin') {
        alert('Cannot edit Admin users. Only Staff accounts can be modified.');
        return;
      }
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: '',
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Staff', // Always Staff for new users
        password: '',
        status: 'Active',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Staff',
      password: '',
      status: 'Active',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };

      // Include is_active when editing
      if (editingUser) {
        userData.is_active = formData.status === 'Active' ? 1 : 0;
      }

      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        // Update existing user
        await usersAPI.update(editingUser.id, userData);
      } else {
        // Add new user (requires password)
        if (!formData.password) {
          alert('Password is required for new users');
          return;
        }
        userData.username = formData.email.split('@')[0]; // Use email prefix as username
        await usersAPI.create(userData);
      }
      
      await fetchUsers(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    
    // Prevent deleting admin users
    if (userToDelete && userToDelete.role === 'Admin') {
      alert('Cannot delete Admin users. Only Staff accounts can be removed.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(userId);
        await fetchUsers(); // Refresh the list
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      const is_active = newStatus === 'Active' ? 1 : 0;

      // Update on backend
      await usersAPI.update(userId, {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: is_active
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: newStatus, is_active: is_active }
          : u
      ));
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Users from API:', users);
  console.log('Filtered users:', filteredUsers);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-gold mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage staff and administrator accounts</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Staff User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Users</h3>
          <p className="text-3xl font-bold text-gray-800">
            {users.filter((u) => u.status === 'Active').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-accent-gold" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Staff</h3>
          <p className="text-3xl font-bold text-gray-800">
            {users.filter((u) => u.role === 'Staff').length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${user.avatarColor} rounded-full flex items-center justify-center text-white font-bold`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone || 'No phone'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit ${
                        user.role === 'Admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role === 'Admin' ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className={`p-2 rounded-lg transition-all ${
                          user.role === 'Admin'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-dark text-white hover:bg-slate-700'
                        }`}
                        title={user.role === 'Admin' ? 'Cannot edit Admin users' : 'Edit user'}
                        disabled={user.role === 'Admin'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className={`p-2 rounded-lg transition-all ${
                          user.role === 'Admin'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                        title={user.role === 'Admin' ? 'Cannot delete Admin users' : 'Delete user'}
                        disabled={user.role === 'Admin'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingUser ? 'Edit Staff User' : 'Add New Staff User'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingUser ? 'Modify staff member details' : 'Create a new staff account'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="Enter email"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Role - Fixed to Staff only */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value="Staff"
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only Staff accounts can be created. Admin role is reserved for system administrators.
                  </p>
                </div>

                {/* Status */}
                {editingUser && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                )}

                {/* Password */}
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                      placeholder="Enter password"
                    />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-dark text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

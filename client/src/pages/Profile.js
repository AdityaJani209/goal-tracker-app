import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Settings, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  const { register: registerPreferences, handleSubmit: handlePreferencesSubmit } = useForm({
    defaultValues: {
      theme: user?.preferences?.theme || 'light',
      emailNotifications: user?.preferences?.notifications?.email || true,
      reminderNotifications: user?.preferences?.notifications?.reminders || true
    }
  });

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(data);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const onPreferencesSubmit = async (data) => {
    try {
      setLoading(true);
      const preferences = {
        theme: data.theme,
        notifications: {
          email: data.emailNotifications,
          reminders: data.reminderNotifications
        }
      };
      const response = await authAPI.updateProfile({ preferences });
      updateUser(response.data.user);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
                
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="label">Profile Picture</label>
                    <div className="flex items-center space-x-6">
                      <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <div>
                        <input
                          type="url"
                          placeholder="Avatar URL (optional)"
                          className="input"
                          {...registerProfile('avatar')}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a URL to your profile picture
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="input"
                      {...registerProfile('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-danger-600">{profileErrors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        className="input pl-10"
                        {...registerProfile('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-danger-600">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>
                
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="label">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="currentPassword"
                        className="input pr-10"
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required'
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-danger-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="label">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        className="input pr-10"
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-danger-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Preferences</h3>
                
                <form onSubmit={handlePreferencesSubmit(onPreferencesSubmit)} className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="label">Theme</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="light"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          {...registerPreferences('theme')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Light</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="dark"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          {...registerPreferences('theme')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Dark</span>
                      </label>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <label className="label">Notifications</label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          {...registerPreferences('emailNotifications')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          {...registerPreferences('reminderNotifications')}
                        />
                        <span className="ml-2 text-sm text-gray-700">Goal reminders</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

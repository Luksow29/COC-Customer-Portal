import React, { useState } from 'react';
import { User, Mail, Building, Phone, MapPin, Lock, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company_name: user?.company_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    billing_address: user?.billing_address || '',
    shipping_address: user?.shipping_address || '',
    secondary_phone: user?.secondary_phone || '',
    notifications: {
      email: true,
      sms: false,
      orderUpdates: true,
      marketing: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checkbox.checked
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
    setIsLoading(true);
    
    try {
      const updateData = {
        name: formData.name,
        company_name: formData.company_name || null,
        phone: formData.phone,
        address: formData.address || null,
        billing_address: formData.billing_address || null,
        shipping_address: formData.shipping_address || null,
        secondary_phone: formData.secondary_phone || null,
      };

      await updateProfile(updateData);
      setIsEditing(false);
      
      // Show success message (you could use a toast library here)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      company_name: user?.company_name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      billing_address: user?.billing_address || '',
      shipping_address: user?.shipping_address || '',
      secondary_phone: user?.secondary_phone || '',
      notifications: {
        email: true,
        sms: false,
        orderUpdates: true,
        marketing: false
      }
    });
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                loading={isLoading}
                form="profile-form"
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-300 hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {user?.company_name && (
                <p className="text-sm text-gray-500">{user?.company_name}</p>
              )}
            </div>
          </Card>

          {/* Account Stats */}
          <Card className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Account Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium">{user?.total_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent:</span>
                <span className="font-medium">{formatCurrency(user?.total_spent || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">
                  {user?.joined_date ? new Date(user.joined_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h3>
            <form id="profile-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<User className="h-5 w-5" />}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email is managed by Supabase auth
                    icon={<Mail className="h-5 w-5" />}
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                </div>
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <Input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<Building className="h-5 w-5" />}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<Phone className="h-5 w-5" />}
                  />
                </div>
                <div>
                  <label htmlFor="secondary_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Phone
                  </label>
                  <Input
                    id="secondary_phone"
                    name="secondary_phone"
                    type="tel"
                    value={formData.secondary_phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<Phone className="h-5 w-5" />}
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`
                        block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm
                        ${!isEditing ? 'bg-gray-50 text-gray-500' : 'focus:border-blue-500 focus:ring-blue-500'}
                      `}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <textarea
                      id="billing_address"
                      name="billing_address"
                      rows={3}
                      value={formData.billing_address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Same as address if left blank"
                      className={`
                        block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm
                        ${!isEditing ? 'bg-gray-50 text-gray-500' : 'focus:border-blue-500 focus:ring-blue-500'}
                      `}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <textarea
                      id="shipping_address"
                      name="shipping_address"
                      rows={3}
                      value={formData.shipping_address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Same as address if left blank"
                      className={`
                        block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm
                        ${!isEditing ? 'bg-gray-50 text-gray-500' : 'focus:border-blue-500 focus:ring-blue-500'}
                      `}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  name="email"
                  checked={formData.notifications.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  name="sms"
                  checked={formData.notifications.sms}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Order Updates</h4>
                  <p className="text-sm text-gray-500">Get notified about order status changes</p>
                </div>
                <input
                  type="checkbox"
                  name="orderUpdates"
                  checked={formData.notifications.orderUpdates}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                  <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                </div>
                <input
                  type="checkbox"
                  name="marketing"
                  checked={formData.notifications.marketing}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-500">Manage your account password</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
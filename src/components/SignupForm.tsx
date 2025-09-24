import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SignupFormProps {
  userType: 'student' | 'employer' | 'hostel-admin';
  onBack: () => void;
  onSignup: (userData: any) => void;
}

export function SignupForm({ userType, onBack, onSignup }: SignupFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    id: '',
    password: '',
    confirmPassword: '',
    // Additional fields based on user type
    companyName: '',
    hostelName: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSignup(formData);
  };

  const getTitle = () => {
    switch (userType) {
      case 'student':
        return 'Sign up (For Students)';
      case 'employer':
        return 'Sign up (For Employers)';
      case 'hostel-admin':
        return 'Sign up (For Hostel Admins)';
      default:
        return 'Sign up';
    }
  };

  const getIdLabel = () => {
    switch (userType) {
      case 'student':
        return 'Student ID';
      case 'employer':
        return 'Company ID';
      case 'hostel-admin':
        return 'Admin ID';
      default:
        return 'ID';
    }
  };

  const getEmailLabel = () => {
    switch (userType) {
      case 'student':
        return 'School email';
      case 'employer':
        return 'Company email';
      case 'hostel-admin':
        return 'Admin email';
      default:
        return 'Email';
    }
  };

  const getEmailPlaceholder = () => {
    switch (userType) {
      case 'student':
        return 'example@student.edu.gh';
      case 'employer':
        return 'example@company.com';
      case 'hostel-admin':
        return 'admin@hostel.com';
      default:
        return 'example@email.com';
    }
  };

  const getIdPlaceholder = () => {
    switch (userType) {
      case 'student':
        return '2023001';
      case 'employer':
        return 'EMP001';
      case 'hostel-admin':
        return 'ADM001';
      default:
        return 'Enter ID';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center p-6 relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Signup Card */}
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">{getTitle()}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Input full name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {getEmailLabel()}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={getEmailPlaceholder()}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
              {getIdLabel()}
            </label>
            <Input
              id="id"
              type="text"
              placeholder={getIdPlaceholder()}
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          {userType === 'employer' && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <Input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          )}

          {userType === 'hostel-admin' && (
            <>
              <div>
                <label htmlFor="hostelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Name
                </label>
                <Input
                  id="hostelName"
                  type="text"
                  placeholder="Enter hostel name"
                  value={formData.hostelName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hostelName: e.target.value }))}
                  className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter at least 8+ characters"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Enter at least 8+ characters"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full h-11 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
              minLength={8}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Sign up
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onBack}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
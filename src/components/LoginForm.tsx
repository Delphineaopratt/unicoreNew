import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginFormProps {
  userType: 'student' | 'employer' | 'hostel-admin';
  onBack: () => void;
  onLogin: (credentials: { id: string; password: string }) => void;
}

export function LoginForm({ userType, onBack, onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.password) {
      onLogin(formData);
    }
  };

  const getTitle = () => {
    switch (userType) {
      case 'student':
        return 'Student Login';
      case 'employer':
        return 'Employer Login';
      case 'hostel-admin':
        return 'Hostel Admin Login';
      default:
        return 'Login';
    }
  };

  const getIdPlaceholder = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center p-6 relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">{getTitle()}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              ID
            </label>
            <Input
              id="id"
              type="text"
              placeholder={getIdPlaceholder()}
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className="w-full h-12 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full h-12 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
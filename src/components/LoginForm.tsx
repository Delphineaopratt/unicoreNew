import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface LoginFormProps {
  onBack: () => void;
  onLogin: (credentials: { id: string; password: string; userType: 'student' | 'employer' | 'hostel-admin' }) => void;
}

export function LoginForm({ onBack, onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    userType: '' as 'student' | 'employer' | 'hostel-admin' | ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.password && formData.userType) {
      onLogin(formData as { id: string; password: string; userType: 'student' | 'employer' | 'hostel-admin' });
    }
  };

  const getIdPlaceholder = () => {
    switch (formData.userType) {
      case 'student':
        return 'Student ID or Email';
      case 'employer':
        return 'Company ID or Email';
      case 'hostel-admin':
        return 'Admin ID or Email';
      default:
        return 'ID or Email';
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
          <h1 className="text-2xl font-semibold text-gray-900">Login to Unicore</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <Select
              value={formData.userType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value as 'student' | 'employer' | 'hostel-admin' }))}
            >
              <SelectTrigger className="w-full h-12 bg-gray-50 border-0">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="hostel-admin">Hostel Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              ID or Email
            </label>
            <Input
              id="id"
              type="text"
              placeholder={getIdPlaceholder()}
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className="w-full h-12 bg-gray-50 border-0 text-gray-900 placeholder-gray-500"
              required
              disabled={!formData.userType}
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface JobPostingFormProps {
  onJobAdded?: (job: any) => void;
}

export function JobPostingForm({ onJobAdded }: JobPostingFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    requirements: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    deadline: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.type || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newJob = {
      id: Date.now(), // Simple ID generation
      ...formData,
      applications: 0,
      status: 'active' as const
    };

    console.log('Job posting submitted:', newJob);
    
    if (onJobAdded) {
      onJobAdded(newJob);
    }
    
    // Clear form
    setFormData({
      title: '',
      type: '',
      description: '',
      requirements: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      deadline: ''
    });

    // Navigate to job listings
    navigate('/employer/job-listings');
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      type: '',
      description: '',
      requirements: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      deadline: ''
    });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8">Employer Dashboard</h1>
      
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="mb-6">Post A New Job</h2>
        
        {/* Job Details */}
        <div className="mb-8">
          <h3 className="mb-4">Job Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Job Title</label>
              <Input
                placeholder="e.g., Junior Software Engineer"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Job Type</label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Full-time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Job Description</label>
            <Textarea
              placeholder="Provide a detailed description of the role responsibilities..."
              className="min-h-24"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Job Requirements</label>
            <Textarea
              placeholder="List essential skills, qualifications, and experience required..."
              className="min-h-24"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-2">Job Location</label>
            <Input
              placeholder="e.g., Ring Road, Accra or Remote"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>
        </div>
        
        {/* Compensation */}
        <div className="mb-8">
          <h3 className="mb-4">Compensation</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Minimum Salary</label>
              <Input
                placeholder="e.g., 80000"
                value={formData.minSalary}
                onChange={(e) => handleInputChange('minSalary', e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Maximum Salary</label>
              <Input
                placeholder="e.g., 120000"
                value={formData.maxSalary}
                onChange={(e) => handleInputChange('maxSalary', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Application Settings */}
        <div className="mb-8">
          <h3 className="mb-4">Application Settings</h3>
          
          <div>
            <label className="block mb-2">Application Deadline</label>
            <div className="relative">
              <Input
                placeholder="Pick a date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="pl-4 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Job Listing
          </Button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  description: string;
  requirements: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
}

interface JobListingsPageProps {
  jobs: Job[];
  onViewJob: (job: Job) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (jobId: number) => void;
}

export function JobListingsPage({ jobs, onViewJob, onEditJob, onDeleteJob }: JobListingsPageProps) {
  const navigate = useNavigate();
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">Closed</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/employer/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1>Job Listings</h1>
      </div>
      
      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <p className="text-gray-600">No job listings yet. Go to Dashboard to add a job.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{job.type}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>${job.minSalary} - ${job.maxSalary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Deadline: {job.deadline || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{job.applications} applications</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onViewJob(job)}>
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEditJob(job)}>
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDeleteJob(job.id)}>
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="line-clamp-2">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface Application {
  id: number;
  name: string;
  position: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  imageUrl?: string;
}

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      name: 'Bernice Mensah',
      position: 'Senior Product Manager',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Bernice Mensah',
      position: 'Senior Product Manager',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Bernice Mensah',
      position: 'Senior Product Manager',
      status: 'shortlisted',
    },
    {
      id: 4,
      name: 'Bernice Mensah',
      position: 'Senior Product Manager',
      status: 'rejected',
    },
  ]);

  const handleStatusChange = (id: number, newStatus: 'pending' | 'shortlisted' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-medium',
          text: 'Status: Pending'
        };
      case 'shortlisted':
        return {
          className: 'bg-green-100 text-green-800 hover:bg-green-100 font-medium',
          text: 'Status: Shortlisted'
        };
      case 'rejected':
        return {
          className: 'bg-red-100 text-red-800 hover:bg-red-100 font-medium',
          text: 'Status: Rejected'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 font-medium',
          text: 'Status: Unknown'
        };
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/employer/dashboard')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {applications.map((application) => {
              const statusProps = getStatusBadgeProps(application.status);
              
              return (
                <div
                  key={application.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      {/* Left section: Profile + Info */}
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          {/* <ImageWithFallback
                            src={application.imageUrl || "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc1NzkxODIyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                            alt={application.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                          /> */}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.name}</h3>
                          <p className="text-gray-600 text-sm">Applied for: {application.position}</p>
                        </div>
                      </div>

                      {/* Center section: Status Badge */}
                      <div className="flex justify-center lg:justify-start">
                        <Badge className={`${statusProps.className} px-4 py-2 text-sm`}>
                          {statusProps.text}
                        </Badge>
                      </div>

                      {/* Right section: Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                        {/* View Buttons */}
                        <div className="flex gap-3">
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium"
                            onClick={() => console.log('View resume for', application.name)}
                          >
                            View Resume
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium"
                            onClick={() => console.log('View profile for', application.name)}
                          >
                            View Profile
                          </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {application.status !== 'rejected' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2 font-medium"
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          )}
                          {application.status === 'pending' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium"
                              onClick={() => handleStatusChange(application.id, 'shortlisted')}
                            >
                              Shortlist
                            </Button>
                          )}
                          {application.status === 'shortlisted' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              className="bg-gray-400 text-white px-4 py-2 font-medium cursor-not-allowed"
                              disabled
                            >
                              Shortlisted
                            </Button>
                          )}
                          {application.status === 'rejected' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-gray-100 text-gray-500 border-gray-200 px-4 py-2 font-medium cursor-not-allowed"
                              disabled
                            >
                              Rejected
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
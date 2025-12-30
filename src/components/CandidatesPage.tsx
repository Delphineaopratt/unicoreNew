import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface Candidate {
  id: number;
  name: string;
  position: string;
  status: 'shortlisted';
  imageUrl?: string;
}

export function CandidatesPage() {
  const navigate = useNavigate();
  const candidates: Candidate[] = [
    {
      id: 1,
      name: 'Bernice Mensah',
      position: 'Senior Product Manager',
      status: 'shortlisted',
    },
    {
      id: 2,
      name: 'James Asante',
      position: 'Senior Product Manager',
      status: 'shortlisted',
    },
    {
      id: 3,
      name: 'Sarah Osei',
      position: 'Senior Product Manager',
      status: 'shortlisted',
    },
  ];

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
            <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Left section: Profile + Info */}
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        {/* <ImageWithFallback
                          src={candidate.imageUrl || "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc1NzkxODIyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                        /> */}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{candidate.name}</h3>
                        <p className="text-gray-600 text-sm">Applied for: {candidate.position}</p>
                      </div>
                    </div>

                    {/* Center section: Status Badge */}
                    <div className="flex justify-center lg:justify-start">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium px-4 py-2 text-sm">
                        Status: Shortlisted
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
                          onClick={() => console.log('View resume for', candidate.name)}
                        >
                          View Resume
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium"
                          onClick={() => console.log('View profile for', candidate.name)}
                        >
                          View Profile
                        </Button>
                      </div>

                      {/* Contact Button */}
                      <div className="flex">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
                          onClick={() => console.log('Contact', candidate.name)}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
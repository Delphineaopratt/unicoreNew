import React from 'react';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface CandidateCardProps {
  name: string;
  position: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  imageUrl?: string;
  showContact?: boolean;
  onViewResume?: () => void;
  onViewProfile?: () => void;
  onReject?: () => void;
  onShortlist?: () => void;
  onContact?: () => void;
}

export function CandidateCard({
  name,
  position,
  status,
  imageUrl = "https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc1NzkxODIyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  showContact = false,
  onViewResume,
  onViewProfile,
  onReject,
  onShortlist,
  onContact
}: CandidateCardProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        /> */}
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-600 text-sm">Applied for: {position}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* View buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewResume}>
            View Resume
          </Button>
          <Button variant="outline" size="sm" onClick={onViewProfile}>
            View Profile
          </Button>
        </div>
        
        {/* Status badge */}
        <div className="min-w-fit">
          <StatusBadge status={status} />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 min-w-fit">
          {showContact ? (
            <Button size="sm" onClick={onContact}>
              Contact
            </Button>
          ) : (
            <>
              {status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onReject}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button size="sm" onClick={onShortlist}>
                    Shortlist
                  </Button>
                </>
              )}
              {status === 'shortlisted' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onReject}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reject
                </Button>
              )}
              {status === 'rejected' && (
                <Button size="sm" onClick={onShortlist}>
                  Shortlist
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
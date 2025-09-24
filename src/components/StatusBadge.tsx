import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'shortlisted' | 'rejected';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Status: Pending',
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      case 'shortlisted':
        return {
          text: 'Status: Shortlisted',
          className: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'rejected':
        return {
          text: 'Status: Rejected',
          className: 'bg-red-100 text-red-700 border-red-200'
        };
      default:
        return {
          text: 'Status: Unknown',
          className: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-3 py-1 rounded-full border text-sm font-medium ${config.className}`}>
      {config.text}
    </span>
  );
}
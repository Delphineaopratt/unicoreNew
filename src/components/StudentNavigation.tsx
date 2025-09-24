import React from 'react';
import { LayoutDashboard, Building2, Briefcase, MessageSquare, User } from 'lucide-react';

interface StudentNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function StudentNavigation({ currentPage, onPageChange }: StudentNavigationProps) {
  const menuItems = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hostels', label: 'Hostels', icon: Building2 },
    { id: 'jobs', label: 'Job & internships', icon: Briefcase },
    { id: 'chat', label: 'Chat with United', icon: MessageSquare },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-border min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="font-medium text-lg">Unicore</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Briefcase, MessageSquare, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface StudentNavigationProps {
  onLogout?: () => void;
}

export function StudentNavigation({ onLogout }: StudentNavigationProps) {
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || 'User');
      } catch (e) {
        setUserName('User');
      }
    }
  }, []);

  const menuItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/hostels', label: 'Hostels', icon: Building2 },
    { to: '/student/jobs', label: 'Job & internships', icon: Briefcase },
    { to: '/student/chat', label: 'Chat with United', icon: MessageSquare },
    { to: '/student/profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-border min-h-screen flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-medium text-lg">Unicore</span>
          </div>
          {userName && (
            <p className="text-sm text-gray-600 ml-11">Welcome, {userName}</p>
          )}
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {onLogout && (
          <div className="mt-auto pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 justify-start transition-colors font-medium"
              style={{ color: '#dc2626' }}
            >
              <LogOut size={20} style={{ color: '#dc2626' }} />
              <span style={{ color: '#dc2626' }}>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
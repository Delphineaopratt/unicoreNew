import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  List,
  Bell,
  LogOut,
  Plus,
  Home,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Notification as HostelNotification } from "../../types";
import HostelDashboardHome from "./HostelDashboardHome";
import CreateHostelPage from "./CreateHostelPage";
import HostelListingsPage from "./HostelListingsPage";
import HostelRoomsPage from "./HostelRoomsPage";
import NotificationsPage from "./NotificationsPage";
import EditHostelPage from "./EditHostelPage";

interface HostelAdminDashboardProps {
  notifications: HostelNotification[];
  setNotifications: (notifications: HostelNotification[]) => void;
  onLogout?: () => void;
}

export function HostelAdminDashboard({
  notifications,
  setNotifications,
  onLogout,
}: HostelAdminDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Get user name from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || "Admin");
      } catch (e) {
        setUserName("Admin");
      }
    }
  }, []);

  const navItems = [
    { key: "/hostel-admin", label: "Dashboard", icon: Home, exact: true },
    { key: "/hostel-admin/hostels", label: "Hostels", icon: List },
    { key: "/hostel-admin/notifications", label: "Notifications", icon: Bell },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border min-h-screen flex flex-col sticky top-0 self-start">
        <div className="p-6 flex-1 flex flex-col">
          {/* Logo Section */}
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

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.key, item.exact);
              const unread = item.key === "/hostel-admin/notifications" ? unreadNotifications : 0;
              
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {unread > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-red-500 text-white"
                    >
                      {unread}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          {onLogout && (
            <div className="mt-auto pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 justify-start transition-colors font-medium"
                style={{ color: "#dc2626" }}
              >
                <LogOut size={20} style={{ color: "#dc2626" }} />
                <span style={{ color: "#dc2626" }}>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HostelDashboardHome />} />
          <Route path="/create-hostel" element={<CreateHostelPage />} />
          <Route path="/hostels" element={<HostelListingsPage />} />
          <Route path="/hostels/:hostelId/edit" element={<EditHostelPage />} />
          <Route path="/hostels/:hostelId/rooms" element={<HostelRoomsPage />} />
          <Route
            path="/notifications"
            element={
              <NotificationsPage
                notifications={notifications}
                setNotifications={setNotifications}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

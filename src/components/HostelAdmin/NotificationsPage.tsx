import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Bell, CheckCircle } from "lucide-react";
import { Notification as HostelNotification } from "../../types";

interface NotificationsPageProps {
  notifications: HostelNotification[];
  setNotifications: (notifications: HostelNotification[]) => void;
}

function NotificationsPage({
  notifications,
  setNotifications,
}: NotificationsPageProps) {
  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with your hostel activities
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge className="bg-blue-600 text-white border-0">
              {unreadCount}
            </Badge>
            <span>unread notification{unreadCount !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600">
              You'll see notifications about your hostels and bookings here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-lg transition-all ${
                !notification.read
                  ? "border-l-4 border-l-blue-600 bg-blue-50/30"
                  : "border-l-4 border-l-transparent"
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`border-0 ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {notification.date}
                      </span>
                    </div>
                  </div>
                  {notification.read && (
                    <CheckCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;

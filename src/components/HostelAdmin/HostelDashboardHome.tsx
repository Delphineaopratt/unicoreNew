import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, TrendingUp, Users, Bed } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getMyHostels } from "../../services/hostel.service";

function HostelDashboardHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const hostels = await getMyHostels();

      const totalRooms = hostels.reduce((sum: number, h: any) => {
        return sum + (h.rooms?.length || 0);
      }, 0);

      const availableRooms = hostels.reduce((sum: number, h: any) => {
        return sum + (h.availableRooms || 0);
      }, 0);

      setStats({
        totalHostels: hostels.length,
        totalRooms,
        occupiedRooms: totalRooms - availableRooms,
        availableRooms,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Hostels",
      value: stats.totalHostels,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: Bed,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Available Rooms",
      value: stats.availableRooms,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Occupied Rooms",
      value: stats.occupiedRooms,
      icon: Users,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hostel Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your hostels, rooms, and bookings all in one place
        </p>
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to add a new hostel?
                </h2>
                <p className="text-gray-600 mb-4">
                  Create a new hostel listing with rooms and amenities
                </p>
                <Button
                  onClick={() => navigate("/hostel-admin/create-hostel")}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Hostel
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-xl transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent
            className="p-6"
            onClick={() => navigate("/hostel-admin/hostels")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  View All Hostels
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your hostel listings and rooms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent
            className="p-6"
            onClick={() => navigate("/hostel-admin/create-hostel")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add New Hostel</h3>
                <p className="text-sm text-gray-600">
                  Create a new hostel with details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HostelDashboardHome;

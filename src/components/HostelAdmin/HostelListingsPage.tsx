import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Eye,
  Trash2,
  Plus,
  Search,
  Edit,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Hostel } from "../../types";
import { getMyHostels, deleteHostel } from "../../services/hostel.service";
import { toast } from "sonner";

function HostelListingsPage() {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);

  const resolveImageUrl = (url?: string) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:")
    ) {
      return url;
    }
    return `http://localhost:5001${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    const filtered = hostels.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredHostels(filtered);
  }, [searchQuery, hostels]);

  const fetchHostels = async () => {
    try {
      setIsLoading(true);
      const fetchedHostels = await getMyHostels();
      const hostelsWithIds = fetchedHostels.map((h: any, index: number) => ({
        ...h,
        _id: h._id || h.id || `temp-${index}`,
      }));
      setHostels(hostelsWithIds);
    } catch (err) {
      toast.error("Failed to load hostels");
      console.error("Error fetching hostels:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHostel = async (hostelId: string) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteHostel(hostelId);
      setHostels(hostels.filter((h) => h._id !== hostelId));
      toast.success("Hostel deleted successfully");
    } catch (err) {
      toast.error("Failed to delete hostel");
      console.error("Error deleting hostel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Hostels
            </h1>
            <p className="text-gray-600">
              Manage all your hostel listings in one place
            </p>
          </div>
          <Button
            onClick={() => navigate("/hostel-admin/create-hostel")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Hostel
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search hostels by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-base"
          />
        </div>
      </div>

      {/* Hostels Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading hostels...</p>
        </div>
      ) : filteredHostels.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="py-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "No hostels found" : "No hostels yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by creating your first hostel listing"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate("/hostel-admin/create-hostel")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Hostel
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.map((hostel) => (
            <Card
              key={hostel._id}
              className="overflow-hidden hover:shadow-xl transition-all border-0 shadow-md"
            >
              {/* Hostel Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                {hostel.photos && hostel.photos.length > 0 ? (
                  <img
                    src={resolveImageUrl(hostel.photos[0])}
                    alt={hostel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-blue-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white text-blue-700 border-0 shadow-md">
                    {hostel.availableRooms || 0} Available
                  </Badge>
                </div>
              </div>

              {/* Hostel Details */}
              <CardContent className="p-3">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {hostel.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm line-clamp-1">
                    {hostel.location}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {hostel.description}
                </p>

                {/* Room Count */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Rooms</span>
                    <span className="font-semibold text-gray-900">
                      {hostel.rooms?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/hostel-admin/hostels/${hostel._id}/rooms`)
                    }
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Rooms
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/hostel-admin/hostels/${hostel._id}/edit`)
                    }
                    className="px-4"
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteHostel(hostel._id)}
                    className="px-4"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default HostelListingsPage;

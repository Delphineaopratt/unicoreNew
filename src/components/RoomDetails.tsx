import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Hostel } from "../types";
import { getHostelById } from "../services/hostel.service";

export function RoomDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hostelId = searchParams.get("hostelId");

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hostelId) {
      fetchHostelDetails();
    }
  }, [hostelId]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      const data = await getHostelById(hostelId!);
      setHostel(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching hostel details:", err);
      setError("Failed to load room details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">Room Details</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-red-600 mb-4">{error || "Hostel not found"}</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-semibold">
            {hostel.name} - Room Details
          </h1>
          <p className="text-gray-600 mt-1">
            {hostel.location} • {hostel.rooms?.length || 0} room(s) available
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {hostel.rooms && hostel.rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostel.rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Room Images */}
                {room.photos && room.photos.length > 0 ? (
                  <div className="relative h-56 bg-gray-200">
                    <img
                      src={`http://localhost:5001${room.photos[0]}`}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=400";
                      }}
                    />
                    {room.photos.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                        {room.photos.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === 0 ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-56 bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Room Details */}
                <div className="p-5">
                  <h3 className="font-semibold text-xl mb-1">{room.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{room.type}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold text-lg text-blue-600">
                        GHS {room.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Available:</span>
                      <span className="font-semibold">
                        {room.availableRooms} rooms
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Amenities:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {room.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Room Images */}
                  {room.photos && room.photos.length > 1 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {room.photos.length} photos
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {room.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={`http://localhost:5001${photo}`}
                            alt={`${room.name} - ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border hover:opacity-75 cursor-pointer transition-opacity flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Rooms Available</h3>
            <p className="text-gray-600 mb-4">
              This hostel doesn't have any rooms added yet.
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        )}
      </div>
    </div>
  );
}

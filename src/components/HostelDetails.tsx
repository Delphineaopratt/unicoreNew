import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Users,
  Utensils,
  Car,
} from "lucide-react";
import { Button } from "./ui/button";
// import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingConfirmationModal } from "./BookingConfirmationModal";
import { getHostelById } from "../services/hostel.service";
import { createBooking } from "../services/booking.service";
import { Hostel, Room as RoomType } from "../types";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  type: string;
  features: string[];
  price: string;
  image: string;
}

interface Booking {
  id: string;
  hostelName: string;
  roomName: string;
  roomType: string;
  price: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
  image: string;
}

interface HostelDetailsProps {
  hostelId?: string;
  onBooking: (booking: Booking) => void;
}

export function HostelDetails({
  hostelId: propHostelId,
  onBooking,
}: HostelDetailsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryHostelId = searchParams.get("id");
  // Use query param if available, fall back to prop, then default to "1"
  const hostelId = queryHostelId || propHostelId || "1";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostels();
  }, [hostelId]);

  const handleBookRoom = (roomId: string) => {
    const availableRooms = hostel?.rooms || [];
    const room = availableRooms.find(
      (r) => (r as any).id === roomId || (r as any)._id === roomId
    );
    if (room) {
      // Convert Room type if needed
      const roomForModal: Room = {
        id: (room as any)._id || (room as any).id,
        name: (room as any).name || room.name,
        type: (room as any).type || room.type,
        features: (room as any).amenities || (room as any).features || [],
        price: `GHS ${(room as any).price || room.price}`,
        image:
          ((room as any).photos && (room as any).photos[0]) ||
          (room as any).image ||
          "",
      };
      setSelectedRoom(roomForModal);
      setIsModalOpen(true);
    }
  };

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const data = await getHostelById(hostelId);
      setHostel(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching hostel:", err);
      setError("Failed to load hostel details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedRoom || !hostel) return;

    try {
      // Create booking via API
      const bookingData: any = {
        hostel: hostelId,
        room: selectedRoom.id,
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
        status: "pending" as const,
      };

      await createBooking(bookingData);

      // Create local booking object for UI update
      const booking: Booking = {
        id: Date.now().toString(),
        hostelName: hostel.name,
        roomName: selectedRoom.name,
        roomType: selectedRoom.type,
        price: selectedRoom.price,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        image: selectedRoom.image,
      };

      onBooking(booking);
      setIsModalOpen(false);
      setSelectedRoom(null);
      toast.success("Booking confirmed successfully!");
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error("Failed to create booking. Please try again.");
      throw err; // Re-throw to let modal handle it
    }
  };

  const displayRooms = hostel?.rooms || [];

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="bg-white p-6 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/student/hostels")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Hostel Details</h1>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchHostels()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/hostels")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Hostel Description</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Hostel Description */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{hostel?.name}</h2>
            {hostel?.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{hostel.location}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">{hostel?.description}</p>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Available Rooms</h2>
          {displayRooms && displayRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRooms.map((room: any, index: number) => (
                <div
                  key={room._id || room.id || index}
                  className="bg-white rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="relative bg-gray-200 h-48">
                    {room.photos && room.photos.length > 0 ? (
                      <img
                        src={`http://localhost:5001${room.photos[0]}`}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Room+Photo";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BedDouble className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {/* Slide indicators */}
                    {room.photos && room.photos.length > 0 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {room.photos.map((_: any, i: number) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i === 0 ? "bg-blue-600" : "bg-white/50"
                            }`}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
                    {room.type && (
                      <p className="text-sm text-gray-600 mb-3">{room.type}</p>
                    )}

                    {room.amenities && room.amenities.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        {(Array.isArray(room.amenities)
                          ? room.amenities
                          : typeof room.amenities === "string"
                          ? [room.amenities]
                          : []
                        ).map((amenity: any, idx: number) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold text-blue-600">
                        GHS {room.price}
                      </div>
                      {room.availableRooms !== undefined && (
                        <span className="text-sm text-gray-600">
                          {room.availableRooms} available
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleBookRoom(room._id || room.id)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">
                No rooms available for this hostel.
              </p>
            </div>
          )}
        </div>
      </div>

      <BookingConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
        room={selectedRoom}
        hostelName={hostel?.name || "Hostel"}
      />
    </div>
  );
}

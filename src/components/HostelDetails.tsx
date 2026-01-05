import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  hostelId: string;
  onBooking: (booking: Booking) => void;
}

export function HostelDetails({ hostelId, onBooking }: HostelDetailsProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostels();
  }, [hostelId]);

  const rooms: Room[] = [
    {
      id: "1",
      name: "Room 1",
      type: "Shared room of 4",
      features: [
        "Shared bathroom",
        "Shared kitchen",
        "Balcony",
        "Shared bathroom",
      ],
      price: "2000 per bed",
      image:
        "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "2",
      name: "Room 1",
      type: "Shared room of 4",
      features: [
        "Shared bathroom",
        "Shared kitchen",
        "Balcony",
        "Shared bathroom",
      ],
      price: "2000 per bed",
      image:
        "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "3",
      name: "Room 1",
      type: "Shared room of 4",
      features: [
        "Shared bathroom",
        "Shared kitchen",
        "Balcony",
        "Shared bathroom",
      ],
      price: "2000 per bed",
      image:
        "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "4",
      name: "Room 1",
      type: "Shared room of 4",
      features: [
        "Shared bathroom",
        "Shared kitchen",
        "Balcony",
        "Shared bathroom",
      ],
      price: "2000 per bed",
      image:
        "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "5",
      name: "Room 1",
      type: "Shared room of 4",
      features: [
        "Shared bathroom",
        "Shared kitchen",
        "Balcony",
        "Shared bathroom",
      ],
      price: "2000 per bed",
      image:
        "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "6",
      name: "Room 1",
      type: "Shared room of 4",
      features: [
        "Shared bathroom",
        "Shared kitchen",
        "Balcony",
        "Shared bathroom",
      ],
      price: "2000 per bed",
      image:
        "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const handleBookRoom = (roomId: string) => {
    const availableRooms = hostel?.rooms || rooms;
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
        price: `GH₵ ${(room as any).price || room.price}`,
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

  const displayRooms = hostel?.rooms || rooms;
  const displayHostelName = hostel?.name || "Stephanie's Hostel";
  const displayHostelDescription =
    hostel?.description ||
    "Stephanie's Hostel is located at Kisseman, near Bethel Dental Clinic, on the 19th Street of Nii Lane. We have comfortable single and shared rooms coming at affordable prices. Each single room is equipped with... Shared rooms are...";

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
          <h2 className="text-xl font-semibold mb-4">Stephanie's Hostel</h2>
          <p className="text-gray-600 leading-relaxed">
            Stephanie's Hostel is located at Kisseman, near Bethel Dental
            Clinic, on the 19th Street of Nii Lane. We have comfortable single
            and shared rooms coming at affordable prices. Each single room is
            equipped with... Shared rooms are...
          </p>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="relative">
                  {/* <ImageWithFallback
                    src={room.image}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  /> */}
                  {/* Slide indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{room.name}</h3>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    {room.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleBookRoom(room.id)}
                  >
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
        room={selectedRoom}
        hostelName="Stephanie's Hostel"
      />
    </div>
  );
}

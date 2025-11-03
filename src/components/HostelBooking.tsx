import React, { useState, useEffect } from "react";
import { MapPin, BedDouble, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Hostel, Booking, Notification } from "../types";
import { getAllHostels } from "../services/hostel.service";
import { getMyBookings, createBooking } from "../services/booking.service";
// import { isAuthenticated } from "../services/auth.service";

interface HostelBookingProps {
  onBack: () => void;
  onViewHostel: (hostelId: string) => void;
}

export function HostelBooking({ onBack, onViewHostel }: HostelBookingProps) {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostels();
    // if (isAuthenticated()) {
    //   fetchBookings();
    // }
  }, []);

  const fetchHostels = async () => {
    try {
      const data = await getAllHostels();
      setHostels(data as Hostel[]);
      setError(null);
    } catch (err) {
      setError("Failed to load hostels. Please try again.");
      console.error("Error fetching hostels:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data as Booking[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleBookingCreation = async (hostelId: string) => {
    // if (!isAuthenticated()) {
    //   // Redirect to login or show login modal
    //   return;
    // }

    try {
      await createBooking({
        hostel: hostelId,
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
      });
      fetchBookings(); // Refresh bookings after creation
    } catch (err) {
      console.error("Error creating booking:", err);
    }
  };

  const tabs = [
    { id: "explore", label: "Explore Hostels" },
    { id: "history", label: "Booking History" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Hostel Booking</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Find and book a hostel near your university.
        </p>

        {/* University Selection */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Select University
            </label>
            <Select
              value={selectedUniversity}
              onValueChange={setSelectedUniversity}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university1">University of Ghana</SelectItem>
                <SelectItem value="university2">KNUST</SelectItem>
                <SelectItem value="university3">
                  University of Cape Coast
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="mt-6">
            <MapPin className="w-4 h-4 mr-2" />
            Enable Location
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && <div className="text-center py-12">Loading hostels...</div>}
        {error && (
          <div className="text-center py-12 text-red-600">Error: {error}</div>
        )}
        {!loading && !error && activeTab === "explore" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Hostel Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel) => (
                <div
                  key={hostel._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={hostel.photos[0] || "/placeholder-hostel.jpg"}
                      alt={hostel.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {hostel.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hostel.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <BedDouble className="w-4 h-4 mr-1" />
                      {hostel.availableRooms} rooms available
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => onViewHostel(hostel._id)}
                    >
                      View Hostel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Booking History</h2>
            {!isAuthenticated() ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Please login to view your booking history
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    /* Handle login */
                  }}
                >
                  Login
                </Button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No bookings found. Start exploring hostels to make your first
                  booking!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg p-4 shadow-sm border"
                  >
                    <div className="flex gap-4">
                      <ImageWithFallback
                        src={
                          (booking.hostel as Hostel).photos[0] ||
                          "/placeholder-hostel.jpg"
                        }
                        alt={(booking.hostel as Hostel).name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {booking.room.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {(booking.hostel as Hostel).name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">
                              GHS {booking.room.price}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No notifications at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-white rounded-lg p-4 shadow-sm border"
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "success"
                            ? "bg-green-500"
                            : notification.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

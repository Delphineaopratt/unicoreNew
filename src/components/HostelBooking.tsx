import React, { useState } from 'react';
import { ArrowLeft, MapPin, BedDouble, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Booking {
  id: string;
  hostelName: string;
  roomName: string;
  roomType: string;
  price: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  image: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
}

interface HostelData {
  id: string;
  name: string;
  location: string;
  description: string;
  availableRooms: number;
  photos: any[];
  rooms: any[];
}

interface HostelBookingProps {
  onBack: () => void;
  onViewHostel: (hostelId: string) => void;
  bookings: Booking[];
  notifications: Notification[];
  hostelsData: HostelData[];
}

export function HostelBooking({ onBack, onViewHostel, bookings, notifications, hostelsData }: HostelBookingProps) {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedUniversity, setSelectedUniversity] = useState('');

  // Use hostels from admin data, with fallback to static data
  const displayHostels = hostelsData.length > 0 ? hostelsData.map(hostel => ({
    id: hostel.id,
    name: hostel.name,
    location: hostel.location,
    rooms: `${hostel.rooms.length} rooms available`,
    image: hostel.photos[0]?.url || "https://images.unsplash.com/photo-1599821306970-0440b030738f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhvc3RlbCUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU4Mjc4NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  })) : [
    {
      id: '1',
      name: "Stephanie's",
      location: "Kisseman",
      rooms: "6 rooms available",
      image: "https://images.unsplash.com/photo-1599821306970-0440b030738f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhvc3RlbCUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU4Mjc4NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '2',
      name: "Stephanie's",
      location: "Kisseman",
      rooms: "5 rooms available",
      image: "https://images.unsplash.com/photo-1599821306970-0440b030738f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhvc3RlbCUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU4Mjc4NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '3',
      name: "Stephanie's",
      location: "Kisseman",
      rooms: "5 rooms available",
      image: "https://images.unsplash.com/photo-1599821306970-0440b030738f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb3VudGFpbiUyMGhvc3RlbCUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU4Mjc4NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const tabs = [
    { id: 'explore', label: 'Explore Hostels' },
    { id: 'history', label: 'Booking History' },
    { id: 'notifications', label: 'Notifications' }
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
        
        <p className="text-gray-600 mb-6">Find and book a hostel near your university.</p>
        
        {/* University Selection */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Select University</label>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="Choose University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university1">University of Ghana</SelectItem>
                <SelectItem value="university2">KNUST</SelectItem>
                <SelectItem value="university3">University of Cape Coast</SelectItem>
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
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'explore' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Hostel Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayHostels.map((hostel) => (
                <div key={hostel.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative">
                    <ImageWithFallback
                      src={hostel.image}
                      alt={hostel.name}
                      className="w-full h-48 object-cover"
                    />
                    {/* Slide indicators */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{hostel.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hostel.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <BedDouble className="w-4 h-4 mr-1" />
                      {hostel.rooms}
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => onViewHostel(hostel.id)}
                    >
                      View Hostel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Booking History</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No bookings found. Start exploring hostels to make your first booking!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex gap-4">
                      <ImageWithFallback
                        src={booking.image}
                        alt={booking.roomName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{booking.roomName}</h3>
                            <p className="text-sm text-gray-600">{booking.hostelName}</p>
                            <p className="text-sm text-gray-600">{booking.roomType}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{booking.price}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No notifications at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' 
                          ? 'bg-green-500'
                          : notification.type === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
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
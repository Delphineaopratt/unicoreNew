import React, { useState } from 'react';
import { Building2, List, Bell, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}

interface RoomPhoto {
  id: string;
  url: string;
  file?: File;
}

interface Room {
  id: string;
  name: string;
  amenities: string[];
  price: number;
  availableRooms: number;
  photos: RoomPhoto[];
  hostelId: string;
}

interface Hostel {
  id: string;
  name: string;
  location: string;
  description: string;
  availableRooms: number;
  photos: HostelPhoto[];
  rooms: Room[];
}

interface HostelNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'booking' | 'inquiry' | 'cancellation';
  read: boolean;
}

interface HostelManagementDashboardProps {
  hostels: Hostel[];
  setHostels: (hostels: Hostel[]) => void;
  notifications: HostelNotification[];
  setNotifications: (notifications: HostelNotification[]) => void;
}

export function HostelManagementDashboard({ 
  hostels, 
  setHostels, 
  notifications, 
  setNotifications 
}: HostelManagementDashboardProps) {
  const [activeTab, setActiveTab] = useState<'add-hostels' | 'hostel-listings' | 'notifications'>('add-hostels');
  const [selectedHostelForRooms, setSelectedHostelForRooms] = useState<string | null>(null);
  const [showRoomsView, setShowRoomsView] = useState(false);

  // Add Hostel Form State
  const [hostelForm, setHostelForm] = useState({
    name: '',
    location: '',
    description: '',
    availableRooms: '',
    photos: [] as HostelPhoto[]
  });

  // Add Room Form State
  const [roomForm, setRoomForm] = useState({
    name: '',
    amenities: '',
    price: '',
    availableRooms: '',
    photos: [] as RoomPhoto[],
    hostelId: ''
  });

  const handleHostelPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: HostelPhoto[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        file
      }));
      setHostelForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleRoomPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: RoomPhoto[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        file
      }));
      setRoomForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleUploadHostel = () => {
    if (hostelForm.name && hostelForm.location && hostelForm.description && hostelForm.availableRooms) {
      const newHostel: Hostel = {
        id: Date.now().toString(),
        name: hostelForm.name,
        location: hostelForm.location,
        description: hostelForm.description,
        availableRooms: parseInt(hostelForm.availableRooms),
        photos: hostelForm.photos,
        rooms: []
      };

      setHostels([...hostels, newHostel]);
      
      // Reset form
      setHostelForm({
        name: '',
        location: '',
        description: '',
        availableRooms: '',
        photos: []
      });

      // Switch to hostel listings tab
      setActiveTab('hostel-listings');
    }
  };

  const handleAddRoom = () => {
    if (roomForm.name && roomForm.amenities && roomForm.price && roomForm.availableRooms && roomForm.hostelId) {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: roomForm.name,
        amenities: roomForm.amenities.split(',').map(a => a.trim()),
        price: parseFloat(roomForm.price),
        availableRooms: parseInt(roomForm.availableRooms),
        photos: roomForm.photos,
        hostelId: roomForm.hostelId
      };

      setHostels(prev => prev.map(hostel => 
        hostel.id === roomForm.hostelId 
          ? { ...hostel, rooms: [...hostel.rooms, newRoom] }
          : hostel
      ));

      // Reset form
      setRoomForm({
        name: '',
        amenities: '',
        price: '',
        availableRooms: '',
        photos: [],
        hostelId: ''
      });
    }
  };

  const handleViewHostel = (hostelId: string) => {
    setSelectedHostelForRooms(hostelId);
    setShowRoomsView(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (selectedHostelForRooms) {
      setHostels(prev => prev.map(hostel => 
        hostel.id === selectedHostelForRooms 
          ? { ...hostel, rooms: hostel.rooms.filter(room => room.id !== roomId) }
          : hostel
      ));
    }
  };

  const handleEditRoom = (roomId: string) => {
    // For now, just log - you can implement edit functionality
    console.log('Edit room:', roomId);
  };

  const PhotoCarousel = ({ photos, className = "w-full h-48" }: { photos: any[], className?: string }) => {
    const [currentPhoto, setCurrentPhoto] = useState(0);

    if (photos.length === 0) {
      return (
        <div className={`${className} bg-gray-200 rounded-lg flex items-center justify-center`}>
          <span className="text-gray-500">No photos</span>
        </div>
      );
    }

    return (
      <div className={`${className} relative rounded-lg overflow-hidden bg-gray-200`}>
        <ImageWithFallback
          src={photos[currentPhoto]?.url || ''}
          alt="Photo"
          className="w-full h-full object-cover"
        />
        
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentPhoto(prev => prev > 0 ? prev - 1 : photos.length - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPhoto(prev => prev < photos.length - 1 ? prev + 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhoto ? 'bg-blue-600' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (showRoomsView && selectedHostelForRooms) {
    const selectedHostel = hostels.find(h => h.id === selectedHostelForRooms);
    if (!selectedHostel) return null;

    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowRoomsView(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Hostels
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Hostel Management Dashboard</h1>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab('hostel-listings')}
                className="px-6"
              >
                Hostel Listings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Available Rooms
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Hostel Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Hostel Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {selectedHostel.description}
              </p>
            </div>

            {/* Available Rooms */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Available Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedHostel.rooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <PhotoCarousel photos={room.photos} className="w-full h-48" />
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-3">{room.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        {room.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <span>• {amenity}</span>
                          </div>
                        ))}
                        <div className="col-span-2 font-medium text-gray-900">
                          {room.price} per bed
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRoom(room.id)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Unicore</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('add-hostels')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'add-hostels' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Add Hostels</span>
            </button>

            <button
              onClick={() => setActiveTab('hostel-listings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'hostel-listings' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
              <span>Hostel Listings</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'notifications' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge className="bg-red-500 text-white text-xs ml-auto">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Hostel Management Dashboard</h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'add-hostels' && (
              <div className="space-y-8">
                {/* Add New Hostel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-2">Add New Hostel</h2>
                  <p className="text-gray-600 mb-6">Fill in the details to add a new hostel listing.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                      <Input
                        placeholder="E.g., Friendly Hostel"
                        value={hostelForm.name}
                        onChange={(e) => setHostelForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        placeholder="E.g., Westlands"
                        value={hostelForm.location}
                        onChange={(e) => setHostelForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Description</label>
                      <Textarea
                        placeholder="Describe your hostel..."
                        value={hostelForm.description}
                        onChange={(e) => setHostelForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                      <Input
                        placeholder="E.g., 8"
                        type="number"
                        value={hostelForm.availableRooms}
                        onChange={(e) => setHostelForm(prev => ({ ...prev, availableRooms: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Photos</label>
                      <div className="border border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleHostelPhotoUpload}
                          className="hidden"
                          id="hostel-photos"
                        />
                        <label
                          htmlFor="hostel-photos"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Choose Files
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          {hostelForm.photos.length > 0 ? `${hostelForm.photos.length} files chosen` : 'No files chosen'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setHostelForm({
                        name: '',
                        location: '',
                        description: '',
                        availableRooms: '',
                        photos: []
                      })}
                    >
                      Clear Form
                    </Button>
                    <Button
                      onClick={handleUploadHostel}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Hostel
                    </Button>
                  </div>
                </div>

                {/* Add New Room */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-2">Add New Room</h2>
                  <p className="text-gray-600 mb-6">Fill in the details to add a new room listing.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                      <Input
                        placeholder="E.g., Room 1"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                      <Input
                        placeholder="E.g., Balcony, Shared bathroom"
                        value={roomForm.amenities}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, amenities: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <Input
                        placeholder="E.g., 3500"
                        type="number"
                        value={roomForm.price}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label>
                      <Input
                        placeholder="E.g., 8"
                        type="number"
                        value={roomForm.availableRooms}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, availableRooms: e.target.value }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Hostel</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={roomForm.hostelId}
                        onChange={(e) => setRoomForm(prev => ({ ...prev, hostelId: e.target.value }))}
                      >
                        <option value="">Select a hostel</option>
                        {hostels.map((hostel) => (
                          <option key={hostel.id} value={hostel.id}>
                            {hostel.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Photos</label>
                      <div className="border border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleRoomPhotoUpload}
                          className="hidden"
                          id="room-photos"
                        />
                        <label
                          htmlFor="room-photos"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          Choose Files
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          {roomForm.photos.length > 0 ? `${roomForm.photos.length} files chosen` : 'No files chosen'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setRoomForm({
                        name: '',
                        amenities: '',
                        price: '',
                        availableRooms: '',
                        photos: [],
                        hostelId: ''
                      })}
                    >
                      Clear Form
                    </Button>
                    <Button
                      onClick={handleAddRoom}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add room
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hostel-listings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Your Hostel Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hostels.map((hostel) => (
                    <div key={hostel.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <PhotoCarousel photos={hostel.photos} className="w-full h-48" />
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{hostel.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">📍 {hostel.location}</p>
                        <p className="text-sm text-gray-700 mb-4">🏠 {hostel.rooms.length} rooms available</p>
                        
                        <Button
                          onClick={() => handleViewHostel(hostel.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          View Hostel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notifications</h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white border border-gray-200 rounded-lg p-4 ${
                        !notification.read ? 'border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">{notification.date}</p>
                        </div>
                        <Badge
                          className={`${
                            notification.type === 'booking' 
                              ? 'bg-green-100 text-green-800' 
                              : notification.type === 'inquiry'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No notifications yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
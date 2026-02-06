import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  Bed,
  Users,
  DollarSign,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Hostel, Room } from "../../types";
import {
  getAllHostels,
  addRoom,
  updateRoom,
  deleteRoom,
} from "../../services/hostel.service";
import { toast } from "sonner";

interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}

function HostelRoomsPage() {
  const { hostelId } = useParams<{ hostelId: string }>();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({
    name: "",
    type: "",
    amenities: "",
    price: "",
    availableRooms: 0,
    photos: [] as HostelPhoto[],
  });

  useEffect(() => {
    fetchHostel();
  }, [hostelId]);

  const fetchHostel = async () => {
    try {
      setIsLoading(true);
      const hostels = await getAllHostels();
      const foundHostel = hostels.find((h: any) => h._id === hostelId);
      if (foundHostel) {
        setHostel(foundHostel);
      } else {
        toast.error("Hostel not found");
        navigate("/hostel-admin/hostels");
      }
    } catch (err) {
      toast.error("Failed to load hostel");
      console.error("Error fetching hostel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: HostelPhoto[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        file,
      }));
      setRoomForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const removePhoto = (photoId: string) => {
    setRoomForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
  };

  const handleCreateRoom = async () => {
    if (
      !roomForm.name ||
      !roomForm.type ||
      !roomForm.amenities ||
      !roomForm.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!hostelId) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", roomForm.name);
      formData.append("type", roomForm.type);
      formData.append(
        "amenities",
        JSON.stringify(roomForm.amenities.split(",").map((a) => a.trim()))
      );
      formData.append("price", roomForm.price);
      formData.append("availableRooms", roomForm.availableRooms.toString());
      
      roomForm.photos.forEach((photo) => {
        if (photo.file) {
          formData.append("photos", photo.file);
        }
      });

      const updatedHostel = await addRoom(hostelId, formData);
      setHostel(updatedHostel);
      
      // Reset form
      setRoomForm({
        name: "",
        type: "",
        amenities: "",
        price: "",
        availableRooms: 0,
        photos: [],
      });
      setShowAddRoom(false);
      toast.success("Room added successfully!");
    } catch (err) {
      toast.error("Failed to create room");
      console.error("Error creating room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      type: room.type,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : "",
      price: room.price.toString(),
      availableRooms: room.availableRooms || 0,
      photos: [],
    });
    setShowAddRoom(true);
  };

  const handleUpdateRoom = async () => {
    if (
      !roomForm.name ||
      !roomForm.type ||
      !roomForm.amenities ||
      !roomForm.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!hostelId || !editingRoom) return;

    try {
      setIsLoading(true);
      const roomData = {
        name: roomForm.name,
        type: roomForm.type,
        amenities: roomForm.amenities.split(",").map((a) => a.trim()),
        price: parseFloat(roomForm.price),
        availableRooms: roomForm.availableRooms,
      };

      const updatedHostel = await updateRoom(hostelId, editingRoom._id, roomData);
      setHostel(updatedHostel);
      
      // Reset form
      setRoomForm({
        name: "",
        type: "",
        amenities: "",
        price: "",
        availableRooms: 0,
        photos: [],
      });
      setShowAddRoom(false);
      setEditingRoom(null);
      toast.success("Room updated successfully!");
    } catch (err) {
      toast.error("Failed to update room");
      console.error("Error updating room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    setShowAddRoom(false);
    setRoomForm({
      name: "",
      type: "",
      amenities: "",
      price: "",
      availableRooms: 0,
      photos: [],
    });
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!hostelId) return;
    
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      setIsLoading(true);
      const updatedHostel = await deleteRoom(hostelId, roomId);
      setHostel(updatedHostel);
      toast.success("Room deleted successfully");
    } catch (err) {
      toast.error("Failed to delete room");
      console.error("Error deleting room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !hostel) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading hostel...</p>
      </div>
    );
  }

  if (!hostel) {
    return null;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/hostel-admin/hostels")}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hostels
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {hostel.name}
            </h1>
            <p className="text-gray-600">{hostel.location}</p>
          </div>
          <Button
            onClick={() => setShowAddRoom(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Add/Edit Room Form */}
      {showAddRoom && (
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-600" />
              {editingRoom ? "Edit Room" : "Add New Room"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={roomForm.name}
                onChange={(e) =>
                  setRoomForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Room 101, Deluxe Suite"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Type <span className="text-red-500">*</span>
              </label>
              <Input
                value={roomForm.type}
                onChange={(e) =>
                  setRoomForm((prev) => ({ ...prev, type: e.target.value }))
                }
                placeholder="e.g., Single, Double, Shared room of 4"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amenities <span className="text-red-500">*</span>
              </label>
              <Input
                value={roomForm.amenities}
                onChange={(e) =>
                  setRoomForm((prev) => ({
                    ...prev,
                    amenities: e.target.value,
                  }))
                }
                placeholder="WiFi, AC, Study Desk (comma-separated)"
              />
            </div>

            {/* Price and Available Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per Month <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  value={roomForm.price}
                  onChange={(e) =>
                    setRoomForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Available Rooms
                </label>
                <Input
                  type="number"
                  min="0"
                  value={roomForm.availableRooms}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      availableRooms: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="Number of rooms"
                />
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="room-photos"
                />
                <label
                  htmlFor="room-photos"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Upload room photos
                  </span>
                </label>
              </div>

              {roomForm.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-3">
                  {roomForm.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (editingRoom ? "Updating..." : "Adding...") : (editingRoom ? "Update Room" : "Add Room")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rooms List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Rooms ({hostel.rooms?.length || 0})
        </h2>

        {!hostel.rooms || hostel.rooms.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <Bed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No rooms yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add your first room to this hostel
              </p>
              <Button
                onClick={() => setShowAddRoom(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostel.rooms.map((room: Room) => (
              <Card
                key={room._id}
                className="overflow-hidden hover:shadow-xl transition-all border-0 shadow-md"
              >
                {/* Room Image */}
                <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200">
                  {room.photos && room.photos.length > 0 ? (
                    <img
                      src={room.photos[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bed className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <CardContent className="p-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  <Badge className="mb-3 bg-blue-100 text-blue-700 border-0">
                    {room.type}
                  </Badge>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${room.price}/month
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Available
                      </span>
                      <span className="font-semibold text-gray-900">
                        {room.availableRooms || 0} rooms
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditRoom(room)}
                      className="flex-1"
                      size="sm"
                      disabled={isLoading}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteRoom(room._id)}
                      size="sm"
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
    </div>
  );
}

export default HostelRoomsPage;

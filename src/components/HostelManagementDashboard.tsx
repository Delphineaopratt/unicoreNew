import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  List,
  Bell,
  Upload,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Hostel, Room, Notification as HostelNotification } from "../types";
import {
  getAllHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  addRoom,
  updateRoom,
  deleteRoom,
} from "../services/hostel.service";

interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}

interface HostelManagementDashboardProps {
  hostels: Hostel[];
  setHostels: (hostels: Hostel[]) => void;
  notifications: HostelNotification[];
  setNotifications: (notifications: HostelNotification[]) => void;
  onLogout?: () => void;
}

export function HostelManagementDashboard({
  hostels,
  setHostels,
  notifications,
  setNotifications,
  onLogout,
}: HostelManagementDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "add-hostels" | "hostel-listings" | "notifications"
  >("add-hostels");
  const [selectedHostelForRooms, setSelectedHostelForRooms] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const navItems = [
    { key: "add-hostels", label: "Dashboard", icon: Upload },
    { key: "hostel-listings", label: "Hostels", icon: List },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  // Form states
  const [hostelForm, setHostelForm] = useState({
    name: "",
    location: "",
    description: "",
    availableRooms: 0,
    photos: [] as HostelPhoto[],
  });

  const [roomForm, setRoomForm] = useState({
    name: "",
    type: "",
    amenities: "",
    price: "",
    availableRooms: 0,
    photos: [] as HostelPhoto[],
    hostelId: "",
  });

  useEffect(() => {
    fetchHostels();

    // Get user name from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || "Admin");
      } catch (e) {
        setUserName("Admin");
      }
    }
  }, []);

  // const fetchHostels = async () => {
  //   try {
  //     setIsLoading(true);
  //     const fetchedHostels = await getAllHostels();
  //     setHostels(fetchedHostels);
  //     setError(null);
  //   } catch (err) {
  //     setError("Failed to load hostels. Please try again later.");
  //     console.error("Error fetching hostels:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchHostels = async () => {
    try {
      setIsLoading(true);
      const fetchedHostels = await getAllHostels(); // returns an array directly

      // Normalize the data in case _id is missing
      const hostelsWithIds = fetchedHostels.map((h: any, index: number) => ({
        ...h,
        _id: h._id || h.id || `temp-${index}`,
      }));

      setHostels(hostelsWithIds);
      setError(null);
    } catch (err) {
      setError("Failed to load hostels. Please try again later.");
      console.error("Error fetching hostels:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHostelPhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: HostelPhoto[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        file,
      }));
      setHostelForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const handleRoomPhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleCreateHostel = async () => {
    if (!hostelForm.name || !hostelForm.location || !hostelForm.description) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", hostelForm.name);
      formData.append("location", hostelForm.location);
      formData.append("description", hostelForm.description);
      formData.append("availableRooms", hostelForm.availableRooms.toString());
      formData.append("adminId", "672c1e2f0e12a835b4f1d8f9"); // Temporary adminId for testing
      hostelForm.photos.forEach((photo, idx) => {
        if (photo.file) {
          formData.append("photos", photo.file);
        }
      });
      const newHostel = await createHostel(formData);
      setHostels([...hostels, newHostel]);
      setHostelForm({
        name: "",
        location: "",
        description: "",
        availableRooms: 0,
        photos: [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to create hostel. Please try again.");
      console.error("Error creating hostel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (
      !roomForm.name ||
      !roomForm.type ||
      !roomForm.amenities ||
      !roomForm.price ||
      !roomForm.hostelId
    ) {
      setError("Please fill in all required fields");
      return;
    }

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
      const updatedHostel = await addRoom(roomForm.hostelId, formData);

      setHostels(
        hostels.map((h) => (h._id === updatedHostel._id ? updatedHostel : h))
      );

      setRoomForm({
        name: "",
        type: "",
        amenities: "",
        price: "",
        availableRooms: 0,
        photos: [],
        hostelId: "",
      });
      setError(null);
    } catch (err) {
      setError("Failed to create room. Please try again.");
      console.error("Error creating room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (hostelId: string, roomId: string) => {
    try {
      setIsLoading(true);
      const updatedHostel = await deleteRoom(hostelId, roomId);
      setHostels(
        hostels.map((h) => (h._id === updatedHostel._id ? updatedHostel : h))
      );
      setError(null);
    } catch (err) {
      setError("Failed to delete room. Please try again.");
      console.error("Error deleting room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHostel = async (hostelId: string) => {
    try {
      setIsLoading(true);
      await deleteHostel(hostelId);
      setHostels(hostels.filter((h) => h._id !== hostelId));
      setError(null);
    } catch (err) {
      setError("Failed to delete hostel. Please try again.");
      console.error("Error deleting hostel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAddHostelForm = () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Hostel Admin Dashboard</h1>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Hostel</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hostel Name</label>
            <Input
              value={hostelForm.name}
              onChange={(e) =>
                setHostelForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter hostel name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              value={hostelForm.location}
              onChange={(e) =>
                setHostelForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Enter location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={hostelForm.description}
              onChange={(e) =>
                setHostelForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Available Rooms</label>
            <Input
              type="number"
              value={hostelForm.availableRooms}
              onChange={(e) =>
                setHostelForm((prev) => ({
                  ...prev,
                  availableRooms: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="Enter number of available rooms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photos</label>
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
              className="inline-block px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              Choose Files
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {hostelForm.photos.map((photo) => (
                <div key={photo.id} className="relative w-20 h-20">
                  <img
                    src={photo.url}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() =>
                      setHostelForm((prev) => ({
                        ...prev,
                        photos: prev.photos.filter((p) => p.id !== photo.id),
                      }))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreateHostel}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create Hostel"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAddRoomForm = () => (
    <div className="bg-white rounded-lg border p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hostel</label>
          <select
            value={roomForm.hostelId}
            onChange={(e) =>
              setRoomForm((prev) => ({ ...prev, hostelId: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option key="select-default" value="">
              Select a hostel
            </option>
            {hostels.map((hostel, index) => (
              <option
                key={`hostel-${hostel._id || index}`} // fallback key
                value={hostel._id || ""}
              >
                {hostel.name || "Unnamed Hostel"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Room Name</label>
          <Input
            value={roomForm.name}
            onChange={(e) =>
              setRoomForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter room name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <Input
            value={roomForm.type}
            onChange={(e) =>
              setRoomForm((prev) => ({ ...prev, type: e.target.value }))
            }
            placeholder="e.g., Single, Shared room of 4, Double"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amenities</label>
          <Input
            value={roomForm.amenities}
            onChange={(e) =>
              setRoomForm((prev) => ({ ...prev, amenities: e.target.value }))
            }
            placeholder="Enter amenities (comma-separated)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input
            type="number"
            value={roomForm.price}
            onChange={(e) =>
              setRoomForm((prev) => ({ ...prev, price: e.target.value }))
            }
            placeholder="Enter price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Available Rooms
          </label>
          <Input
            type="number"
            value={roomForm.availableRooms}
            onChange={(e) =>
              setRoomForm((prev) => ({
                ...prev,
                availableRooms: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Enter number of available rooms"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Photos</label>
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
            className="inline-block px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
          >
            Choose Files
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {roomForm.photos.map((photo) => (
              <div key={photo.id} className="relative w-20 h-20">
                <img
                  src={photo.url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() =>
                    setRoomForm((prev) => ({
                      ...prev,
                      photos: prev.photos.filter((p) => p.id !== photo.id),
                    }))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={handleCreateRoom}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Creating..." : "Create Room"}
        </Button>
      </div>
    </div>
  );

  const renderHostelListings = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Hostel Listings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hostels.map((hostel) => (
        <div
          key={hostel._id}
          className="bg-white rounded-lg border overflow-hidden"
        >
          {/* <div className="relative h-48">
            {hostel.photos && hostel.photos.length > 0 ? (
              <ImageWithFallback
                src={hostel.photos[0]}
                alt={hostel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div> */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{hostel.name}</h3>
            <p className="text-gray-600 mb-2">{hostel.location}</p>
            <p className="text-gray-600 mb-4">
              {hostel.availableRooms} rooms available
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/hostel/room-details?hostelId=${hostel._id}`)
                }
                className="flex-1"
              >
                View Rooms
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteHostel(hostel._id)}
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
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notifications</h2>

      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white rounded-lg border p-4 ${
            !notification.read ? "border-l-4 border-l-blue-500" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-gray-600 mt-1">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-2">{notification.date}</p>
            </div>
            <Badge>{notification.type}</Badge>
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notifications at this time
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border min-h-screen flex flex-col sticky top-0 self-start">
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="font-medium text-lg">Unicore</span>
            </div>
            {userName && (
              <p className="text-sm text-gray-600 ml-11">Welcome, {userName}</p>
            )}
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              const unread =
                item.key === "notifications"
                  ? notifications.filter((n) => !n.read).length
                  : 0;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key as typeof activeTab);
                    setSelectedHostelForRooms(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {unread > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-red-500 text-white"
                    >
                      {unread}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {onLogout && (
            <div className="mt-auto pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 justify-start transition-colors font-medium"
                style={{ color: "#dc2626" }}
              >
                <LogOut size={20} style={{ color: "#dc2626" }} />
                <span style={{ color: "#dc2626" }}>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {activeTab === "add-hostels" && (
          <div className="space-y-6">
            {renderAddHostelForm()}
            {renderAddRoomForm()}
          </div>
        )}
        {activeTab === "hostel-listings" && renderHostelListings()}
        {activeTab === "notifications" && renderNotifications()}
      </main>
    </div>
  );
}

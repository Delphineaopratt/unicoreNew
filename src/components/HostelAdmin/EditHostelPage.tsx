import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Building2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getAllHostels, updateHostel } from "../../services/hostel.service";
import { toast } from "sonner";
import LocationPicker from "./LocationPicker";

interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}

function EditHostelPage() {
  const navigate = useNavigate();
  const { hostelId } = useParams<{ hostelId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [hostelForm, setHostelForm] = useState({
    name: "",
    location: "",
    description: "",
    availableRooms: 0,
    photos: [] as HostelPhoto[],
  });
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 5.6037, longitude: -0.1870 });

  useEffect(() => {
    fetchHostel();
  }, [hostelId]);

  const fetchHostel = async () => {
    try {
      setIsLoading(true);
      const hostels = await getAllHostels();
      const hostel = hostels.find((h: any) => h._id === hostelId);
      
      if (hostel) {
        setHostelForm({
          name: hostel.name || "",
          location: hostel.location || "",
          description: hostel.description || "",
          availableRooms: hostel.availableRooms || 0,
          photos: hostel.photos
            ? hostel.photos.map((url: string, index: number) => ({
                id: `existing-${index}`,
                url: url,
              }))
            : [],
        });
        
        // Set coordinates if available
        if (hostel.coordinates?.latitude && hostel.coordinates?.longitude) {
          setCoordinates({
            latitude: hostel.coordinates.latitude,
            longitude: hostel.coordinates.longitude,
          });
        }
      } else {
        toast.error("Hostel not found");
        navigate("/hostel-admin/hostels");
      }
    } catch (error) {
      console.error("Error fetching hostel:", error);
      toast.error("Failed to load hostel details");
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
      setHostelForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const removePhoto = (photoId: string) => {
    setHostelForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
  };

  const handleUpdateHostel = async () => {
    if (!hostelForm.name || !hostelForm.location || !hostelForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!hostelId) return;

    try {
      setIsLoading(true);
      
      const hostelData = {
        name: hostelForm.name,
        location: hostelForm.location,
        description: hostelForm.description,
        availableRooms: hostelForm.availableRooms,
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      };

      await updateHostel(hostelId, hostelData);
      toast.success("Hostel updated successfully!");
      navigate("/hostel-admin/hostels");
    } catch (err) {
      toast.error("Failed to update hostel. Please try again.");
      console.error("Error updating hostel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !hostelForm.name) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading hostel details...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Hostel
        </h1>
        <p className="text-gray-600">
          Update your hostel information
        </p>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Hostel Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hostel Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hostel Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={hostelForm.name}
              onChange={(e) =>
                setHostelForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter hostel name"
              className="text-base"
            />
          </div>

          {/* Location with Map */}
          <LocationPicker
            location={hostelForm.location}
            coordinates={coordinates}
            onLocationChange={(location) =>
              setHostelForm((prev) => ({ ...prev, location }))
            }
            onCoordinatesChange={setCoordinates}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={hostelForm.description}
              onChange={(e) =>
                setHostelForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the hostel, its features, and amenities"
              rows={5}
              className="text-base"
            />
          </div>

          {/* Available Rooms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Available Rooms
            </label>
            <Input
              type="number"
              min="0"
              value={hostelForm.availableRooms}
              onChange={(e) =>
                setHostelForm((prev) => ({
                  ...prev,
                  availableRooms: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="Enter number of available rooms"
              className="text-base"
            />
            <p className="text-sm text-gray-500 mt-1">
              This reflects total availability across all room types
            </p>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hostel Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="hostel-photos"
              />
              <label
                htmlFor="hostel-photos"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <span className="text-sm font-medium text-gray-700 mb-1">
                  Click to upload photos
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG up to 10MB each
                </span>
              </label>
            </div>

            {/* Photo Previews */}
            {hostelForm.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {hostelForm.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => navigate("/hostel-admin/hostels")}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateHostel}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Updating..." : "Update Hostel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditHostelPage;

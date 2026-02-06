import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Building2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { createHostel } from "../../services/hostel.service";
import { toast } from "sonner";
import LocationPicker from "./LocationPicker";

interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}

function CreateHostelPage() {
  const navigate = useNavigate();
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

  const handleCreateHostel = async () => {
    if (!hostelForm.name || !hostelForm.location || !hostelForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", hostelForm.name);
      formData.append("location", hostelForm.location);
      formData.append("description", hostelForm.description);
      formData.append("availableRooms", hostelForm.availableRooms.toString());
      formData.append("adminId", "672c1e2f0e12a835b4f1d8f9");
      formData.append("coordinates[latitude]", coordinates.latitude.toString());
      formData.append("coordinates[longitude]", coordinates.longitude.toString());
      
      hostelForm.photos.forEach((photo) => {
        if (photo.file) {
          formData.append("photos", photo.file);
        }
      });

      await createHostel(formData);
      toast.success("Hostel created successfully!");
      
      // Reset form
      setHostelForm({
        name: "",
        location: "",
        description: "",
        availableRooms: 0,
        photos: [],
      });
      setCoordinates({ latitude: 5.6037, longitude: -0.1870 });
      
      navigate("/hostel-admin/hostels");
    } catch (err) {
      toast.error("Failed to create hostel. Please try again.");
      console.error("Error creating hostel:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/hostel-admin")}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Hostel
        </h1>
        <p className="text-gray-600">
          Add a new hostel to your management system
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
              Initial Available Rooms
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
              You can add specific room details later
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
              onClick={() => navigate("/hostel-admin")}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateHostel}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Hostel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateHostelPage;

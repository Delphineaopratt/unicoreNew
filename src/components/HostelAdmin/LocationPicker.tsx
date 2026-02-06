import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-fix.css";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { MapPin, Search, Navigation } from "lucide-react";

// Fix for default marker icon issue in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  location: string;
  coordinates?: { latitude: number; longitude: number };
  onLocationChange: (location: string) => void;
  onCoordinatesChange: (coordinates: { latitude: number; longitude: number }) => void;
}

// Component to update map center when position changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Component to handle map clicks
function LocationMarker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
}

export default function LocationPicker({
  location,
  coordinates,
  onLocationChange,
  onCoordinatesChange,
}: LocationPickerProps) {
  // Default to Accra, Ghana coordinates
  const [position, setPosition] = useState<[number, number]>(
    coordinates?.latitude && coordinates?.longitude
      ? [coordinates.latitude, coordinates.longitude]
      : [5.6037, -0.1870]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude) {
      setPosition([coordinates.latitude, coordinates.longitude]);
    }
  }, [coordinates]);

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    onCoordinatesChange({
      latitude: newPosition[0],
      longitude: newPosition[1],
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPosition: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        onLocationChange(display_name);
        onCoordinatesChange({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
        onCoordinatesChange({ latitude, longitude });

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            onLocationChange(data.display_name);
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please check your browser permissions.");
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Location Address</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Enter hostel address"
          required
        />
      </div>

      <div>
        <Label>Search Location on Map</Label>
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a place..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            className="bg-green-600 text-white whitespace-nowrap"
            title="Use my current location"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Click on map to set exact location
        </Label>
        <div className="mt-2 rounded-lg overflow-hidden border" style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
            <MapUpdater center={position} />
            <LocationMarker
              position={position}
              onPositionChange={handlePositionChange}
            />
          </MapContainer>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Coordinates:</strong> Lat: {position[0].toFixed(6)}, Lng:{" "}
          {position[1].toFixed(6)}
        </p>
      </div>
    </div>
  );
}

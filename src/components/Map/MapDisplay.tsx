import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-fix.css";
import { ExternalLink } from "lucide-react";

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

interface MapDisplayProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  hostelName?: string;
}

export default function MapDisplay({
  coordinates,
  locationName,
  hostelName,
}: MapDisplayProps) {
  const position: [number, number] = [coordinates.latitude, coordinates.longitude];

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full space-y-3">
      <div className="rounded-lg overflow-hidden border shadow-sm" style={{ height: "300px", width: "100%" }}>
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">{hostelName || "Hostel Location"}</p>
                <p className="text-sm text-gray-600">{locationName}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          <p className="font-medium">{locationName}</p>
          <p className="text-xs">
            {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </p>
        </div>
        <button
          onClick={openInGoogleMaps}
          className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open in Google Maps</span>
        </button>
      </div>
    </div>
  );
}

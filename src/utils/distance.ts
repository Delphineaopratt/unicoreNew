/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter hostels by distance from a location
 * @param hostels Array of hostels with coordinates
 * @param centerLat Center latitude
 * @param centerLon Center longitude
 * @param maxDistanceKm Maximum distance in kilometers
 * @returns Filtered hostels with distance property
 */
export function filterHostelsByDistance(
  hostels: any[],
  centerLat: number,
  centerLon: number,
  maxDistanceKm: number
): any[] {
  return hostels
    .map(hostel => {
      if (!hostel.coordinates?.latitude || !hostel.coordinates?.longitude) {
        return null; // Skip hostels without coordinates
      }
      
      const distance = calculateDistance(
        centerLat,
        centerLon,
        hostel.coordinates.latitude,
        hostel.coordinates.longitude
      );
      
      return {
        ...hostel,
        distance
      };
    })
    .filter(hostel => hostel !== null && hostel.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)
}

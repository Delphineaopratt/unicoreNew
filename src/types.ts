// Hostel Types
export interface Hostel {
  _id: string;
  name: string;
  location: string;
  description: string;
  availableRooms: number;
  photos: string[];
  rooms: Room[];
  admin?: string;
}

export interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  amenities: string[];
  availableRooms: number;
  photos: string[];
  hostel: string | Hostel;
}

// Booking Types
export interface Booking {
  _id: string;
  hostel: string | Hostel;
  room: Room;
  student: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
}

// Photo Types
export interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}
// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  userType: 'student' | 'hostel-admin' | 'employer';
  university?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  profileCompleted: boolean;
  createdAt: string;
}

export interface UserProfile {
  program?: string;
  cgpa?: string;
  jobTypes?: string[];
  skills?: string[];
  interests?: string[];
  transcript?: File | { url?: string; filename?: string; } | null;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
}

// Hostel types
export interface Room {
  _id: string;
  name: string;
  amenities: string[];
  price: number;
  availableRooms: number;
  photos: string[];
  hostelId: string;
}

export interface Hostel {
  _id: string;
  name: string;
  location: string;
  description: string;
  availableRooms: number;
  photos: string[];
  rooms: Room[];
  adminId: string;
  createdAt: string;
}

// Booking types
export interface Booking {
  _id: string;
  student: string | User;
  hostel: string | Hostel;
  room: {
    roomId: string;
    name: string;
    number: string;
    price: number;
  };
  checkInDate: string;
  checkOutDate?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

// Job types
export interface Job {
  id: number;
  employer?: string | User;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  minSalary?: string;
  maxSalary?: string;
  benefits?: string[];
  skills?: string[];
  status?: 'active' | 'closed' | 'draft';
  applicationDeadline?: string;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  student?: string | User;
  job?: string | Job;
  jobTitle?: string;
  company?: string;
  appliedDate?: string;
  coverLetter?: string;
  address?: string;
  resume?: {
    url: string;
    filename: string;
  };
  status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  employerNotes?: string;
  createdAt?: string;
}

// Notification types
export interface HostelNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'booking' | 'inquiry' | 'cancellation';
  read: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
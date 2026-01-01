// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if it exists
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export interface UserProfile {
//   program?: string;
//   cgpa?: string;
//   jobTypes?: string[];
//   skills?: string[];
//   interests?: string[];
//   transcript?: File | null;
//   name?: string;
//   email?: string;
//   phone?: string;
//   location?: string;
//   bio?: string;
//   profilePicture?: string;
// }

// export interface ChatMessage {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
//   suggestions?: string[];
//   actionButtons?: ActionButton[];
// }

// export interface ActionButton {
//   label: string;
//   action: string;
//   variant?: 'default' | 'outline' | 'secondary';
// }

// export const generateChatbotResponse = async (
//   message: string,
//   userProfile: UserProfile | null,
//   conversationHistory: ChatMessage[]
// ) => {
//   try {
//     const response = await api.post('/chatbot/generate', {
//       message,
//       userProfile,
//       conversationHistory: conversationHistory.slice(-10) // Send last 10 messages for context
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error generating chatbot response:', error);
//     throw error;
//   }
// };

import axios from 'axios';
import { UserProfile } from '../types/index';

const API_URL = 'http://localhost:5000/api';

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Automatically attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiry or unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Token expired or invalid. Logging out...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// -------------------- Interfaces -------------------- //

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: ActionButton[];
}

export interface ActionButton {
  label: string;
  action: string;
  variant?: 'default' | 'outline' | 'secondary';
}

// -------------------- Chatbot Service -------------------- //

export const generateChatbotResponse = async (
  message: string,
  userProfile: UserProfile | null,
  conversationHistory: ChatMessage[]
) => {
  try {
    const response = await api.post('/chatbot/generate', {
      message,
      userProfile,
      conversationHistory: conversationHistory.slice(-10), // send last 10 messages
    });
    return response.data;
  } catch (error: any) {
    console.error('Error generating chatbot response:', error);
    throw error.response?.data || error;
  }
};

// ✅ (Optional) Example of uploading a user transcript or profile picture
export const uploadUserFile = async (file: File, type: 'transcript' | 'profilePicture') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/chatbot/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw error.response?.data || error;
  }
};

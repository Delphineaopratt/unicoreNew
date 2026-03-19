import axios from 'axios';
import PaystackPop from '@paystack/inline-js';

const API_URL = 'http://localhost:5001/api/payments';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizeApiError = (error: any, fallback: string) => {
  const apiMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  const normalized = new Error(apiMessage);
  (normalized as any).response = error?.response;
  (normalized as any).originalError = error;
  return normalized;
};

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PaymentInitResponse {
  success: boolean;
  message: string;
  data: {
    accessCode: string;
    authorizationUrl: string;
    reference: string;
    bookingId: string;
    amount: number;
    hostel: string;
    room: string;
  };
}

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  data: {
    bookingId: string;
    paymentStatus: string;
    status: string;
    amount: number;
    reference: string;
    paidAt: string;
    hostel: string;
    room: string;
    checkInDate: string;
    checkOutDate: string;
  };
}

export interface PaymentHistoryItem {
  bookingId: string;
  reference: string;
  hostel: string;
  room: string;
  amount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
  checkInDate: string;
}

export const initializePayment = async (bookingId: string): Promise<PaymentInitResponse> => {
  try {
    const response = await api.post('/initialize', { bookingId });
    return response.data;
  } catch (error: any) {
    throw normalizeApiError(error, 'Failed to initialize payment');
  }
};

export const verifyPayment = async (reference: string): Promise<PaymentVerifyResponse> => {
  try {
    const response = await api.get(`/verify/${reference}`);
    return response.data;
  } catch (error: any) {
    throw normalizeApiError(error, 'Payment verification failed');
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error: any) {
    throw normalizeApiError(error, 'Failed to fetch payment history');
  }
};

export const refundPayment = async (bookingId: string, reason?: string) => {
  try {
    const response = await api.post('/refund', { bookingId, reason });
    return response.data;
  } catch (error: any) {
    throw normalizeApiError(error, 'Failed to process refund');
  }
};

let cachedPaystackPublicKey: string | null = null;

export const getPaystackPublicKey = async (): Promise<string> => {
  if (cachedPaystackPublicKey) {
    return cachedPaystackPublicKey;
  }

  try {
    const response = await api.get('/public-key');
    const key = response.data?.data?.publicKey || '';
    cachedPaystackPublicKey = key;
    return key;
  } catch (error: any) {
    throw normalizeApiError(error, 'Failed to fetch Paystack public key');
  }
};

// Helper function to load Paystack script
export const loadPaystackScript = (): Promise<boolean> => {
  // SDK is bundled via npm package, so no script injection is needed.
  return Promise.resolve(true);
};

// Helper to open Paystack payment modal
export const openPaystackModal = (
  paymentData: {
    accessCode: string;
    authorizationUrl: string;
    reference: string;
    amount: number;
    studentEmail: string;
  },
  onSuccess: (reference: string) => void,
  onClose: () => void
) => {
  return getPaystackPublicKey().then((publicKey) => {
    if (!publicKey) {
      throw new Error('Paystack public key is not configured');
    }

    return new Promise<void>((resolve, reject) => {
      const popup = new PaystackPop();

      popup.resumeTransaction(paymentData.accessCode, {
        key: publicKey,
        onLoad: () => {
          console.log('Paystack popup loaded.');
          resolve();
        },
        onSuccess: (response: any) => {
          const ref = response?.reference || paymentData.reference;
          onSuccess(ref);
        },
        onCancel: () => {
          console.log('Payment window closed.');
          onClose();
        },
        onError: (error: any) => {
          reject(new Error(error?.message || 'Paystack popup failed to load transaction'));
        }
      });
    });
  });
};

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
// import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { validateDateRange, validateFutureDate, validateTermsAcceptance } from '../utils/validation';
import { toast } from 'sonner';
import { createBooking } from '../services/booking.service';
import { PaymentModal } from './PaymentModal';

interface Room {
  id: string;
  name: string;
  type: string;
  features: string[];
  price: string;
  image: string;
}

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  room: Room | null;
  hostelName: string;
  hostelId: string;
  studentEmail?: string;
}

export function BookingConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  room, 
  hostelName,
  hostelId,
  studentEmail = ''
}: BookingConfirmationModalProps) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  
  // Error states
  const [dateError, setDateError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [termsError, setTermsError] = useState("");

  if (!room) return null;

  const handleConfirmBooking = async () => {
    // Reset errors
    setDateError("");
    setPaymentError("");
    setTermsError("");

    let hasErrors = false;

    // Validate check-in date
    const checkInValidation = validateFutureDate(checkInDate, "Check-in date");
    if (!checkInValidation.isValid) {
      setDateError(checkInValidation.error || "");
      hasErrors = true;
    }

    // Validate date range
    if (checkInDate && checkOutDate) {
      const dateRangeValidation = validateDateRange(checkInDate, checkOutDate);
      if (!dateRangeValidation.isValid) {
        setDateError(dateRangeValidation.error || "");
        hasErrors = true;
      }
    } else if (!checkOutDate) {
      setDateError("Check-out date is required");
      hasErrors = true;
    }

    // Validate payment method
    if (!paymentMethod) {
      setPaymentError("Please select a payment method");
      hasErrors = true;
    }

    // Validate terms acceptance
    const termsValidation = validateTermsAcceptance(termsAccepted);
    if (!termsValidation.isValid) {
      setTermsError(termsValidation.error || "");
      hasErrors = true;
    }

    if (hasErrors) {
      toast.error("Please fix all errors before confirming");
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking
      const bookingData = {
        hostel: hostelId,
        room: {
          roomId: room!.id,
          name: room!.name,
          number: '',
          price: parseFloat(room!.price.replace(/[^0-9.]/g, '')) || 0
        },
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        status: 'pending',
        paymentStatus: 'pending'
      };

      const response = await createBooking(bookingData);
      
      if (response.success) {
        setCreatedBookingId(response.data._id);
        setIsPaymentModalOpen(true);
        toast.success('Booking created. Proceed to payment.');
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Error creating booking:', error?.response?.data || error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create booking';
      toast.error('Booking Error', {
        description: errorMsg
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment confirmed! Your booking is complete.');
    // Reset form
    setCheckInDate('');
    setCheckOutDate('');
    setPaymentMethod('card');
    setTermsAccepted(false);
    setCreatedBookingId(null);
    onConfirm();
    onClose();
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = parseFloat(room.price.replace(/[^0-9.]/g, "")) || 0;
    return nights * pricePerNight;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Review your booking details. Payment will be processed securely with Paystack.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Room Summary */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              {/* <ImageWithFallback
                src={room.image}
                alt={room.name}
                className="w-24 h-24 object-cover rounded-lg"
              /> */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <p className="text-sm text-gray-600">{hostelName}</p>
                <p className="text-sm text-gray-600">{room.type}</p>
                <p className="font-semibold text-blue-600 mt-1">{room.price}</p>
              </div>
            </div>

            {/* Dates Selection */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Your Dates
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check-in">Check-in Date *</Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      setDateError('');
                    }}
                    min={getTodayDate()}
                    className={dateError ? 'border-red-500' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="check-out">Check-out Date *</Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      setDateError('');
                    }}
                    min={checkInDate || getTodayDate()}
                    className={dateError ? 'border-red-500' : ''}
                  />
                </div>
              </div>
              {dateError && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{dateError}</span>
                </div>
              )}
              {checkInDate && checkOutDate && !dateError && (
                <p className="text-sm text-gray-600 mt-2">
                  {calculateNights()} night{calculateNights() !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="mobile-money"
                    name="payment"
                    value="mobile-money"
                    checked={paymentMethod === 'mobile-money'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError('');
                    }}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="mobile-money" className="cursor-pointer">
                    Mobile Money (MTN, Vodafone, AirtelTigo) via Paystack
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError('');
                    }}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="card" className="cursor-pointer">
                    Credit/Debit Card via Paystack
                  </Label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💳 Your payment information is securely processed by Paystack
              </p>
            </div>

            {/* Price Summary */}
            {checkInDate && checkOutDate && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price per night:</span>
                    <span>{room.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">GHS {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => {
                    setTermsAccepted(checked as boolean);
                    setTermsError('');
                  }}
                  className={termsError ? 'border-red-500' : ''}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  I agree to the hostel's terms and conditions, cancellation policy, and house rules. I understand that payment is required to confirm this booking.
                </Label>
              </div>
              {termsError && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{termsError}</span>
                </div>
              )}
            </div>
            
            {/* Room Features */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Room Features:</h4>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                {room.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmBooking} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      {createdBookingId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setCreatedBookingId(null);
          }}
          onSuccess={handlePaymentSuccess}
          bookingId={createdBookingId}
          amount={calculateTotal()}
          hostelName={hostelName}
          roomName={room?.name || ''}
          studentEmail={studentEmail}
        />
      )}
    </>
  );
}

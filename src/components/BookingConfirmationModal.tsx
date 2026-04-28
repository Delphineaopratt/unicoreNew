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
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
// import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, CreditCard, AlertCircle } from "lucide-react";
import { validateTermsAcceptance } from "../utils/validation";
import { toast } from "sonner";
import { createBooking } from "../services/booking.service";
import { PaymentModal } from "./PaymentModal";

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
  onConfirm: (booking: {
    id: string;
    hostelName: string;
    roomName: string;
    roomType: string;
    price: string;
    bookingDate: string;
    status: "confirmed" | "pending" | "cancelled";
    image: string;
  }) => void;
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
  studentEmail = "",
}: BookingConfirmationModalProps) {
  const [semesterOption, setSemesterOption] = useState<"1" | "2" | "">("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [createdBookingDate, setCreatedBookingDate] = useState<string>(
    new Date().toISOString(),
  );

  // Error states
  const [semesterError, setSemesterError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [termsError, setTermsError] = useState("");

  if (!room) return null;

  const handleConfirmBooking = async () => {
    // Reset errors
    setSemesterError("");
    setPaymentError("");
    setTermsError("");

    let hasErrors = false;

    if (!semesterOption) {
      setSemesterError("Please select a semester option");
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
      if (!termsAccepted) {
        toast.error("Please check the box above");
      } else {
        toast.error("Please fix all errors before confirming");
      }
      return;
    }

    setIsProcessing(true);

    try {
      const checkInDate = new Date();
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setMonth(
        checkOutDate.getMonth() + (semesterOption === "2" ? 8 : 4),
      );

      // Create booking
      const bookingData = {
        hostel: hostelId,
        room: {
          roomId: room!.id,
          name: room!.name,
          number: "",
          price: parseFloat(room!.price.replace(/[^0-9.]/g, "")) || 0,
        },
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        semesterCount: Number(semesterOption),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        status: "pending",
        paymentStatus: "pending",
      };

      const response = await createBooking(bookingData as any);

      if (response.success) {
        setCreatedBookingId(response.data._id);
        setCreatedBookingDate(
          response.data.createdAt || new Date().toISOString(),
        );
        setIsPaymentModalOpen(true);
        toast.success("Booking created. Proceed to payment.");
      } else {
        throw new Error(response.message || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error?.response?.data || error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking";
      toast.error("Booking Error", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment confirmed! Your booking is complete.");

    const confirmedBooking = {
      id: createdBookingId || Date.now().toString(),
      hostelName,
      roomName: room.name,
      roomType: room.type,
      price: `GHS ${calculateTotal().toFixed(2)}`,
      bookingDate: createdBookingDate,
      status: "confirmed" as const,
      image: room.image,
    };

    onConfirm(confirmedBooking);

    // Reset form
    setSemesterOption("");
    setPaymentMethod("card");
    setTermsAccepted(false);
    setCreatedBookingId(null);
    onClose();
  };

  const getSemesterMultiplier = () => {
    return semesterOption === "2" ? 2 : 1;
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(room.price.replace(/[^0-9.]/g, "")) || 0;
    return basePrice * getSemesterMultiplier();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl w-[95vw] h-[90dvh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Review your booking details. Payment will be processed securely
              with Paystack.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-4">
            <div className="space-y-6 pr-1">
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
                  <p className="font-semibold text-blue-600 mt-1">
                    {room.price}
                  </p>
                </div>
              </div>

              {/* Semester Selection */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Booking Duration
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="semester-1"
                      name="semester-option"
                      value="1"
                      checked={semesterOption === "1"}
                      onChange={(e) => {
                        setSemesterOption(e.target.value as "1" | "2");
                        setSemesterError("");
                      }}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="semester-1" className="cursor-pointer">
                      1 Semester (Base Price)
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="semester-2"
                      name="semester-option"
                      value="2"
                      checked={semesterOption === "2"}
                      onChange={(e) => {
                        setSemesterOption(e.target.value as "1" | "2");
                        setSemesterError("");
                      }}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="semester-2" className="cursor-pointer">
                      2 Semesters (Double Price)
                    </Label>
                  </div>
                </div>
                {semesterError && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{semesterError}</span>
                  </div>
                )}
                {semesterOption && !semesterError && (
                  <p className="text-sm text-gray-600 mt-2">
                    {semesterOption} semester
                    {semesterOption === "2" ? "s" : ""} selected
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
                      checked={paymentMethod === "mobile-money"}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setPaymentError("");
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
                      checked={paymentMethod === "card"}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setPaymentError("");
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
              {semesterOption && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Room price:</span>
                      <span>{room.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>
                        {semesterOption} semester
                        {semesterOption === "2" ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        GHS {calculateTotal().toFixed(2)}
                      </span>
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
                      setTermsError("");
                    }}
                    className={termsError ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm cursor-pointer leading-relaxed"
                  >
                    I agree to the hostel's terms and conditions, cancellation
                    policy, and house rules. I understand that payment is
                    required to confirm this booking.
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
          </div>

          <DialogFooter className="gap-2 px-6 pb-6 pt-3 border-t bg-white">
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
                "Proceed to Payment"
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
          roomName={room?.name || ""}
          studentEmail={studentEmail}
        />
      )}
    </>
  );
}

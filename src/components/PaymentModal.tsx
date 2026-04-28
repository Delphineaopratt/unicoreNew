import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  initializePayment,
  verifyPayment,
  loadPaystackScript,
  openPaystackModal,
  PaymentInitResponse,
  PaymentVerifyResponse,
} from "../services/payment.service";

const getApiErrorMessage = (err: any, fallback: string) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentResult: PaymentVerifyResponse["data"]) => void;
  bookingId: string;
  amount: number;
  hostelName: string;
  roomName: string;
  studentEmail?: string;
}

type PaymentStatus =
  | "idle"
  | "initializing"
  | "pending"
  | "verifying"
  | "success"
  | "error";

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  bookingId,
  amount,
  hostelName,
  roomName,
  studentEmail = "",
}: PaymentModalProps) {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string>("");
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paymentData, setPaymentData] = useState<
    PaymentInitResponse["data"] | null
  >(null);
  const [isPaystackActive, setIsPaystackActive] = useState(false);

  // Load Paystack script on component mount
  useEffect(() => {
    loadPaystackScript().then((loaded) => {
      setPaystackLoaded(loaded);
      if (!loaded) {
        console.warn("Failed to load Paystack script");
      }
    });
  }, []);

  const handleInitializePayment = async () => {
    try {
      setStatus("initializing");
      setError("");

      const response = await initializePayment(bookingId);

      if (!response.success) {
        setError(response.message || "Failed to initialize payment");
        setStatus("error");
        return;
      }

      setPaymentData(response.data);
      setStatus("pending");

      // Open Paystack modal
      if (paystackLoaded && studentEmail) {
        setIsPaystackActive(true);
        await openPaystackModal(
          {
            ...response.data,
            studentEmail,
          },
          handlePaymentSuccess,
          handlePaymentClose,
        );
      } else {
        // Fallback: Open authorization URL in a new window
        window.open(response.data.authorizationUrl, "_blank");
        setStatus("idle");
        toast.info("Paystack window opened. Please complete the payment.", {
          description:
            "You can verify payment after completing the transaction.",
        });
      }
    } catch (err: any) {
      console.error("Payment initialize error:", err?.response?.data || err);
      const errorMsg = getApiErrorMessage(err, "Failed to initialize payment");
      setError(errorMsg);
      setStatus("error");
      toast.error("Payment Initialization Failed", {
        description: errorMsg,
      });
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    try {
      setIsPaystackActive(false);
      setStatus("verifying");
      setError("");

      const response = await verifyPayment(reference);

      if (!response.success) {
        setError(response.message || "Payment verification failed");
        setStatus("error");
        toast.error("Payment Verification Failed", {
          description: response.message,
        });
        return;
      }

      setStatus("success");
      toast.success("Payment Successful!", {
        description: `Your booking has been confirmed. Reference: ${reference}`,
      });

      // Call onSuccess callback after a delay
      setTimeout(() => {
        onSuccess(response.data);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Payment verify error:", err?.response?.data || err);
      const errorMsg = getApiErrorMessage(err, "Payment verification failed");
      setError(errorMsg);
      setStatus("error");
      toast.error("Payment Verification Failed", {
        description: errorMsg,
      });
    }
  };

  const handlePaymentClose = () => {
    setIsPaystackActive(false);
    setStatus("idle");
    toast.info("Payment Cancelled", {
      description: "You can retry your payment anytime.",
    });
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (
      !open &&
      (isPaystackActive ||
        status === "pending" ||
        status === "initializing" ||
        status === "verifying")
    ) {
      return;
    }
    if (!open) {
      resetModal();
    }
  };

  const resetModal = () => {
    if (
      isPaystackActive ||
      status === "pending" ||
      status === "initializing" ||
      status === "verifying"
    ) {
      return;
    }
    setStatus("idle");
    setError("");
    setPaymentData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(event) => {
          if (
            isPaystackActive ||
            status === "pending" ||
            status === "initializing" ||
            status === "verifying"
          ) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (
            isPaystackActive ||
            status === "pending" ||
            status === "initializing" ||
            status === "verifying"
          ) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Secure payment powered by Paystack
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
            <h3 className="font-semibold text-sm text-gray-700">
              Booking Details
            </h3>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">Hostel:</span>
                <span className="font-medium text-gray-900">{hostelName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium text-gray-900">{roomName}</span>
              </p>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <p className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-lg text-blue-600">
                    ₵{amount.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status === "idle" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2 text-sm">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">
                You'll be redirected to Paystack to complete your payment
                securely.
              </p>
            </div>
          )}

          {status === "initializing" && (
            <div className="flex justify-center py-4">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Initializing payment...</p>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="flex justify-center py-4">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processing payment...</p>
              </div>
            </div>
          )}

          {status === "verifying" && (
            <div className="flex justify-center py-4">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Verifying payment...</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <div className="text-center">
                <p className="font-semibold text-green-700">
                  Payment Successful!
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your booking has been confirmed
                </p>
                {paymentData?.reference && (
                  <p className="text-xs text-gray-500 mt-2">
                    Ref: {paymentData.reference}
                  </p>
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-800">Payment Failed</p>
                <p className="text-red-700 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {status !== "success" && (
            <Button variant="outline" onClick={resetModal}>
              Cancel
            </Button>
          )}
          {status === "idle" && (
            <Button
              onClick={handleInitializePayment}
              disabled={!paystackLoaded}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {paystackLoaded ? "Pay with Paystack" : "Loading..."}
            </Button>
          )}
          {status === "error" && (
            <Button
              onClick={handleInitializePayment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retry Payment
            </Button>
          )}
          {status === "success" && (
            <Button
              onClick={resetModal}
              className="bg-green-600 hover:bg-green-700"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

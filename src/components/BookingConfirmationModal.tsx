import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
}

export function BookingConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  room, 
  hostelName 
}: BookingConfirmationModalProps) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Review your booking details and confirm your reservation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <ImageWithFallback
              src={room.image}
              alt={room.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-600">{hostelName}</p>
              <p className="text-sm text-gray-600">{room.type}</p>
              <p className="font-semibold text-blue-600">{room.price}</p>
            </div>
          </div>
          
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
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              By confirming this booking, you agree to the hostel's terms and conditions.
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700">
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { ArrowLeft, MapPin, BedDouble, Users, Utensils, Car } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface Room {
  id: string;
  name: string;
  type: string;
  features: string[];
  price: string;
  image: string;
}

interface Booking {
  id: string;
  hostelName: string;
  roomName: string;
  roomType: string;
  price: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  image: string;
}

interface HostelDetailsProps {
  onBack: () => void;
  hostelId: string;
  onBooking: (booking: Booking) => void;
}

export function HostelDetails({ onBack, hostelId, onBooking }: HostelDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    {
      id: '1',
      name: 'Room 1',
      type: 'Shared room of 4',
      features: ['Shared bathroom', 'Shared kitchen', 'Balcony', 'Shared bathroom'],
      price: '2000 per bed',
      image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '2',
      name: 'Room 1',
      type: 'Shared room of 4',
      features: ['Shared bathroom', 'Shared kitchen', 'Balcony', 'Shared bathroom'],
      price: '2000 per bed',
      image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '3',
      name: 'Room 1',
      type: 'Shared room of 4',
      features: ['Shared bathroom', 'Shared kitchen', 'Balcony', 'Shared bathroom'],
      price: '2000 per bed',
      image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '4',
      name: 'Room 1',
      type: 'Shared room of 4',
      features: ['Shared bathroom', 'Shared kitchen', 'Balcony', 'Shared bathroom'],
      price: '2000 per bed',
      image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '5',
      name: 'Room 1',
      type: 'Shared room of 4',
      features: ['Shared bathroom', 'Shared kitchen', 'Balcony', 'Shared bathroom'],
      price: '2000 per bed',
      image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: '6',
      name: 'Room 1',
      type: 'Shared room of 4',
      features: ['Shared bathroom', 'Shared kitchen', 'Balcony', 'Shared bathroom'],
      price: '2000 per bed',
      image: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxidW5rJTIwYmVkJTIwaG9zdGVsJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1ODI3ODQ4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const handleBookRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsModalOpen(true);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedRoom) {
      const booking: Booking = {
        id: Date.now().toString(),
        hostelName: "Stephanie's Hostel",
        roomName: selectedRoom.name,
        roomType: selectedRoom.type,
        price: selectedRoom.price,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        image: selectedRoom.image
      };
      
      onBooking(booking);
      setIsModalOpen(false);
      setSelectedRoom(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Hostel Description</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Hostel Description */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Stephanie's Hostel</h2>
          <p className="text-gray-600 leading-relaxed">
            Stephanie's Hostel is located at Kisseman, near Bethel Dental Clinic, on the 19th Street of Nii Lane. 
            We have comfortable single and shared rooms coming at affordable prices. Each single room is 
            equipped with... Shared rooms are...
          </p>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative">
                  <ImageWithFallback
                    src={room.image}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Slide indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    {room.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleBookRoom(room.id)}
                  >
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
        room={selectedRoom}
        hostelName="Stephanie's Hostel"
      />
    </div>
  );
}
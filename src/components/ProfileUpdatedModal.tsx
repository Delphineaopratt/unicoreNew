import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle } from 'lucide-react';

interface ProfileUpdatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitialSetup?: boolean;
}

export function ProfileUpdatedModal({ isOpen, onClose, isInitialSetup = false }: ProfileUpdatedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl">
            {isInitialSetup ? 'Profile Created Successfully!' : 'Profile Updated Successfully!'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isInitialSetup 
              ? 'Your UniCore profile has been set up with your preferences. You can now explore personalized job recommendations and continue building your career journey.'
              : 'Your profile changes have been saved successfully. Your updated information will be reflected across the platform.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isInitialSetup ? 'Continue to Dashboard' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
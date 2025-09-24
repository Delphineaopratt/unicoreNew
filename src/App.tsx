import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { StudentNavigation } from './components/StudentNavigation';
import { JobPostingForm } from './components/JobPostingForm';
import { ApplicationsPage } from './components/ApplicationsPage';
import { CandidatesPage } from './components/CandidatesPage';
import { JobListingsPage } from './components/JobListingsPage';
import { StudentDashboard } from './components/StudentDashboard';
import { HostelManagementDashboard } from './components/HostelManagementDashboard';
import { HostelBooking } from './components/HostelBooking';
import { HostelDetails } from './components/HostelDetails';
import { JobsPage } from './components/JobsPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MyProfile } from './components/MyProfile';
import { ProfileUpdatedModal } from './components/ProfileUpdatedModal';
import { JobApplicationForm } from './components/JobApplicationForm';
import { UnibotChat } from './components/UnibotChat';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Toaster } from './components/ui/sonner';

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  description: string;
  requirements: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
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

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
}

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  address?: string;
  resume?: File | null;
  coverLetter?: string;
}

interface JobNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'application' | 'status_update' | 'recommendation';
  read: boolean;
}

interface UserProfile {
  program: string;
  cgpa: string;
  jobTypes: string[];
  skills: string[];
  interests: string[];
  transcript: File | null;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
}

interface HostelPhoto {
  id: string;
  url: string;
  file?: File;
}

interface RoomPhoto {
  id: string;
  url: string;
  file?: File;
}

interface Room {
  id: string;
  name: string;
  amenities: string[];
  price: number;
  availableRooms: number;
  photos: RoomPhoto[];
  hostelId: string;
}

interface HostelData {
  id: string;
  name: string;
  location: string;
  description: string;
  availableRooms: number;
  photos: HostelPhoto[];
  rooms: Room[];
}

interface HostelNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'booking' | 'inquiry' | 'cancellation';
  read: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loginUserType, setLoginUserType] = useState<'student' | 'employer' | 'hostel-admin' | null>(null);
  const [signupUserType, setSignupUserType] = useState<'student' | 'employer' | 'hostel-admin' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'student' | 'employer' | 'hostel-admin' | null>(null);
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobNotifications, setJobNotifications] = useState<JobNotification[]>([]);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileUpdatedModal, setShowProfileUpdatedModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Job | null>(null);
  const [hostelsData, setHostelsData] = useState<HostelData[]>([
    {
      id: '1',
      name: "Stephanie's Hostel",
      location: "Westlands",
      description: "Stephanie's Hostel is located at Westlands, near Bethel Dental Clinic, on the 19th Street of Nii Lane. We have comfortable single and shared rooms coming at affordable prices. Each single room is equipped with modern amenities. Shared rooms are spacious and well-maintained.",
      availableRooms: 6,
      photos: [
        {
          id: '1',
          url: "https://images.unsplash.com/photo-1733348610896-52e34b27e70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBleHRlcmlvciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1ODc0NjQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        }
      ],
      rooms: [
        {
          id: '1',
          name: 'Room 1',
          amenities: ['Shared room of 4', 'Shared bathroom', 'Shared kitchen', 'Balcony'],
          price: 2000,
          availableRooms: 1,
          photos: [
            {
              id: '1',
              url: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtaXRvcnklMjByb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzU4NzQ2NTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            }
          ],
          hostelId: '1'
        },
        {
          id: '2',
          name: 'Room 5',
          amenities: ['Single room', 'Single bathroom', 'Single kitchen', 'Balcony'],
          price: 8000,
          availableRooms: 1,
          photos: [
            {
              id: '1',
              url: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtaXRvcnklMjByb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzU4NzQ2NTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            }
          ],
          hostelId: '1'
        }
      ]
    },
    {
      id: '2',
      name: "Joyous Hostel",
      location: "Dansoman",
      description: "A modern hostel with excellent facilities and comfortable accommodation for students.",
      availableRooms: 3,
      photos: [
        {
          id: '1',
          url: "https://images.unsplash.com/photo-1733348610896-52e34b27e70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBleHRlcmlvciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1ODc0NjQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        }
      ],
      rooms: [
        {
          id: '3',
          name: 'Room 10',
          amenities: ['Shared room of 4', 'Shared bathroom', 'Shared kitchen', 'Balcony'],
          price: 2000,
          availableRooms: 1,
          photos: [
            {
              id: '1',
              url: "https://images.unsplash.com/photo-1709805619372-40de3f158e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtaXRvcnklMjByb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzU4NzQ2NTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            }
          ],
          hostelId: '2'
        }
      ]
    }
  ]);
  const [hostelNotifications, setHostelNotifications] = useState<HostelNotification[]>([]);

  const handleJobAdded = (newJob: Job) => {
    setJobs(prev => [...prev, newJob]);
  };

  const handleDeleteJob = (jobId: number) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleViewJob = (job: Job) => {
    console.log('Viewing job:', job);
    // You can implement a job details modal or page here
  };

  const handleEditJob = (job: Job) => {
    console.log('Editing job:', job);
    // You can implement job editing functionality here
  };

  const handleShowLogin = (userType: 'student' | 'employer' | 'hostel-admin') => {
    setLoginUserType(userType);
    setCurrentPage('login');
  };

  const handleShowSignup = (userType: 'student' | 'employer' | 'hostel-admin') => {
    setSignupUserType(userType);
    setCurrentPage('signup');
  };

  const handleLogin = (credentials: { id: string; password: string }) => {
    console.log('Login attempted:', credentials);
    // Here you would typically validate credentials
    setIsAuthenticated(true);
    setUserType(loginUserType);
    
    // Route to appropriate dashboard based on user type
    if (loginUserType === 'student') {
      setCurrentPage('student-dashboard');
    } else if (loginUserType === 'hostel-admin') {
      setCurrentPage('hostel-management');
    } else {
      setCurrentPage('dashboard'); // employer dashboard
    }
  };

  const handleSignup = (userData: any) => {
    console.log('Signup attempted:', userData);
    // Here you would typically create the user account
    setIsAuthenticated(true);
    setUserType(signupUserType);
    
    // Route to appropriate dashboard based on user type
    if (signupUserType === 'student') {
      setCurrentPage('student-dashboard');
    } else if (signupUserType === 'hostel-admin') {
      setCurrentPage('hostel-management');
    } else {
      setCurrentPage('dashboard'); // employer dashboard
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setLoginUserType(null);
    setSignupUserType(null);
  };

  const handleBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    
    // Add notification for student
    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.roomName} at ${booking.hostelName} has been confirmed.`,
      date: new Date().toISOString(),
      type: 'success',
      read: false
    };
    setNotifications(prev => [...prev, notification]);

    // Add notification for hostel admin
    const hostelNotification: HostelNotification = {
      id: Date.now().toString(),
      title: 'New Booking',
      message: `A student has booked ${booking.roomName} at ${booking.hostelName}`,
      date: new Date().toLocaleDateString(),
      type: 'booking',
      read: false
    };
    setHostelNotifications(prev => [...prev, hostelNotification]);
  };

  const handleJobApplication = (application: JobApplication) => {
    setJobApplications(prev => [...prev, application]);
    
    // Add job notification
    const notification: JobNotification = {
      id: Date.now().toString(),
      title: 'Application Submitted',
      message: `Your application for ${application.jobTitle} at ${application.company} has been submitted successfully.`,
      date: new Date().toISOString(),
      type: 'application',
      read: false
    };
    setJobNotifications(prev => [...prev, notification]);
  };

  const handleApplyToJob = (job: Job) => {
    setSelectedJobForApplication(job);
    setCurrentPage('job-application');
  };

  const handleStartOnboarding = () => {
    setIsOnboardingActive(true);
  };

  const handleOnboardingComplete = (data: { 
    program: string; 
    cgpa: string; 
    jobTypes: string[]; 
    skills: string[]; 
    interests: string[]; 
    transcript: File | null;
  }) => {
    console.log('Onboarding completed:', data);
    
    // Create user profile from onboarding data
    const newProfile: UserProfile = {
      ...data,
      name: 'Student', // Default name, can be updated later
      email: '', // Will be filled when user edits profile
      phone: '',
      location: '',
      bio: '',
      profilePicture: ''
    };
    
    setUserProfile(newProfile);
    setIsOnboardingActive(false);
    setShowProfileUpdatedModal(true);
    
    // Add a welcome notification
    const notification: JobNotification = {
      id: Date.now().toString(),
      title: 'Profile Personalized',
      message: `Great! Your job feed has been personalized for ${data.program} students. Selected ${data.jobTypes.length} job types and ${data.skills.length + data.interests.length} skills/interests.`,
      date: new Date().toISOString(),
      type: 'recommendation',
      read: false
    };
    setJobNotifications(prev => [...prev, notification]);
  };

  const handleOnboardingCancel = () => {
    setIsOnboardingActive(false);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setShowProfileUpdatedModal(true);
    
    // Add profile update notification
    const notification: JobNotification = {
      id: Date.now().toString(),
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully.',
      date: new Date().toISOString(),
      type: 'status_update',
      read: false
    };
    setJobNotifications(prev => [...prev, notification]);
  };

  const renderCurrentPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'login':
          return (
            <LoginForm
              userType={loginUserType!}
              onBack={handleBackToLanding}
              onLogin={handleLogin}
            />
          );
        case 'signup':
          return (
            <SignupForm
              userType={signupUserType!}
              onBack={handleBackToLanding}
              onSignup={handleSignup}
            />
          );
        default:
          return (
            <LandingPage
              onShowLogin={handleShowLogin}
              onShowSignup={handleShowSignup}
            />
          );
      }
    }

    // Authenticated pages - Student
    if (userType === 'student') {
      switch (currentPage) {
        case 'student-dashboard':
          return <StudentDashboard />;
        case 'hostels':
          return (
            <HostelBooking
              onBack={() => setCurrentPage('student-dashboard')}
              onViewHostel={(hostelId) => {
                setSelectedHostelId(hostelId);
                setCurrentPage('hostel-details');
              }}
              bookings={bookings}
              notifications={notifications}
              hostelsData={hostelsData}
            />
          );
        case 'hostel-details':
          return (
            <HostelDetails
              onBack={() => setCurrentPage('hostels')}
              hostelId={selectedHostelId || ''}
              onBooking={handleBooking}
            />
          );
        case 'jobs':
          return (
            <JobsPage
              onStartOnboarding={handleStartOnboarding}
              applications={jobApplications}
              jobNotifications={jobNotifications}
              onApplyToJob={handleApplyToJob}
            />
          );
        case 'job-application':
          return selectedJobForApplication ? (
            <JobApplicationForm
              job={selectedJobForApplication}
              userProfile={userProfile}
              onBack={() => setCurrentPage('jobs')}
              onSubmitApplication={handleJobApplication}
            />
          ) : null;
        case 'chat':
          return (
            <UnibotChat userProfile={userProfile} />
          );
        case 'profile':
          return (
            <MyProfile
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          );
        default:
          return <StudentDashboard />;
      }
    }

    // Authenticated pages - Hostel Admin
    if (userType === 'hostel-admin') {
      return (
        <HostelManagementDashboard 
          hostels={hostelsData}
          setHostels={setHostelsData}
          notifications={hostelNotifications}
          setNotifications={setHostelNotifications}
        />
      );
    }

    // Authenticated pages - Employer
    switch (currentPage) {
      case 'dashboard':
        return (
          <JobPostingForm 
            onJobAdded={handleJobAdded}
            onNavigateToJobListings={() => setCurrentPage('job-listings')}
          />
        );
      case 'applications':
        return <ApplicationsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'candidates':
        return <CandidatesPage onBack={() => setCurrentPage('dashboard')} />;
      case 'job-listings':
        return (
          <JobListingsPage 
            jobs={jobs}
            onBack={() => setCurrentPage('dashboard')}
            onViewJob={handleViewJob}
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
          />
        );
      default:
        return (
          <JobPostingForm 
            onJobAdded={handleJobAdded}
            onNavigateToJobListings={() => setCurrentPage('job-listings')}
          />
        );
    }
  };

  // Show full-screen pages for non-authenticated users or onboarding
  if (!isAuthenticated || isOnboardingActive) {
    if (isOnboardingActive && isAuthenticated) {
      return (
        <>
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onCancel={handleOnboardingCancel}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        {renderCurrentPage()}
        <Toaster />
      </>
    );
  }

  // Show dashboard layout for authenticated users
  if (userType === 'hostel-admin') {
    // Hostel admin has integrated navigation in the dashboard
    return (
      <>
        {renderCurrentPage()}
        <ProfileUpdatedModal
          isOpen={showProfileUpdatedModal}
          onClose={() => setShowProfileUpdatedModal(false)}
          isInitialSetup={userProfile && !userProfile.email}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {userType === 'student' ? (
        <StudentNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      ) : (
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <ProfileUpdatedModal
        isOpen={showProfileUpdatedModal}
        onClose={() => setShowProfileUpdatedModal(false)}
        isInitialSetup={userProfile && !userProfile.email}
      />
      <Toaster />
    </div>
  );
}
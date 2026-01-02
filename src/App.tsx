import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { StudentNavigation } from "./components/StudentNavigation";
import { JobPostingForm } from "./components/JobPostingForm";
import { ApplicationsPage } from "./components/ApplicationsPage";
import { CandidatesPage } from "./components/CandidatesPage";
import { JobListingsPage } from "./components/JobListingsPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { HostelManagementDashboard } from "./components/HostelManagementDashboard";
import { HostelBooking } from "./components/HostelBooking";
import { HostelDetails } from "./components/HostelDetails";
import { JobsPage } from "./components/JobsPage";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { MyProfile } from "./components/MyProfile";
import { ProfileUpdatedModal } from "./components/ProfileUpdatedModal";
import { JobApplicationForm } from "./components/JobApplicationForm";
import { UnibotChat } from "./components/UnibotChat";
import { LandingPage } from "./components/LandingPage";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { Toaster } from "./components/ui/sonner";

interface Job {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  description: string;
  requirements: string;
  applications: number;
  status: "active" | "closed" | "draft";
}

interface Booking {
  id: string;
  hostelName: string;
  roomName: string;
  roomType: string;
  price: string;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
  image: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "success" | "info" | "warning";
  read: boolean;
}

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  address?: string;
  resume?: File | null;
  coverLetter?: string;
}

interface JobNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "application" | "status_update" | "recommendation";
  read: boolean;
}

interface UserProfile {
  program: string;
  cgpa: string;
  jobTypes: string[];
  skills: string[];
  interests: string[];
  transcript:
    | File
    | {
        url?: string;
        filename?: string;
      }
    | null;
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
  type: "booking" | "inquiry" | "cancellation";
  read: boolean;
}

// Protected Route Component
function ProtectedRoute({
  children,
  isAuthenticated,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}) {
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
}

// Layout Components
function DashboardLayout({
  children,
  userType,
  onLogout,
}: {
  children: React.ReactNode;
  userType: "student" | "employer" | "hostel-admin" | null;
  onLogout: () => void;
}) {
  if (userType === "hostel-admin") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {userType === "student" ? (
        <StudentNavigation onLogout={onLogout} />
      ) : (
        <Navigation onLogout={onLogout} />
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is authenticated on mount
    return !!localStorage.getItem("token");
  });
  const [userType, setUserType] = useState<
    "student" | "employer" | "hostel-admin" | null
  >(() => {
    // Restore user type from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.userType || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobNotifications, setJobNotifications] = useState<JobNotification[]>(
    []
  );
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileUpdatedModal, setShowProfileUpdatedModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState<Job | null>(null);
  const [hostelNotifications, setHostelNotifications] = useState<
    HostelNotification[]
  >([]);

  const [hostelsData, setHostelsData] = useState<HostelData[]>([
    {
      id: "1",
      name: "Stephanie's Hostel",
      location: "Westlands",
      description:
        "Stephanie's Hostel is located at Westlands, near Bethel Dental Clinic, on the 19th Street of Nii Lane.",
      availableRooms: 6,
      photos: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1733348610896-52e34b27e70d",
        },
      ],
      rooms: [
        {
          id: "1",
          name: "Room 1",
          amenities: [
            "Shared room of 4",
            "Shared bathroom",
            "Shared kitchen",
            "Balcony",
          ],
          price: 2000,
          availableRooms: 1,
          photos: [
            {
              id: "1",
              url: "https://images.unsplash.com/photo-1709805619372-40de3f158e83",
            },
          ],
          hostelId: "1",
        },
      ],
    },
  ]);

  // Fetch user profile on mount if authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const { getCurrentUser } = await import("./services/user.service");
          const response = await getCurrentUser();
          if (response && response.data) {
            const userData = response.data;
            setUserProfile({
              program: userData.program || "",
              cgpa: userData.cgpa || "",
              jobTypes: userData.jobTypes || [],
              skills: userData.skills || [],
              interests: userData.interests || [],
              transcript: userData.transcript || null,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              location: userData.location,
              bio: userData.bio,
              profilePicture: userData.profilePicture,
            });

            // If user hasn't completed onboarding, start it
            if (!userData.profileCompleted && userType === "student") {
              setIsOnboardingActive(true);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, userType]);

  // Fetch jobs for employers
  useEffect(() => {
    const fetchEmployerJobs = async () => {
      if (isAuthenticated && userType === "employer") {
        try {
          const response = await fetch("http://localhost:5001/api/jobs", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              // Transform API response to match component interface
              const transformedJobs = result.data.map((job: any) => ({
                id: job._id,
                title: job.title,
                company: job.company,
                location: job.location,
                type: job.type,
                minSalary: job.salary?.min?.toString() || "0",
                maxSalary: job.salary?.max?.toString() || "0",
                description: job.description,
                requirements: Array.isArray(job.requirements)
                  ? job.requirements.join(", ")
                  : job.requirements || "",
                deadline: job.applicationDeadline
                  ? new Date(job.applicationDeadline).toLocaleDateString()
                  : "Not set",
                applications: job.applicationsCount || 0,
                status: job.status || "active",
              }));
              setJobs(transformedJobs);
            }
          }
        } catch (error) {
          console.error("Error fetching employer jobs:", error);
        }
      }
    };

    fetchEmployerJobs();
  }, [isAuthenticated, userType]);

  // Handlers
  const handleJobAdded = (job: any) => {
    // Transform the newly created job to match the component interface
    const newJob: Job = {
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      minSalary: job.salary?.min?.toString() || "0",
      maxSalary: job.salary?.max?.toString() || "0",
      description: job.description,
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join(", ")
        : job.requirements || "",
      deadline: job.applicationDeadline
        ? new Date(job.applicationDeadline).toLocaleDateString()
        : "Not set",
      applications: job.applicationsCount || 0,
      status: job.status || "active",
    };

    // Add the new job to the local state so it appears immediately
    setJobs((prev) => [...prev, newJob]);
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // Remove from local state
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        console.log("Job deleted successfully");
      } else {
        console.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleViewJob = (job: Job) => {
    console.log("Viewing job:", job);
  };

  const handleEditJob = (job: Job) => {
    console.log("Editing job:", job);
  };

  const handleShowLogin = () => {
    navigate("/login");
  };

  const handleShowSignup = () => {
    navigate("/signup");
  };

  const handleLogin = async (credentials: {
    id: string;
    password: string;
    userType: "student" | "employer" | "hostel-admin";
  }) => {
    try {
      console.log("Login attempted:", credentials);
      const { login } = await import("./services/auth.service");

      // Call the login API - id field is used as email
      const response = await login(credentials.id, credentials.password);

      console.log("Login successful:", response);
      setIsAuthenticated(true);
      setUserType(credentials.userType);

      // Fetch user-specific data after login
      if (credentials.userType === "student") {
        await fetchStudentData();
        navigate("/student/dashboard");
      } else if (credentials.userType === "employer") {
        await fetchEmployerData();
        navigate("/employer/dashboard");
      } else {
        navigate("/hostel/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      console.log("Signup attempted:", userData);
      // Import register at the top if not already imported
      const { register } = await import("./services/auth.service");

      // Call the register API with the correct fields
      const response = await register(
        userData.email,
        userData.password,
        userData.fullName,
        userData.userType
      );

      console.log("Signup successful:", response);
      setIsAuthenticated(true);
      setUserType(userData.userType);

      if (userData.userType === "student") {
        navigate("/student/dashboard");
      } else if (userData.userType === "hostel-admin") {
        navigate("/hostel/dashboard");
      } else {
        navigate("/employer/dashboard");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      alert(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setIsAuthenticated(false);
    setUserType(null);

    // Navigate to home
    navigate("/");
  };

  const handleBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);

    const notification: Notification = {
      id: Date.now().toString(),
      title: "Booking Confirmed",
      message: `Your booking for ${booking.roomName} at ${booking.hostelName} has been confirmed.`,
      date: new Date().toISOString(),
      type: "success",
      read: false,
    };
    setNotifications((prev) => [...prev, notification]);

    const hostelNotification: HostelNotification = {
      id: Date.now().toString(),
      title: "New Booking",
      message: `A student has booked ${booking.roomName} at ${booking.hostelName}`,
      date: new Date().toLocaleDateString(),
      type: "booking",
      read: false,
    };
    setHostelNotifications((prev) => [...prev, hostelNotification]);
  };

  const fetchStudentData = async () => {
    try {
      const { getMyApplications } = await import("./services/job.service");
      const applicationsResponse = await getMyApplications();
      if (applicationsResponse.success) {
        // Transform backend data to match frontend interface
        const transformedApplications = applicationsResponse.data.map(
          (app: any) => ({
            id: app._id,
            jobTitle: app.job?.title || "Unknown Job",
            company: app.job?.company || "Unknown Company",
            appliedDate: new Date(app.createdAt).toLocaleDateString(),
            status: app.status,
          })
        );
        setJobApplications(transformedApplications);
      }
    } catch (error) {
      console.error("Error fetching student applications:", error);
    }
  };

  const fetchEmployerData = async () => {
    try {
      // Fetch employer's jobs if needed
      const { getMyJobs } = await import("./services/job.service");
      const jobsResponse = await getMyJobs();
      if (jobsResponse.success) {
        setJobs(jobsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching employer data:", error);
    }
  };

  const handleJobApplication = async (application: JobApplication) => {
    try {
      // Submit application to backend
      const { applyForJob } = await import("./services/job.service");

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("coverLetter", application.coverLetter);
      formData.append("address", application.address);
      if (application.resume) {
        formData.append("resume", application.resume);
      }

      const response = await applyForJob(
        selectedJobForApplication.id.toString(),
        formData
      );

      if (response.success) {
        // Add to local state
        const newApplication = {
          id: response.data._id,
          jobTitle: selectedJobForApplication.title,
          company: selectedJobForApplication.company,
          appliedDate: new Date(response.data.createdAt).toLocaleDateString(),
          status: response.data.status,
        };
        setJobApplications((prev) => [...prev, newApplication]);

        // Create notification
        const notification: JobNotification = {
          id: Date.now().toString(),
          title: "Application Submitted",
          message: `Your application for ${selectedJobForApplication.title} at ${selectedJobForApplication.company} has been submitted successfully.`,
          date: new Date().toISOString(),
          type: "application",
          read: false,
        };
        setJobNotifications((prev) => [...prev, notification]);

        toast.success("Application submitted successfully!");
        navigate("/student/jobs");
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
    }
  };

  const handleApplyToJob = (job: Job) => {
    setSelectedJobForApplication(job);
    navigate("/student/job-application");
  };

  const handleStartOnboarding = () => {
    setIsOnboardingActive(true);
  };

  const handleOnboardingComplete = async (data: UserProfile) => {
    try {
      console.log("Onboarding completed:", data);
      const { completeOnboarding } = await import("./services/user.service");
      await completeOnboarding(data);

      // Re-fetch user profile to get updated data from server
      const { getCurrentUser } = await import("./services/user.service");
      const response = await getCurrentUser();
      if (response && response.data) {
        const userData = response.data;
        setUserProfile({
          program: userData.program || "",
          cgpa: userData.cgpa || "",
          jobTypes: userData.jobTypes || [],
          skills: userData.skills || [],
          interests: userData.interests || [],
          transcript: userData.transcript || null,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          bio: userData.bio,
          profilePicture: userData.profilePicture,
        });
      }

      setIsOnboardingActive(false);
      setShowProfileUpdatedModal(true);

      const notification: JobNotification = {
        id: Date.now().toString(),
        title: "Profile Personalized",
        message: `Great! Your job feed has been personalized.`,
        date: new Date().toISOString(),
        type: "recommendation",
        read: false,
      };
      setJobNotifications((prev) => [...prev, notification]);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Still set the profile locally even if API fails
      setUserProfile(data);
      setIsOnboardingActive(false);
      setShowProfileUpdatedModal(true);
    }
  };

  const handleOnboardingCancel = () => {
    setIsOnboardingActive(false);
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    try {
      const { updateProfile } = await import("./services/user.service");
      await updateProfile(updatedProfile);
      setUserProfile(updatedProfile);
      setShowProfileUpdatedModal(true);

      const notification: JobNotification = {
        id: Date.now().toString(),
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        date: new Date().toISOString(),
        type: "status_update",
        read: false,
      };
      setJobNotifications((prev) => [...prev, notification]);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Still update locally even if API fails
      setUserProfile(updatedProfile);
      setShowProfileUpdatedModal(true);
    }
  };

  // Onboarding overlay
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
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to={
                  userType === "student"
                    ? "/student/dashboard"
                    : userType === "hostel-admin"
                    ? "/hostel/dashboard"
                    : "/employer/dashboard"
                }
                replace
              />
            ) : (
              <LandingPage
                onLogin={handleShowLogin}
                onSignup={handleShowSignup}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={
                  userType === "student"
                    ? "/student/dashboard"
                    : userType === "hostel-admin"
                    ? "/hostel/dashboard"
                    : "/employer/dashboard"
                }
                replace
              />
            ) : (
              <LoginForm onLogin={handleLogin} onBack={handleBackToLanding} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate
                to={
                  userType === "student"
                    ? "/student/dashboard"
                    : userType === "hostel-admin"
                    ? "/hostel/dashboard"
                    : "/employer/dashboard"
                }
                replace
              />
            ) : (
              <SignupForm
                onSignup={handleSignup}
                onBack={handleBackToLanding}
              />
            )
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && userType === "student"}
            >
              <DashboardLayout userType={userType} onLogout={handleLogout}>
                <Routes>
                  <Route
                    path="dashboard"
                    element={
                      <StudentDashboard
                        bookings={bookings}
                        notifications={notifications}
                        setNotifications={setNotifications}
                        jobApplications={jobApplications}
                        jobNotifications={jobNotifications}
                        setJobNotifications={setJobNotifications}
                        onStartOnboarding={handleStartOnboarding}
                      />
                    }
                  />
                  <Route path="hostels" element={<HostelBooking />} />
                  <Route
                    path="hostel-details"
                    element={
                      <HostelDetails
                        hostelId={selectedHostelId || "1"}
                        onBooking={handleBooking}
                      />
                    }
                  />
                  <Route
                    path="jobs"
                    element={
                      <JobsPage
                        onApplyToJob={handleApplyToJob}
                        onStartOnboarding={handleStartOnboarding}
                        applications={jobApplications}
                        jobNotifications={jobNotifications}
                      />
                    }
                  />
                  <Route
                    path="job-application"
                    element={
                      <JobApplicationForm
                        job={selectedJobForApplication}
                        onSubmit={handleJobApplication}
                      />
                    }
                  />
                  <Route path="chat" element={<UnibotChat />} />
                  <Route
                    path="profile"
                    element={
                      <MyProfile
                        userProfile={userProfile}
                        onUpdateProfile={handleUpdateProfile}
                      />
                    }
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/student/dashboard" replace />}
                  />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Employer Routes */}
        <Route
          path="/employer/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && userType === "employer"}
            >
              <DashboardLayout userType={userType} onLogout={handleLogout}>
                <Routes>
                  <Route
                    path="dashboard"
                    element={<JobPostingForm onJobAdded={handleJobAdded} />}
                  />
                  <Route
                    path="job-listings"
                    element={
                      <JobListingsPage
                        jobs={jobs}
                        onViewJob={handleViewJob}
                        onEditJob={handleEditJob}
                        onDeleteJob={handleDeleteJob}
                      />
                    }
                  />
                  <Route path="applications" element={<ApplicationsPage />} />
                  <Route path="candidates" element={<CandidatesPage />} />
                  <Route
                    path="*"
                    element={<Navigate to="/employer/dashboard" replace />}
                  />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Hostel Admin Routes */}
        <Route
          path="/hostel/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && userType === "hostel-admin"}
            >
              <DashboardLayout userType={userType} onLogout={handleLogout}>
                <Routes>
                  <Route
                    path="dashboard"
                    element={
                      <HostelManagementDashboard
                        hostels={hostelsData}
                        setHostels={setHostelsData}
                        notifications={hostelNotifications}
                        setNotifications={setHostelNotifications}
                        onLogout={handleLogout}
                      />
                    }
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/hostel/dashboard" replace />}
                  />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ProfileUpdatedModal
        isOpen={showProfileUpdatedModal}
        onClose={() => setShowProfileUpdatedModal(false)}
        isInitialSetup={userProfile && !userProfile.email}
      />
      <Toaster />
    </>
  );
}

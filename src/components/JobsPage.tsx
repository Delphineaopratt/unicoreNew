import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { OnboardingFlow } from "./OnboardingFlow";
import { useNavigate, useLocation } from "react-router-dom";

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}

interface JobNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "application" | "status_update" | "recommendation";
  read: boolean;
}

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  company: string;
  description: string;
  requirements: string;
}

interface JobsPageProps {
  onStartOnboarding?: () => void;
  onApplyToJob: (job: Job) => void;
}

export function JobsPage({ onStartOnboarding, onApplyToJob }: JobsPageProps) {
  const [activeTab, setActiveTab] = useState("featured");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobNotifications, setJobNotifications] = useState<JobNotification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/jobs");
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
            }));
            setJobs(transformedJobs);
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch applications and notifications
  useEffect(() => {
    const fetchStudentData = async () => {
      // Check if we need to refresh data
      const shouldRefresh = localStorage.getItem("refreshJobData") === "true";
      if (shouldRefresh) {
        localStorage.removeItem("refreshJobData");
      }

      try {
        const { getMyApplications, getNotifications } = await import(
          "../services/job.service"
        );

        // Fetch applications
        const applicationsResponse = await getMyApplications();
        if (applicationsResponse.success) {
          const transformedApplications = applicationsResponse.data.map(
            (app: any) => ({
              id: app._id,
              jobTitle: app.job.title,
              company: app.job.company,
              appliedDate: new Date(app.createdAt).toLocaleDateString(),
              status: app.status,
            })
          );
          setApplications(transformedApplications);
        }

        // Fetch notifications
        const notificationsResponse = await getNotifications();
        if (notificationsResponse.success) {
          const transformedNotifications = notificationsResponse.data.map(
            (notif: any) => ({
              id: notif._id,
              title: notif.title,
              message: notif.message,
              date: new Date(notif.createdAt).toISOString(),
              type: notif.type,
              read: notif.read,
            })
          );
          setJobNotifications(transformedNotifications);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load your applications and notifications");
      }
    };

    fetchStudentData();
  }, [location]);

  // Check for navigation state to set active tab
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleApplyNow = (job: Job) => {
    onApplyToJob(job);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-8 rounded-lg mx-6 mt-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Find Your Career. You Deserve it.
            </h1>
            <p className="text-blue-100">
              Explore job and internship opportunities tailored to your field of
              study.
            </p>
          </div>
          <Button
            onClick={onStartOnboarding}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Personalize Job Feed
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Featured Jobs
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
            >
              History
              {applications.filter(
                (app) =>
                  new Date().getTime() - new Date(app.appliedDate).getTime() <
                  3600000
              ).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {
                    applications.filter(
                      (app) =>
                        new Date().getTime() -
                          new Date(app.appliedDate).getTime() <
                        3600000
                    ).length
                  }
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
            >
              Notifications
              {jobNotifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {jobNotifications.filter((n) => !n.read).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-6">
            <h2 className="text-xl font-semibold mb-6">Featured Jobs</h2>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No jobs available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      at {job.company} • {job.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      GHC {job.minSalary} - {job.maxSalary}
                    </p>
                    <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2">
                      {job.type}
                    </span>
                    <p className="text-sm text-gray-500 mb-4">
                      Deadline: 30-11-2025
                    </p>
                    <Button
                      onClick={() => handleApplyNow(job)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <h2 className="text-xl font-semibold mb-6">Application History</h2>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No applications yet. Start applying to jobs to see your
                  history!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const isNewApplication =
                    new Date().getTime() -
                      new Date(application.appliedDate).getTime() <
                    3600000; // Within last hour

                  return (
                    <div
                      key={application.id}
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {application.jobTitle}
                            </h3>
                            {isNewApplication && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {application.company}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied on{" "}
                            {new Date(
                              application.appliedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : application.status === "reviewed"
                              ? "bg-blue-100 text-blue-800"
                              : application.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            {jobNotifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 shadow-sm ${
                      notification.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "application"
                            ? "bg-blue-500"
                            : notification.type === "status_update"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

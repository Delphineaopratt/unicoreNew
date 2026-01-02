import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { OnboardingFlow } from "./OnboardingFlow";
import { useNavigate } from "react-router-dom";

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
  applications?: JobApplication[];
  jobNotifications?: JobNotification[];
  onApplyToJob: (job: Job) => void;
}

export function JobsPage({
  onStartOnboarding,
  applications = [],
  jobNotifications = [],
  onApplyToJob,
}: JobsPageProps) {
  const [activeTab, setActiveTab] = useState("featured");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Notifications
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
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {application.jobTitle}
                        </h3>
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
                ))}
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
                    className="bg-white border rounded-lg p-4 shadow-sm"
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

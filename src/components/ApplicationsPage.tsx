import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../services/job.service";
import { JobApplication } from "../types";

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getEmployerApplications();
        if (response.success) {
          setApplications(response.data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: JobApplication["status"]
  ) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Application ${newStatus}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "pending":
        return {
          className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-medium",
          text: "Status: Pending",
        };
      case "reviewed":
        return {
          className: "bg-blue-100 text-blue-800 hover:bg-blue-100 font-medium",
          text: "Status: Reviewed",
        };
      case "shortlisted":
        return {
          className:
            "bg-green-100 text-green-800 hover:bg-green-100 font-medium",
          text: "Status: Shortlisted",
        };
      case "accepted":
        return {
          className:
            "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-medium",
          text: "Status: Accepted",
        };
      case "rejected":
        return {
          className: "bg-red-100 text-red-800 hover:bg-red-100 font-medium",
          text: "Status: Rejected",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800 hover:bg-gray-100 font-medium",
          text: "Status: Unknown",
        };
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Applications
            </h1>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {applications.map((application) => {
              const statusProps = getStatusBadgeProps(application.status);

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      {/* Left section: Profile + Info */}
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {(application.student as any)?.name?.charAt(0) ||
                                "U"}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {(application.student as any)?.name ||
                              "Unknown Student"}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Applied for:{" "}
                            {(application.job as any)?.title ||
                              "Unknown Position"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            at{" "}
                            {(application.job as any)?.company ||
                              "Unknown Company"}
                          </p>
                        </div>
                      </div>

                      {/* Center section: Status Badge */}
                      <div className="flex justify-center lg:justify-start">
                        <Badge
                          className={`${statusProps.className} px-4 py-2 text-sm`}
                        >
                          {statusProps.text}
                        </Badge>
                      </div>

                      {/* Right section: Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                        {/* View Buttons */}
                        <div className="flex gap-3">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium"
                            onClick={() =>
                              window.open(
                                (application.resume as any)?.url,
                                "_blank"
                              )
                            }
                          >
                            View Resume
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium"
                            onClick={() =>
                              console.log(
                                "View profile for",
                                (application.student as any)?.name
                              )
                            }
                          >
                            View Profile
                          </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {application.status !== "rejected" &&
                            application.status !== "accepted" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2 font-medium"
                                onClick={() =>
                                  handleStatusChange(
                                    application._id,
                                    "rejected"
                                  )
                                }
                              >
                                Reject
                              </Button>
                            )}
                          {application.status === "pending" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium"
                              onClick={() =>
                                handleStatusChange(
                                  application._id,
                                  "shortlisted"
                                )
                              }
                            >
                              Shortlist
                            </Button>
                          )}
                          {application.status === "shortlisted" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium"
                              onClick={() =>
                                handleStatusChange(application._id, "accepted")
                              }
                            >
                              Accept
                            </Button>
                          )}
                          {(application.status === "accepted" ||
                            application.status === "rejected") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-100 text-gray-500 border-gray-200 px-4 py-2 font-medium cursor-not-allowed"
                              disabled
                            >
                              {application.status === "accepted"
                                ? "Accepted"
                                : "Rejected"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

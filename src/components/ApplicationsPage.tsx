import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  getEmployerApplications,
  updateApplicationStatus,
  verifyTranscript,
} from "../services/job.service";
import { JobApplication } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
    newStatus: JobApplication["status"],
  ) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app,
        ),
      );
      toast.success(`Application ${newStatus}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const handleVerifyTranscript = async (id: string) => {
    try {
      const response = await verifyTranscript(id);
      if (response.success) {
        toast.success("Transcript verification email sent to student's school");
      } else {
        toast.error(response.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send transcript verification request");
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

  const getFileUrl = (fileData: any) => {
    if (!fileData) return null;

    // If it's an object with a url property, use that
    if (typeof fileData === "object" && fileData.url) {
      const url = fileData.url;
      // If URL is relative, prepend the backend base URL
      if (url.startsWith("/")) {
        return `http://localhost:5001${url}`;
      }
      return url;
    }

    // If it's a string (legacy format)
    if (typeof fileData === "string") {
      if (fileData.startsWith("/")) {
        return `http://localhost:5001${fileData}`;
      }
      return fileData;
    }

    return null;
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
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const response = await getEmployerApplications();
                  if (response.success) {
                    setApplications(response.data);
                    toast.success("Applications refreshed");
                  }
                } catch (error) {
                  console.error("Error fetching applications:", error);
                  toast.error("Failed to refresh applications");
                } finally {
                  setLoading(false);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
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
                        {/* View Details Button */}
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailsModal(true);
                          }}
                        >
                          View Details
                        </Button>

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
                                    "rejected",
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
                                  "shortlisted",
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

      {/* Application Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent
          className="max-w-2xl w-full p-0 flex flex-col"
          style={{
            maxHeight: "90vh",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-white">
            <DialogTitle className="text-2xl">Application Details</DialogTitle>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </DialogHeader>

          {selectedApplication && (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                paddingLeft: "24px",
                paddingRight: "12px",
                paddingTop: "24px",
                paddingBottom: "24px",
              }}
            >
              <div className="space-y-6 pr-4">
                {/* Student Profile Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Student Profile
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-2xl">
                        {(selectedApplication.student as any)?.name?.charAt(
                          0,
                        ) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {(selectedApplication.student as any)?.name ||
                          "Unknown Student"}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-blue-600" />
                          <span>
                            {(selectedApplication.student as any)?.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-blue-600" />
                          <span>
                            {(selectedApplication.student as any)?.phone ||
                              "Not provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-blue-600" />
                          <span>
                            {selectedApplication.address || "Not provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-blue-600" />
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Program
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedApplication.student as any)?.program ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">CGPA</p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedApplication.student as any)?.cgpa ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {(selectedApplication.student as any)?.skills &&
                    (selectedApplication.student as any).skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 font-medium mb-2">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedApplication.student as any).skills.map(
                            (skill: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* School Information Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-purple-600" />
                    School Information
                  </h3>
                  {(selectedApplication.student as any)?.school ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            School Name
                          </p>
                          <p className="text-gray-900 font-semibold">
                            {(selectedApplication.student as any)?.school
                              ?.name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            School Email
                          </p>
                          <p className="text-gray-900 font-semibold break-all">
                            {(selectedApplication.student as any)?.school
                              ?.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                      {(selectedApplication.student as any)?.school
                        ?.address && (
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-1">
                            School Address
                          </p>
                          <p className="text-gray-900 font-semibold whitespace-pre-wrap">
                            {
                              (selectedApplication.student as any)?.school
                                ?.address
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No school information provided
                    </p>
                  )}
                </div>

                {/* Application Information Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Application Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Position</p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedApplication.job as any)?.title ||
                          "Unknown Position"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Company</p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedApplication.job as any)?.company ||
                          "Unknown Company"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">
                        Application Status
                      </p>
                      <Badge
                        className={`mt-1 ${getStatusBadgeProps(selectedApplication.status).className}`}
                      >
                        {getStatusBadgeProps(selectedApplication.status).text}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Applied Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(
                          selectedApplication.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cover Letter Section */}
                {selectedApplication.coverLetter && (
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Cover Letter
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}

                {/* Documents Section */}
                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Documents
                  </h3>
                  <div className="space-y-3">
                    {selectedApplication.resume ? (
                      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText
                            size={20}
                            className="text-red-500 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              Resume
                            </p>
                            <p className="text-xs text-gray-600">
                              {typeof selectedApplication.resume === "object"
                                ? selectedApplication.resume.filename ||
                                  "resume.pdf"
                                : "resume.pdf"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-200 ml-2 flex-shrink-0 font-semibold"
                          onClick={() => {
                            const url = getFileUrl(selectedApplication.resume);
                            if (url) {
                              window.open(url, "_blank", "noopener,noreferrer");
                              toast.success("Opening resume...");
                            } else {
                              toast.error("Resume URL not available");
                            }
                          }}
                        >
                          View Resume
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-400" />
                          <p className="text-gray-500 italic">
                            No resume uploaded
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.transcript ? (
                      <div className="flex items-center justify-between bg-purple-50 border border-purple-200 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText
                            size={20}
                            className="text-purple-500 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              Transcript
                            </p>
                            <p className="text-xs text-gray-600">
                              {typeof selectedApplication.transcript ===
                              "object"
                                ? selectedApplication.transcript.filename ||
                                  "transcript.pdf"
                                : "transcript.pdf"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-200 ml-2 flex-shrink-0 font-semibold"
                          onClick={() => {
                            const url = getFileUrl(
                              selectedApplication.transcript,
                            );
                            if (url) {
                              window.open(url, "_blank", "noopener,noreferrer");
                              toast.success("Opening transcript...");
                            } else {
                              toast.error("Transcript URL not available");
                            }
                          }}
                        >
                          View Transcript
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-400" />
                          <p className="text-gray-500 italic">
                            No transcript uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2 flex-wrap">
                  {selectedApplication.status !== "rejected" &&
                    selectedApplication.status !== "accepted" && (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          handleStatusChange(
                            selectedApplication._id,
                            "rejected",
                          );
                          setShowDetailsModal(false);
                        }}
                      >
                        Reject Application
                      </Button>
                    )}
                  {selectedApplication.status === "pending" && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleStatusChange(
                          selectedApplication._id,
                          "shortlisted",
                        );
                        setShowDetailsModal(false);
                      }}
                    >
                      Shortlist Candidate
                    </Button>
                  )}
                  {selectedApplication.status === "shortlisted" && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        handleStatusChange(selectedApplication._id, "accepted");
                        setShowDetailsModal(false);
                      }}
                    >
                      Accept Candidate
                    </Button>
                  )}
                  {selectedApplication.transcript &&
                    (selectedApplication.student as any)?.school?.email && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          handleVerifyTranscript(selectedApplication._id);
                        }}
                      >
                        Verify Transcript
                      </Button>
                    )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

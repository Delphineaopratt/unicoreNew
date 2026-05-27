import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { getShortlistedCandidates } from "../services/job.service";
import { JobApplication } from "../types";
import { API_BASE } from "../services/api";

interface Candidate extends JobApplication {
  student: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    program?: string;
    cgpa?: string;
    school?: {
      _id: string;
      name: string;
      email?: string;
      address?: string;
    };
  };
  job: {
    _id: string;
    title: string;
    company: string;
  };
}

export function CandidatesPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactCandidate, setContactCandidate] = useState<Candidate | null>(
    null,
  );

  const getFileUrl = (fileData: any) => {
    if (!fileData) return null;

    // Schema stores resume/transcript as { url, filename }
    if (typeof fileData === "object" && fileData.url) {
      if (fileData.url.startsWith("/")) {
        const BACKEND_BASE = API_BASE.replace(/\/api\/?$/, "");
        return `${BACKEND_BASE}${fileData.url}`;
      }
      return fileData.url;
    }

    // Legacy fallback where file value may be a plain string URL/path
    if (typeof fileData === "string") {
      if (fileData.startsWith("/")) {
        const BACKEND_BASE = API_BASE.replace(/\/api\/?$/, "");
        return `${BACKEND_BASE}${fileData}`;
      }
      return fileData;
    }

    return null;
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await getShortlistedCandidates();
        if (response.success) {
          setCandidates(response.data);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to load candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

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
            <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No shortlisted candidates yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {(() => {
                    const resumeUrl = getFileUrl(candidate.resume);
                    const transcriptUrl = getFileUrl(candidate.transcript);

                    return (
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                          {/* Left section: Profile + Info */}
                          <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {candidate.student.name?.charAt(0) || "U"}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {candidate.student.name || "Unknown"}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                Applied for: {candidate.job.title}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {candidate.student.email}
                              </p>
                              {candidate.student.program && (
                                <p className="text-gray-500 text-xs mt-1">
                                  Program: {candidate.student.program}
                                </p>
                              )}
                              {candidate.student.school?.name && (
                                <p className="text-gray-500 text-xs">
                                  School: {candidate.student.school.name}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Center section: Status Badge */}
                          <div className="flex justify-center lg:justify-start">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium px-4 py-2 text-sm">
                              Status: Shortlisted
                            </Badge>
                          </div>

                          {/* Right section: Document Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                            {/* View Documents */}
                            <div className="flex gap-2 flex-wrap">
                              {resumeUrl && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium text-xs"
                                  onClick={() =>
                                    window.open(resumeUrl, "_blank")
                                  }
                                >
                                  View Resume
                                </Button>
                              )}
                              {transcriptUrl && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-medium text-xs"
                                  onClick={() =>
                                    window.open(transcriptUrl, "_blank")
                                  }
                                >
                                  View Transcript
                                </Button>
                              )}
                            </div>

                            {/* Contact Button */}
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium whitespace-nowrap"
                              onClick={() => setContactCandidate(candidate)}
                            >
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(contactCandidate)}
        onOpenChange={(open) => {
          if (!open) setContactCandidate(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Candidate Contact</DialogTitle>
            <DialogDescription>
              Contact information uploaded by the student.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-gray-600">Name</span>
              <span className="font-medium text-gray-900 text-right">
                {contactCandidate?.student?.name || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium text-gray-900 text-right">
                {contactCandidate?.student?.phone?.trim() ||
                  "No phone number uploaded"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900 text-right break-all">
                {contactCandidate?.student?.email || "No email uploaded"}
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" onClick={() => setContactCandidate(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

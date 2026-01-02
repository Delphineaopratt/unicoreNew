import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  User,
  MapPin,
  Briefcase,
  AlertCircle,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Heart,
  FileCheck,
} from "lucide-react";
import {
  validateAddress,
  validateCoverLetter,
  validateFile,
} from "../utils/validation";
import { toast } from "sonner";
import { UserProfile } from "../types/index";

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

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  address: string;
  resume: File | null;
  coverLetter: string;
}

interface JobApplicationFormProps {
  job: Job | null;
  onSubmit: (application: JobApplication) => void;
}

export function JobApplicationForm({ job, onSubmit }: JobApplicationFormProps) {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [coverLetterError, setCoverLetterError] = useState("");

  // Load user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { getCurrentUser } = await import("../services/user.service");
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
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile information");
      }
    };

    fetchUserProfile();
  }, []);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file, {
        maxSizeMB: 5,
        allowedTypes: [".pdf", ".doc", ".docx"],
        required: true,
      });

      if (!validation.isValid) {
        setResumeError(validation.error || "");
        setResume(null);
        toast.error(validation.error);
        return;
      }

      setResume(file);
      setResumeError("");
      toast.success("Resume uploaded successfully");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAddress(value);

    // Clear error when user starts typing
    if (addressError && value.trim().length > 0) {
      setAddressError("");
    }
  };

  const handleCoverLetterChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setCoverLetter(value);

    // Clear error when user starts typing
    if (coverLetterError && value.trim().length > 0) {
      setCoverLetterError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setAddressError("");
    setResumeError("");
    setCoverLetterError("");

    // Validate all fields
    let hasErrors = false;

    const addressValidation = validateAddress(address);
    if (!addressValidation.isValid) {
      setAddressError(addressValidation.error || "");
      hasErrors = true;
    }

    const resumeValidation = validateFile(resume, {
      maxSizeMB: 5,
      allowedTypes: [".pdf", ".doc", ".docx"],
      required: true,
    });
    if (!resumeValidation.isValid) {
      setResumeError(resumeValidation.error || "");
      hasErrors = true;
    }

    const coverLetterValidation = validateCoverLetter(coverLetter);
    if (!coverLetterValidation.isValid) {
      setCoverLetterError(coverLetterValidation.error || "");
      hasErrors = true;
    }

    if (hasErrors) {
      const isFormValid = () => {
        return (
          address.trim() !== "" &&
          resume !== null &&
          coverLetter.trim().length >= 100 &&
          !addressError &&
          !resumeError &&
          !coverLetterError
        );
      };
      return;
    }

    setIsSubmitting(true);

    try {
      const application: JobApplication = {
        id: Date.now().toString(),
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString(),
        status: "pending",
        address,
        resume,
        coverLetter,
      };

      onSubmit(application);
      setShowSuccessModal(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/student/jobs");
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getTranscriptName = (
    transcript: File | { url?: string; filename?: string } | null
  ) => {
    if (!transcript) return null;
    if (transcript instanceof File) {
      return transcript.name;
    }
    return transcript.filename || null;
  };

  const isFormValid =
    address.trim() !== "" && resume !== null && coverLetter.trim() !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/student/jobs")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl">Apply for Position</h1>
                <p className="text-gray-600 text-sm">
                  {job.title} at {job.company}
                </p>
              </div>
            </div>
            <div className="text-blue-600 font-bold text-xl">UniCore</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">Salary Range</p>
                  <p className="text-gray-600">
                    ${job.minSalary} - ${job.maxSalary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Picture & Basic Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={userProfile?.profilePicture} />
                    <AvatarFallback>
                      {getInitials(userProfile?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {userProfile?.name || "Student"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {userProfile?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                {userProfile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{userProfile.phone}</span>
                  </div>
                )}
                {userProfile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{userProfile.location}</span>
                  </div>
                )}

                {/* Academic Information */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Academic Info</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    <div>
                      <p className="text-xs text-gray-500">Program</p>
                      <p className="text-sm">
                        {userProfile?.program || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CGPA</p>
                      <p className="text-sm">{userProfile?.cgpa || "N/A"}</p>
                    </div>
                    {userProfile?.transcript && (
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          Transcript:{" "}
                          {getTranscriptName(userProfile.transcript)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Preferences */}
                {userProfile?.jobTypes && userProfile.jobTypes.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        Job Preferences
                      </span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1">
                      {userProfile.jobTypes.map((jobType) => (
                        <Badge
                          key={jobType}
                          variant="secondary"
                          className="text-xs"
                        >
                          {jobType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {userProfile?.skills && userProfile.skills.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Skills</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1">
                      {userProfile.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {userProfile?.interests && userProfile.interests.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Interests</span>
                    </div>
                    <div className="ml-6 flex flex-wrap gap-1">
                      {userProfile.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="text-xs"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {userProfile?.bio && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-1">About Me</p>
                    <p className="text-sm text-gray-600 ml-6">
                      {userProfile.bio}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Application</CardTitle>
                <p className="text-gray-600">
                  Please provide the additional information required to complete
                  your job application.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Address Field */}
                  <div>
                    <label className="block text-sm mb-2">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={address}
                      onChange={handleAddressChange}
                      placeholder="Enter your complete mailing address including street, city, state, and postal code"
                      rows={3}
                      required
                      className={addressError ? "border-red-500" : ""}
                    />
                    {addressError && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{addressError}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 10 characters
                    </p>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm mb-2">
                      Resume/CV <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                        resumeError
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        Upload your resume or CV
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Accepted file types: PDF, DOC, DOCX. Max file size: 5MB.
                      </p>
                      <input
                        type="file"
                        onChange={handleResumeUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        Browse Files
                      </label>

                      {resume && !resumeError && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-700">
                              ✓ {resume.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        </div>
                      )}

                      {resumeError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-700">
                              {resumeError}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm mb-2">
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={coverLetter}
                      onChange={handleCoverLetterChange}
                      placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position. Highlight your relevant experience, skills, and enthusiasm for the role."
                      rows={8}
                      required
                      className={coverLetterError ? "border-red-500" : ""}
                    />
                    {coverLetterError && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{coverLetterError}</span>
                      </div>
                    )}
                    <p
                      className={`text-sm mt-1 ${
                        coverLetter.length < 100
                          ? "text-red-500"
                          : coverLetter.length < 300
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {coverLetter.length} / 2000 characters
                      {coverLetter.length < 100 && " (minimum 100 required)"}
                      {coverLetter.length >= 100 &&
                        coverLetter.length < 300 &&
                        " (recommended: 300-500 words)"}
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/student/jobs")}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">
              Application Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Your application for{" "}
              <span className="font-medium">{job.title}</span> at{" "}
              <span className="font-medium">{job.company}</span> has been
              submitted successfully. You will receive updates on your
              application status via email and notifications.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleSuccessModalClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Jobs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

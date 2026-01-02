import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

interface JobPostingFormProps {
  onJobAdded?: (job: any) => void;
}

export function JobPostingForm({ onJobAdded }: JobPostingFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "",
    description: "",
    requirements: "",
    responsibilities: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    benefits: "",
    skills: "",
    applicationDeadline: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.company ||
      !formData.type ||
      !formData.description ||
      !formData.location ||
      !formData.minSalary ||
      !formData.maxSalary ||
      !formData.applicationDeadline
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare job data for API
      const jobData = {
        title: formData.title,
        company: formData.company,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        salary: {
          min: parseInt(formData.minSalary),
          max: parseInt(formData.maxSalary),
          currency: "GHS",
        },
        requirements: formData.requirements
          ? formData.requirements.split("\n").filter((req) => req.trim())
          : [],
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split("\n").filter((resp) => resp.trim())
          : [],
        benefits: formData.benefits
          ? formData.benefits.split("\n").filter((benefit) => benefit.trim())
          : [],
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill)
          : [],
        applicationDeadline: new Date(
          formData.applicationDeadline
        ).toISOString(),
        status: "active",
      };

      // Make API call to create job
      const response = await fetch("http://localhost:5001/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const result = await response.json();

      toast.success("Job posted successfully!");

      if (onJobAdded) {
        onJobAdded(result.data);
      }

      // Clear form
      setFormData({
        title: "",
        company: "",
        type: "",
        description: "",
        requirements: "",
        responsibilities: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        benefits: "",
        skills: "",
        applicationDeadline: "",
      });

      // Navigate to job listings
      navigate("/employer/job-listings");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      company: "",
      type: "",
      description: "",
      requirements: "",
      responsibilities: "",
      location: "",
      minSalary: "",
      maxSalary: "",
      benefits: "",
      skills: "",
      applicationDeadline: "",
    });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8">Employer Dashboard</h1>

      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="mb-6">Post A New Job</h2>

        {/* Job Details */}
        <div className="mb-8">
          <h3 className="mb-4">Job Details</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Job Title *</label>
              <Input
                placeholder="e.g., Junior Software Engineer"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Company *</label>
              <Input
                placeholder="e.g., TechNova Ltd"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Job Type *</label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Location *</label>
              <Input
                placeholder="e.g., Ring Road, Accra or Remote"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Job Description *</label>
            <Textarea
              placeholder="Provide a detailed description of the role responsibilities..."
              className="min-h-24"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Job Requirements</label>
            <Textarea
              placeholder="List essential skills, qualifications, and experience required (one per line)..."
              className="min-h-24"
              value={formData.requirements}
              onChange={(e) =>
                handleInputChange("requirements", e.target.value)
              }
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Job Responsibilities</label>
            <Textarea
              placeholder="List key responsibilities and duties (one per line)..."
              className="min-h-24"
              value={formData.responsibilities}
              onChange={(e) =>
                handleInputChange("responsibilities", e.target.value)
              }
            />
          </div>
        </div>

        {/* Compensation */}
        <div className="mb-8">
          <h3 className="mb-4">Compensation</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Minimum Salary (GHS) *</label>
              <Input
                type="number"
                placeholder="e.g., 80000"
                value={formData.minSalary}
                onChange={(e) => handleInputChange("minSalary", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Maximum Salary (GHS) *</label>
              <Input
                type="number"
                placeholder="e.g., 120000"
                value={formData.maxSalary}
                onChange={(e) => handleInputChange("maxSalary", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h3 className="mb-4">Additional Information</h3>

          <div className="mb-4">
            <label className="block mb-2">Benefits</label>
            <Textarea
              placeholder="List benefits offered (one per line)..."
              className="min-h-20"
              value={formData.benefits}
              onChange={(e) => handleInputChange("benefits", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Required Skills</label>
            <Textarea
              placeholder="List required skills (comma-separated)..."
              className="min-h-16"
              value={formData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
            />
          </div>
        </div>

        {/* Application Settings */}
        <div className="mb-8">
          <h3 className="mb-4">Application Settings</h3>

          <div>
            <label className="block mb-2">Application Deadline *</label>
            <div className="relative">
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) =>
                  handleInputChange("applicationDeadline", e.target.value)
                }
                className="pl-4 pr-10"
              />
              <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Posting Job..." : "Add Job Listing"}
          </Button>
        </div>
      </div>
    </div>
  );
}

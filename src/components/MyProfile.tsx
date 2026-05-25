import React, { useEffect, useState } from "react";
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
import { Edit, Camera, Upload, Save, X, Mail, Check } from "lucide-react";
import { toast } from "sonner";
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfile {
  program: string;
  cgpa: string;
  studentId: string;
  jobTypes: string[];
  skills: string[];
  interests: string[];
  transcript: File | { url?: string; filename?: string } | null;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  school?: {
    name: string;
    address: string;
    email: string;
  };
}

interface MyProfileProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updatedProfile: UserProfile) => Promise<void>;
}

export function MyProfile({ userProfile, onUpdateProfile }: MyProfileProps) {
  const normalizeProfile = (profile: UserProfile | null): UserProfile => ({
    program: profile?.program || "",
    cgpa: profile?.cgpa || "",
    studentId: profile?.studentId || "",
    jobTypes: profile?.jobTypes || [],
    skills: profile?.skills || [],
    interests: profile?.interests || [],
    transcript: profile?.transcript || null,
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    profilePicture: profile?.profilePicture || "",
    school: {
      name: profile?.school?.name || "",
      address: profile?.school?.address || "",
      email: profile?.school?.email || "",
    },
  });

  // If no userProfile is provided (first-time user), show the inputs by default
  const [isEditing, setIsEditing] = useState<boolean>(() => !userProfile);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(
    normalizeProfile(userProfile),
  );

  useEffect(() => {
    if (userProfile) {
      // When profile becomes available, populate fields and stop editing by default
      setEditedProfile(normalizeProfile(userProfile));
      setIsEditing(false);
    } else {
      // No profile exists yet — initialize empty editable profile
      setEditedProfile(normalizeProfile(null));
      setIsEditing(true);
    }
  }, [userProfile]);

  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);
  const displayProfile = normalizeProfile(userProfile);

  const getTranscriptName = (
    transcript: File | { url?: string; filename?: string } | null,
  ) => {
    if (!transcript) return null;
    if (transcript instanceof File) {
      return transcript.name;
    }
    return transcript.filename || null;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile(normalizeProfile(userProfile));
  };

  const handleSaveClick = async () => {
    try {
      // Call the parent update handler for other profile fields
      await onUpdateProfile(editedProfile);
      setIsEditing(false);
      setProfilePicturePreview(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile information:", error);
      toast.error("Failed to save profile information");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(normalizeProfile(userProfile));
    setProfilePicturePreview(null);
  };

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicturePreview(result);
        setEditedProfile((prev) => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranscriptUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedProfile((prev) => ({ ...prev, transcript: file }));
    }
  };

  const toggleJobType = (jobType: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter((type) => type !== jobType)
        : [...prev.jobTypes, jobType],
    }));
  };

  const toggleSkill = (skill: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleInterest = (interest: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const availableJobTypes = [
    "Software Engineering",
    "Data Science",
    "Marketing Specialist",
    "Financial Analyst",
    "UI/UX Designer",
    "Healthcare Professional",
    "Educator",
    "Environmental Scientist",
  ];

  const availableSkills = [
    "Programming",
    "Data Analysis",
    "Project Management",
    "Communication",
    "Problem-Solving",
    "Critical Thinking",
    "Leadership",
    "Teamwork",
    "Research",
    "Financial Modeling",
    "Digital Marketing",
  ];

  const availableInterests = [
    "Technology",
    "Arts & Culture",
    "Environmentalism",
    "Volunteering",
    "Sports",
    "Gaming",
    "Reading",
    "Travel",
    "Cooking",
    "Photography",
    "Music Production",
  ];

  // Render the full profile UI even if `userProfile` is null —
  // `editedProfile` will contain default empty values and `isEditing` will be true.

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={handleEditClick}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={
                        profilePicturePreview || editedProfile.profilePicture
                      }
                      alt="Profile picture"
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(editedProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        placeholder="Full Name"
                        value={editedProfile.name || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={editedProfile.email || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Phone"
                        value={editedProfile.phone || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Location"
                        value={editedProfile.location || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold">
                        {displayProfile.name || "Student"}
                      </h3>
                      {displayProfile.email && (
                        <p className="text-gray-600">{displayProfile.email}</p>
                      )}
                      {displayProfile.phone && (
                        <p className="text-gray-600">{displayProfile.phone}</p>
                      )}
                      {displayProfile.location && (
                        <p className="text-gray-600">
                          {displayProfile.location}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Program of Study
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.program || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            program: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {displayProfile.program}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Student ID Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.studentId || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            studentId: e.target.value,
                          }))
                        }
                        placeholder="e.g., GHS-2024-001234"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {displayProfile.studentId || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Current CGPA</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={editedProfile.cgpa || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            cgpa: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {displayProfile.cgpa}
                      </p>
                    )}
                  </div>
                </div>

                {/* School Information */}
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-md">School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">School Name</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.school?.name || ""}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              school: { ...prev.school, name: e.target.value },
                            }))
                          }
                          placeholder="e.g., University of Example"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-lg">
                          {displayProfile.school?.name || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm mb-2">School Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile.school?.email || ""}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              school: { ...prev.school, email: e.target.value },
                            }))
                          }
                          placeholder="e.g., info@school.edu"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-lg">
                          {displayProfile.school?.email || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">School Address</label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.school?.address || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            school: { ...prev.school, address: e.target.value },
                          }))
                        }
                        placeholder="e.g., 123 Campus Drive, City, State, ZIP"
                        rows={3}
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {displayProfile.school?.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Transcript */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium">
                      Academic Transcript
                    </label>
                    {!isEditing && displayProfile.transcript && (
                      <div className="text-sm text-green-600 flex items-center gap-2">
                        <Check size={16} />
                        Transcript uploaded
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload new transcript
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.docx,.jpeg,.jpg"
                        onChange={handleTranscriptUpload}
                        className="hidden"
                        id="transcript-upload"
                      />
                      <label
                        htmlFor="transcript-upload"
                        className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100"
                      >
                        Browse Files
                      </label>
                      {editedProfile.transcript && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {getTranscriptName(editedProfile.transcript)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {displayProfile.transcript ? (
                        <div className="space-y-2">
                          <p className="text-sm">
                            ✓ Transcript uploaded:{" "}
                            {getTranscriptName(displayProfile.transcript)}
                          </p>
                          {!displayProfile.school?.email ||
                          !displayProfile.studentId ? (
                            <p className="text-xs text-amber-600">
                              💡 Complete your School Information and Student ID
                              to verify with your school
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No transcript uploaded
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="Tell us about yourself, your goals, and what you're passionate about..."
                    value={editedProfile.bio || ""}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">
                    {displayProfile.bio ||
                      "Add a bio to tell others about yourself, your goals, and what you're passionate about."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Job Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Job Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-3">
                      Preferred Job Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {isEditing
                        ? availableJobTypes.map((jobType) => (
                            <button
                              key={jobType}
                              onClick={() => toggleJobType(jobType)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                editedProfile.jobTypes.includes(jobType)
                                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {jobType}
                            </button>
                          ))
                        : displayProfile.jobTypes.map((jobType) => (
                            <Badge key={jobType} variant="secondary">
                              {jobType}
                            </Badge>
                          ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-3">
                      Professional Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {isEditing
                        ? availableSkills.map((skill) => (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                editedProfile.skills.includes(skill)
                                  ? "bg-green-100 text-green-700 border border-green-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {skill}
                            </button>
                          ))
                        : displayProfile.skills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-green-100 text-green-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-3">
                      Personal Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {isEditing
                        ? availableInterests.map((interest) => (
                            <button
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                editedProfile.interests.includes(interest)
                                  ? "bg-purple-100 text-purple-700 border border-purple-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {interest}
                            </button>
                          ))
                        : displayProfile.interests.map((interest) => (
                            <Badge
                              key={interest}
                              className="bg-purple-100 text-purple-700"
                            >
                              {interest}
                            </Badge>
                          ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

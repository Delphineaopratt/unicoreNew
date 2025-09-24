import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, Upload, FileText, CheckCircle, User, MapPin, Briefcase } from 'lucide-react';

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

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  address: string;
  resume: File | null;
  coverLetter: string;
}

interface JobApplicationFormProps {
  job: Job;
  userProfile: UserProfile | null;
  onBack: () => void;
  onSubmitApplication: (application: JobApplication) => void;
}

export function JobApplicationForm({ job, userProfile, onBack, onSubmitApplication }: JobApplicationFormProps) {
  const [address, setAddress] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const application: JobApplication = {
      id: Date.now().toString(),
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toISOString(),
      status: 'pending',
      address,
      resume,
      coverLetter
    };

    onSubmitApplication(application);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onBack();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'UN';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isFormValid = address.trim() !== '' && resume !== null && coverLetter.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl">Apply for Position</h1>
                <p className="text-gray-600 text-sm">{job.title} at {job.company}</p>
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
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{job.type}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Salary Range</p>
                  <p className="text-gray-600">${job.minSalary} - ${job.maxSalary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            {userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={userProfile.profilePicture} alt="Profile" />
                      <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userProfile.name || 'Student'}</p>
                      <p className="text-sm text-gray-600">{userProfile.program}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">CGPA</p>
                    <p className="text-gray-600">{userProfile.cgpa}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {userProfile.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                      {userProfile.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">+{userProfile.skills.length - 4} more</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Application</CardTitle>
                <p className="text-gray-600">Please provide the additional information required to complete your job application.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Pre-populated Profile Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-gray-800">Profile Information (Auto-filled)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <Input 
                          value={userProfile?.name || 'Student'} 
                          disabled 
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Email</label>
                        <Input 
                          value={userProfile?.email || 'student@university.edu'} 
                          disabled 
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Phone</label>
                        <Input 
                          value={userProfile?.phone || 'Not provided'} 
                          disabled 
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Program of Study</label>
                        <Input 
                          value={userProfile?.program || ''} 
                          disabled 
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="block text-sm mb-2">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your complete mailing address including street, city, state, and postal code"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm mb-2">
                      Resume/CV <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                      
                      {resume && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-700">✓ {resume.name}</p>
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
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position. Highlight your relevant experience, skills, and enthusiasm for the role."
                      rows={8}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {coverLetter.length} characters (recommended: 300-500 words)
                    </p>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Additional Profile Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">CGPA:</span> {userProfile?.cgpa}</p>
                      <p><span className="font-medium">Academic Transcript:</span> {userProfile?.transcript ? 'Uploaded' : 'Not provided'}</p>
                      <div>
                        <span className="font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {userProfile?.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onBack}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!isFormValid}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Submit Application
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
            <DialogTitle className="text-xl">Application Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-gray-600">
              Your application for <span className="font-medium">{job.title}</span> at <span className="font-medium">{job.company}</span> has been submitted successfully. You will receive updates on your application status via email and notifications.
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
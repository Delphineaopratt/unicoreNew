import image_055c3f21905bc477ee2467fbb9eb21c4fb88caef from 'figma:asset/055c3f21905bc477ee2467fbb9eb21c4fb88caef.png';
import jobTypesImage from 'figma:asset/30dd70664494df08a73424dbf4aa81b16c8fe83b.png';
import skillsImage from 'figma:asset/bb6826290739ed42fc6dbd1966c0ea9d6bd41f8f.png';
import transcriptImage from 'figma:asset/eea782ab9c0afa6981261c2e194eee38a39bfe52.png';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Upload, Laptop, BarChart3, Target, DollarSign, Palette, Heart, GraduationCap, Leaf } from 'lucide-react';
import exampleImage from 'figma:asset/102658a6042355a01636c119d3e40b949234fe74.png';

interface OnboardingFlowProps {
  onComplete: (data: { 
    program: string; 
    cgpa: string; 
    jobTypes: string[]; 
    skills: string[]; 
    interests: string[]; 
    transcript: File | null;
  }) => void;
  onCancel: () => void;
}

export function OnboardingFlow({ onComplete, onCancel }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [program, setProgram] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [uploadedTranscript, setUploadedTranscript] = useState<File | null>(null);

  const handleNextFromProgram = () => {
    if (program.trim()) {
      setCurrentStep(2);
    }
  };

  const handleNextFromCgpa = () => {
    if (cgpa.trim()) {
      setCurrentStep(3);
    }
  };

  const handleNextFromJobTypes = () => {
    if (selectedJobTypes.length > 0) {
      setCurrentStep(4);
    }
  };

  const handleNextFromSkills = () => {
    setCurrentStep(5);
  };

  const handleComplete = () => {
    onComplete({ 
      program, 
      cgpa, 
      jobTypes: selectedJobTypes, 
      skills: selectedSkills, 
      interests: selectedInterests, 
      transcript: uploadedTranscript 
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const toggleJobType = (jobType: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(jobType) 
        ? prev.filter(type => type !== jobType)
        : [...prev, jobType]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedTranscript(file);
    }
  };

  const jobTypes = [
    { id: 'software-engineering', title: 'Software Engineering', description: 'Designing, developing, and maintaining software applications and systems.', icon: Laptop },
    { id: 'data-science', title: 'Data Science', description: 'Analyzing complex data to extract insights and build predictive models.', icon: BarChart3 },
    { id: 'marketing-specialist', title: 'Marketing Specialist', description: 'Developing and executing strategies to promote products or services.', icon: Target },
    { id: 'financial-analyst', title: 'Financial Analyst', description: 'Evaluating financial performance and providing investment guidance.', icon: DollarSign },
    { id: 'ui-ux-designer', title: 'UI/UX Designer', description: 'Creating intuitive and visually appealing user interfaces and experiences.', icon: Palette },
    { id: 'healthcare-professional', title: 'Healthcare Professional', description: 'Providing medical care, diagnosis, and support to patients.', icon: Heart },
    { id: 'educator', title: 'Educator', description: 'Teaching and guiding students in academic or vocational settings.', icon: GraduationCap },
    { id: 'environmental-scientist', title: 'Environmental Scientist', description: 'Studying natural environments and developing solutions for conservation.', icon: Leaf }
  ];

  const professionalSkills = [
    'Programming', 'Data Analysis', 'Project Management', 'Communication',
    'Problem-Solving', 'Critical Thinking', 'Leadership', 'Teamwork',
    'Research', 'Financial Modeling', 'Digital Marketing'
  ];

  const personalInterests = [
    'Technology', 'Arts & Culture', 'Environmentalism', 'Volunteering',
    'Sports', 'Gaming', 'Reading', 'Travel', 'Cooking', 'Photography',
    'Music Production'
  ];

  const ProgressDots = ({ total, current }: { total: number; current: number }) => (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index + 1 === current ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="text-blue-600 font-bold text-xl">UniCore</div>
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto">
          {/* Illustration */}
          <div className="mb-8">
            <img 
              src={image_055c3f21905bc477ee2467fbb9eb21c4fb88caef} 
              alt="Students in front of university building"
              className="w-80 h-auto"
            />
          </div>

          <ProgressDots total={5} current={1} />

          <h1 className="text-2xl font-bold text-center mb-4">
            What is your Program of Study?
          </h1>
          
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Help us understand your academic background to tailor your UniCore experience.
          </p>

          <div className="w-full max-w-md space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Enter Your Program</label>
              <Input
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g., Computer Science, Business Administration"
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleNextFromProgram}
              disabled={!program.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="text-blue-600 font-bold text-xl">UniCore</div>
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">Step 2 of 5</p>
            <h2 className="text-lg font-semibold text-gray-800">CGPA Input</h2>
          </div>

          <ProgressDots total={5} current={2} />

          <h1 className="text-2xl font-bold text-center mb-8">
            What is your Current CGPA?
          </h1>

          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <Input
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="3.50"
                className="w-32 mx-auto text-center text-lg"
                type="number"
                min="0"
                max="4"
                step="0.01"
              />
            </div>

            <p className="text-gray-600 text-center text-sm">
              Enter your current Cumulative Grade Point Average.<br />
              Please use a scale of 0.0 to 4.0.
            </p>

            <Button 
              onClick={handleNextFromCgpa}
              disabled={!cgpa.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
        </div>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="text-blue-600 font-bold text-xl">UniCore</div>
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto">
          <ProgressDots total={5} current={3} />

          <h1 className="text-2xl font-bold text-center mb-4">
            What is your ideal type of job?
          </h1>
          
          <p className="text-gray-600 text-center mb-8 max-w-2xl">
            Select the job categories that align with your career aspirations. You can choose one or more.
          </p>

          {/* Job Type Illustration */}
          <div className="mb-8">
            <img 
              src={jobTypesImage} 
              alt="Career paths illustration"
              className="w-80 h-auto"
            />
          </div>

          {/* Job Types Grid */}
          <div className="w-full max-w-4xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobTypes.map((jobType) => {
                const Icon = jobType.icon;
                const isSelected = selectedJobTypes.includes(jobType.id);
                return (
                  <button
                    key={jobType.id}
                    onClick={() => toggleJobType(jobType.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <h3 className="font-semibold mb-2">{jobType.title}</h3>
                    <p className="text-sm text-gray-600">{jobType.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button 
            onClick={handleNextFromJobTypes}
            disabled={selectedJobTypes.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Next
          </Button>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="text-blue-600 font-bold text-xl">UniCore</div>
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto">
          {/* Illustration */}
          <div className="mb-6">
            <img 
              src={skillsImage} 
              alt="Skills and interests illustration"
              className="w-80 h-auto"
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">Step 4 of 5</p>
          </div>

          <ProgressDots total={5} current={4} />

          <h1 className="text-2xl font-bold text-center mb-4">
            What are your Skills and Interests?
          </h1>
          
          <p className="text-gray-600 text-center mb-8 max-w-2xl">
            Tell us about your strengths and passions to help us understand your profile better. Select all that apply from the lists below.
          </p>

          {/* Skills and Interests Grid */}
          <div className="w-full max-w-4xl mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Professional Skills */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Professional Skills</h2>
              <div className="grid grid-cols-2 gap-3">
                {professionalSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Interests */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Interests</h2>
              <div className="grid grid-cols-2 gap-3">
                {personalInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleNextFromSkills}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Next
          </Button>
        </div>

        {/* Footer */}
        <div className="p-6 text-center">
        </div>
      </div>
    );
  }

  // Step 5: Transcript Upload
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="text-blue-600 font-bold text-xl">UniCore</div>
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">Step 5 of 5</p>
        </div>

        <ProgressDots total={5} current={5} />

        <h1 className="text-2xl font-bold text-center mb-4">
          Upload Your Academic Transcript
        </h1>
        
        <p className="text-gray-600 text-center mb-12 max-w-md">
          Please upload your official academic transcript. This document is crucial for verifying your academic achievements and helping us tailor your UniConnect experience.
        </p>

        {/* File Upload Area */}
        <div className="w-full max-w-md mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your transcript here, or click to browse.
            </p>
            <p className="text-sm text-gray-500">
              Accepted file types: PDF, DOCX, JPEG. Max file size: 10MB.
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.docx,.jpeg,.jpg"
              className="hidden"
              id="transcript-upload"
            />
            <label 
              htmlFor="transcript-upload"
              className="inline-block mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            >
              Browse Files
            </label>
          </div>
          
          {uploadedTranscript && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ {uploadedTranscript.name} uploaded successfully
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <Button 
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleComplete}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Upload Transcript
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
      </div>
    </div>
  );
}
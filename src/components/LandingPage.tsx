import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ImageWithFallback } from './figma/ImageWithFallback';
import exampleImage from 'figma:asset/c8af16ee152d7796e2ddb92f5fc0ed8a307ab59c.png';

interface LandingPageProps {
  onShowLogin: (userType: 'student' | 'employer' | 'hostel-admin') => void;
  onShowSignup: (userType: 'student' | 'employer' | 'hostel-admin') => void;
}

export function LandingPage({ onShowLogin, onShowSignup }: LandingPageProps) {
  const features = [
    {
      title: "Smart Hostel Booking",
      description: "Find and book verified student accommodation with ease. Browse through detailed hostel listings, view photos, check amenities, and make instant bookings all in one platform.",
      image: "https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGhvc3RlbHxlbnwxfHx8fDE3NTgxODg0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Career Opportunities Hub",
      description: "Connect with top employers and discover internships, part-time jobs, and graduate opportunities tailored to your skills and academic background. Build your career while studying.",
      image: "https://images.unsplash.com/photo-1633110007230-0dd08905731a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBjYXJlZXIlMjBvcHBvcnR1bml0eXxlbnwxfHx8fDE3NTgxODg0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Comprehensive Admin Dashboard",
      description: "Streamline your operations with powerful management tools. Whether you're managing hostels or recruitment processes, our intuitive dashboard provides all the insights and controls you need.",
      image: "https://images.unsplash.com/photo-1604063272399-fc8245a2988e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZG1pbiUyMG1hbmFnZW1lbnQlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU4MTg4NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const whyChooseFeatures = [
    {
      icon: "🎯",
      title: "Effortless Hostel Booking",
      description: "Finding the perfect hostel has never been easier. Browse through a wide range of verified hostels with detailed information and make instant bookings."
    },
    {
      icon: "💼",
      title: "Curated Job Opportunities",
      description: "Connect with top employers and discover career opportunities tailored to your skills and preferences. Our platform ensures quality job matches."
    },
    {
      icon: "📊",
      title: "Simplified Admin Management",
      description: "Streamline your administrative tasks with our comprehensive management tools designed specifically for hostel and recruitment operations."
    },
    {
      icon: "💬",
      title: "Smart Employer Connection",
      description: "Build meaningful connections between employers and candidates through our intelligent matching system and communication tools."
    },
    {
      icon: "🏆",
      title: "Personalized Recommendations",
      description: "Get personalized suggestions based on your preferences and past interactions to find exactly what you're looking for."
    },
    {
      icon: "🔒",
      title: "Secure & Verified Listings",
      description: "All our listings go through rigorous verification processes to ensure safety, authenticity, and quality for all users."
    }
  ];

  const teamMembers = [
    {
      name: "Full name",
      role: "Job title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTgwNDE4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Full name",
      role: "Job title", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTgwNDE4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Full name",
      role: "Job title",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTgwNDE4MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-semibold">Unicore</span>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Choose your role
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onShowSignup('student')}>
                  Student
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowSignup('employer')}>
                  Employer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowSignup('hostel-admin')}>
                  Hostel Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  Login
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onShowLogin('student')}>
                  Login as Student
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowLogin('employer')}>
                  Login as Employer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowLogin('hostel-admin')}>
                  Login as Hostel Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Unicore</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your all-in-one platform for student accommodation, career opportunities, and administrative management. 
            Connecting students, employers, and hostel administrators seamlessly.
          </p>
          

        </div>
      </section>

      {/* Product Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Product Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover powerful features designed to streamline your experience, 
              whether you're finding accommodation, seeking opportunities, or managing operations.
            </p>
          </div>
          
          <div className="space-y-20">
            {features.map((feature, index) => (
              <div key={index} className={`flex items-center gap-16 ${index === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Unicore */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Unicore?</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyChooseFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
          </div>
          
          <div className="flex gap-8 justify-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center bg-white p-12 rounded-lg shadow-lg flex-1 max-w-sm">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-2xl font-semibold mb-3">{member.name}</h3>
                <p className="text-blue-600 mb-6 text-lg">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
                
                <div className="flex justify-center gap-4 mt-8">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                    <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                    <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-semibold">Unicore</span>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <span>© 2024 Unicore. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
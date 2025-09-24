import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const slideshowImages = [
  {
    url: "https://images.unsplash.com/photo-1565688527174-775059ac429c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGNhcmVlciUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc1ODI3ODQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Unlock Your Career Potential",
    subtitle: "Explore Opportunities"
  },
  {
    url: "https://images.unsplash.com/photo-1727790632675-204d26c2326c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzU4Mjc4NDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Study Smart, Live Better",
    subtitle: "Find Your Perfect Accommodation"
  }
];

export function StudentDashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Hero Section with Slideshow */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={slideshowImages[currentSlide].url}
            alt={slideshowImages[currentSlide].title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{slideshowImages[currentSlide].title}</h1>
            <p className="text-lg opacity-90">{slideshowImages[currentSlide].subtitle}</p>
          </div>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slideshowImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Career Advice */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Daily Career Advice</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Networking</span>
              <p className="mt-1">Connect with alumni, professors, and peers to expand your professional network. Every conversation is an opportunity.</p>
            </div>
          </div>
        </div>

        {/* Daily Educational Quote */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Daily Educational Quote</h3>
          <div className="text-sm text-gray-600">
            <p className="italic">"The best time to plant a tree was 20 years ago. The second best time is now."</p>
            <p className="mt-2 text-gray-500">- Chinese Proverb</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">SK</span>
              </div>
            </div>
            <blockquote className="text-lg text-gray-700 mb-4">
              "I had no hope of getting an internship this summer. But because of this site, I got accepted to an internship and now work full time."
            </blockquote>
            <cite className="text-purple-600 font-medium">- Sharon Kumari</cite>
          </div>
        </div>
      </div>
    </div>
  );
}
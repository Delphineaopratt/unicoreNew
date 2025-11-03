import React, { useState, useEffect } from "react";

const slideshowImages = [
  {
    title: "Unlock Your Career Potential",
    description:
      "Access a curated list of student-friendly jobs and internships.",
    image: "/src/assets/careerpotential.jpg",
  },
  {
    title: "Find Your Dream Job Easily",
    description:
      "Get daily tips to improve your productivity, learning, networking, and more.",
    image: "/src/assets/dreamjob.jpg",
  },
  {
    title: "Get a Hostel Without a Sweat",
    description:
      "Unicore provides easy access to hostels near your school, and you don’t even have to step out!",
    image: "/src/assets/findhostel.jpg",
  },
  {
    title: "Allow Unibot Help With Your CV",
    description:
      "Unibot helps you to tailor your resume to each job application to make a strong first impression.",
    image: "/src/assets/unibotCV.jpg",
  },
];

export function StudentDashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Hero Section with Slideshow */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={slideshowImages[currentSlide].image}
            alt={slideshowImages[currentSlide].title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {slideshowImages[currentSlide].title}
            </h1>
            <p className="text-lg opacity-90">
              {slideshowImages[currentSlide].description}
            </p>
          </div>
        </div>
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slideshowImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
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
              <p className="mt-1">
                Connect with alumni, professors, and peers to expand your
                professional network. Every conversation is an opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Educational Quote */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Daily Educational Quote</h3>
          <div className="text-sm text-gray-600">
            <p className="italic">
              "The best time to plant a tree was 20 years ago. The second best
              time is now."
            </p>
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
              "I had no hope of getting an internship this summer. But because
              of this site, I got accepted to an internship and now work full
              time."
            </blockquote>
            <cite className="text-purple-600 font-medium">- Sharon Kumari</cite>
          </div>
        </div>
      </div>
    </div>
  );
}

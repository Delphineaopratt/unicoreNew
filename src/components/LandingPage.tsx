import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
// import { ImageWithFallback } from '/../figma/ImageWithFallback';
// import exampleImage from "figma:asset/c8af16ee152d7796e2ddb92f5fc0ed8a307ab59c.png";
import findhostel from "../assets/findhostel.jpg";
import careerpotential from "../assets/careerpotential.jpg";
import chatbot from "../assets/chatbot.jpg";
import campus from "../assets/campus.jpg";
import UnicoreLogo from "../assets/UnicoreLogo2.png";

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  const [scrollY, setScrollY] = useState(0);
  const [hasFeatureSectionAnimated, setHasFeatureSectionAnimated] =
    useState(false);
  const featuresSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const section = featuresSectionRef.current;

    if (!section || hasFeatureSectionAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasFeatureSectionAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasFeatureSectionAnimated]);

  const features = [
    {
      title: "Smart Hostel Booking",
      description:
        "Find and book verified student accommodation with ease. Browse through detailed hostel listings, view photos, check amenities, and make instant bookings all in one platform.",
      image: findhostel,
    },
    {
      title: "Career Opportunities Hub",
      description:
        "Connect with top employers and discover internships, part-time jobs, and graduate opportunities tailored to your skills and academic background. Build your career while studying.",
      image: careerpotential,
    },
    {
      title: "Personal AI Assistant",
      description:
        "Discover Unibot, your personal chatbot to help you streamline job application processes and offer useful career tips. ",
      image: chatbot,
    },
  ];

  const featureAnimations = [
    "animate-slide-in-right",
    "animate-slide-in-left",
    "animate-slide-in-right",
  ];

  const whyChooseFeatures = [
    {
      icon: "🎯",
      title: "Effortless Hostel Booking",
      description:
        "Finding the perfect hostel has never been easier. Browse through a wide range of verified hostels with detailed information and make instant bookings.",
    },
    {
      icon: "💼",
      title: "Curated Job Opportunities",
      description:
        "Connect with top employers and discover career opportunities tailored to your skills and preferences. Our platform ensures quality job matches.",
    },
    {
      icon: "📊",
      title: "Simplified Admin Management",
      description:
        "Streamline your administrative tasks with our comprehensive management tools designed specifically for hostel and recruitment operations.",
    },
    {
      icon: "💬",
      title: "Smart Employer Connection",
      description:
        "Build meaningful connections between employers and candidates through our intelligent matching system and communication tools.",
    },
    {
      icon: "🏆",
      title: "Personalized Recommendations",
      description:
        "Get personalized suggestions based on your preferences and past interactions to find exactly what you're looking for.",
    },
    {
      icon: "🔒",
      title: "Secure & Verified Listings",
      description:
        "All our listings go through rigorous verification processes to ensure safety, authenticity, and quality for all users.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={UnicoreLogo} alt="Unicore Logo" className="w-10 h-10" />
            <span className="text-xl font-bold">Unicore</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onLogin}>
              Login
            </Button>
            <Button onClick={onSignup}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 hero-bg overflow-hidden">
        <div
          className="hero-bg-image"
          style={{
            backgroundImage: `url(${campus})`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>
        <div className="hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6 animate-fade-in-down animation-delay-500">
            <img src={UnicoreLogo} alt="Unicore Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-5xl text-white font-bold mb-6 animate-fade-in-up animation-delay-500">
            Unicore
          </h1>
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-500">
            Your all-in-one platform for student accommodation, career
            opportunities, and administrative management. Connecting students,
            employers, and hostel administrators seamlessly.
          </p>
        </div>
      </section>

      {/* Product Features */}
      <section ref={featuresSectionRef} className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Product Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover powerful features designed to streamline your experience,
              whether you're finding accommodation, seeking opportunities, or
              managing operations.
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-16 ${
                  index === 1 ? "flex-row-reverse" : ""
                } ${
                  hasFeatureSectionAnimated
                    ? featureAnimations[index]
                    : "opacity-0"
                }`}
                style={
                  hasFeatureSectionAnimated
                    ? { animationDelay: `${index * 0.95}s` }
                    : undefined
                }
              >
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1">
                  <img
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyChooseFeatures.map((feature, index) => (
              <div
                key={index}
                className="card-hover-pulse bg-white rounded-xl border border-gray-200 p-6 text-center shadow-md hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={UnicoreLogo} alt="Unicore Logo" className="w-10 h-10" />
            <span className="text-xl font-semibold">Unicore</span>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <span>© 2026 Unicore. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

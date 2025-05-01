import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import BloodDropLogo from './BloodDropLogo';

const HeroSection: React.FC = () => {
  const [count, setCount] = useState(0);
  const [livesSaved, setLivesSaved] = useState(0);
  const targetCount = 5238; // Total donors
  const targetLivesSaved = 15714; // Total lives saved (3x donors)
  
  useEffect(() => {
    // Animate the counter
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      setCount(Math.floor(progress * targetCount));
      setLivesSaved(Math.floor(progress * targetLivesSaved));
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  
  // Blood group statistics
  const bloodGroups = [
    { type: 'A+', percentage: 35.7 },
    { type: 'O+', percentage: 37.4 },
    { type: 'B+', percentage: 8.5 },
    { type: 'AB+', percentage: 3.4 },
    { type: 'A-', percentage: 6.3 },
    { type: 'O-', percentage: 6.6 },
    { type: 'B-', percentage: 1.5 },
    { type: 'AB-', percentage: 0.6 }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-700 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-red-600 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-12 left-1/3 w-72 h-72 bg-red-800 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Blood cells floating animation */}
        <div className="absolute top-0 w-full h-full">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index}
              className="absolute rounded-full bg-red-500 opacity-10"
              style={{
                width: `${20 + Math.random() * 30}px`,
                height: `${20 + Math.random() * 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pb-32">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="block mb-2 text-red-200">Every Drop Counts</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-red-200 relative inline-flex">
                Save Lives Today
                <span className="absolute -top-2 -right-2 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-red-100 font-light leading-relaxed">
              Your donation can save up to three lives. Join our community of {count.toLocaleString()}+ donors who've saved {livesSaved.toLocaleString()} lives already.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: "fa-heartbeat", title: "Blood Needed Every", value: "2 Seconds", description: "Someone needs blood constantly" },
              { icon: "fa-tint", title: "One Donation Saves", value: "3 Lives", description: "Your contribution matters" },
              { icon: "fa-users", title: "Active Donors", value: `${count.toLocaleString()}+`, description: "And growing every day" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform transition-all hover:scale-105 hover:shadow-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <i className={`fas ${stat.icon} text-xl text-white`}></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-200">{stat.title}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <p className="text-red-200 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Blood types visualization */}
          <div className="flex flex-wrap justify-center mb-16 gap-4">
            {bloodGroups.map((group) => (
              <div key={group.type} className="transform transition-all hover:scale-110">
                <div className="text-center relative">
                  <div className="mb-2 mx-auto w-16 h-16 bg-white/10 rounded-full p-1 backdrop-blur-sm hover:bg-white/20 border border-white/20">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <BloodDropLogo size="md" bloodType={group.type} animated />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-red-700 text-xs px-1.5 rounded-full font-bold shadow-lg">
                    {group.percentage}%
                  </div>
                  <div className="text-sm font-semibold">{group.type}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/donor-registration">
              <div className="group flex items-center justify-center px-8 py-4 border-2 border-white bg-white text-red-800 text-lg font-bold rounded-full cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 focus:ring-4 focus:ring-white focus:ring-opacity-50">
                <span className="mr-2 transition-transform duration-300 group-hover:rotate-12">
                  <BloodDropLogo size="sm" animated />
                </span>
                Become a Donor
              </div>
            </Link>
            <Link href="/donor-directory">
              <div className="group flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-full cursor-pointer transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transform hover:-translate-y-1">
                <i className="fas fa-search mr-2 transition-transform duration-300 group-hover:rotate-12"></i>
                Find Blood
              </div>
            </Link>
          </div>

          {/* Floating medical elements */}
          <div className="absolute bottom-0 left-0 transform translate-y-1/2">
            <div className="text-red-200 opacity-30">
              <i className="fas fa-microscope text-6xl"></i>
            </div>
          </div>
          <div className="absolute top-12 right-12 hidden lg:block">
            <div className="text-red-200 opacity-30 animate-pulse">
              <i className="fas fa-heartbeat text-8xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="white" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Animation styles are now in index.css */}
    </section>
  );
};

export default HeroSection;

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
    <section className="bg-gradient-to-br from-white to-red-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-5">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">Donate Blood,</span>
              <span className="block text-primary-600">Save <span className="relative inline-block">
                <span className="animate-pulse-scale">Lives</span>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </span></span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl font-body">
              Every donation can save up to three lives. Join our community of donors today and make a difference in someone's life.
            </p>
            <div className="mt-8 sm:mt-12 sm:flex">
              <div className="rounded-md shadow">
                <Link href="/donor-registration">
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                    <BloodDropLogo size="sm" className="mr-2" animated />
                    Become a Donor
                  </div>
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link href="/donor-directory">
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 cursor-pointer transition-all duration-200 hover:shadow-md">
                    <i className="fas fa-search mr-2"></i>
                    Find Blood
                  </div>
                </Link>
              </div>
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-100 flex items-center justify-center">
                    <BloodDropLogo size="sm" bloodType={bloodGroups[i-1].type} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-body">Join <span className="font-semibold text-primary-600">{count.toLocaleString()}+</span> donors who've already saved <span className="font-semibold text-primary-600">{livesSaved.toLocaleString()}</span> lives</p>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7 relative">
            <div className="relative lg:h-full">
              <div className="hidden sm:block">
                <div className="absolute inset-0">
                  <svg className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
                    <defs>
                      <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="4" height="4" className="text-primary-200" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Blood Donation" 
                  className="rounded-xl shadow-2xl sm:rounded-3xl max-h-96 object-cover z-10"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg z-20 hidden md:block">
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-1">
                        {bloodGroups.slice(0, 4).map((group) => (
                          <div key={group.type} className="text-center">
                            <BloodDropLogo size="sm" bloodType={group.type} />
                            <div className="text-xs mt-1 font-semibold">{group.percentage}%</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {bloodGroups.slice(4).map((group) => (
                          <div key={group.type} className="text-center">
                            <BloodDropLogo size="sm" bloodType={group.type} />
                            <div className="text-xs mt-1 font-semibold">{group.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pl-2 border-l border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Blood Types</h3>
                      <p className="text-xs text-gray-500">Distribution in population</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -left-6 bg-white rounded-lg p-3 shadow-lg z-20 hidden md:flex items-center space-x-3">
                  <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">One donation</h3>
                    <p className="text-xs text-gray-500">Can save up to 3 lives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

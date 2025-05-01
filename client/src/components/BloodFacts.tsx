import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { BloodFact } from '@shared/schema';

const BloodFactCard: React.FC<{ fact: BloodFact }> = ({ fact }) => {
  // Set default icon if not provided
  const icon = fact.icon || "tint";
  
  // Create slug for blood fact detail page
  const getSlug = () => {
    const slugs: Record<string, string> = {
      "Blood Types Compatibility": "compatibility",
      "Donation Intervals": "intervals",
      "Health Benefits": "benefits",
      "Eligibility Requirements": "eligibility",
      "The Donation Process": "process",
      "Blood Usage Statistics": "statistics"
    };
    
    return slugs[fact.title] || "compatibility";
  };
  
  return (
    <div className="blood-card bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-100">
      <div className="px-6 py-6">
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white mb-5 shadow-md transform transition-transform hover:rotate-12">
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
        <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-3">{fact.title}</h3>
        <p className="mt-2 text-base text-gray-600 leading-relaxed">
          {fact.content.substring(0, 150)}...
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="text-sm">
          <Link 
            href={`/blood-facts/${getSlug()}`} 
            className="inline-flex items-center font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Learn more 
            <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const BloodFacts: React.FC = () => {
  const { data: bloodFacts = [], isLoading } = useQuery<BloodFact[]>({
    queryKey: ['/api/blood-facts'],
  });

  return (
    <section id="blood-facts" className="py-24 bg-gradient-to-b from-white to-red-50 relative overflow-hidden">
      {/* Decorative blood cells background */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-red-500"
            style={{
              width: `${30 + Math.random() * 40}px`,
              height: `${30 + Math.random() * 40}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.4 + (Math.random() * 0.6)
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold py-1 px-3 rounded-full mb-4">
            Knowledge Hub
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Blood Donation Facts
          </h2>
          <div className="mt-4 mx-auto w-24 h-1 bg-red-500 rounded"></div>
          <p className="mt-6 text-xl text-gray-600 font-body max-w-2xl mx-auto">
            Learn more about blood donation and how your contribution can make a significant impact on saving lives.
          </p>
        </div>
        
        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-300 border-t-red-600"></div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bloodFacts.map((fact) => (
              <BloodFactCard key={fact.id} fact={fact} />
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <a 
            href="https://www.redcrossblood.org/donate-blood/blood-donation-process/what-happens-to-donated-blood.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            Learn More About Blood Donation
          </a>
        </div>
      </div>
    </section>
  );
};

export default BloodFacts;

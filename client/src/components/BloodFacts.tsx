import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BloodFact } from '@shared/schema';

const BloodFactCard: React.FC<{ fact: BloodFact }> = ({ fact }) => {
  return (
    <div className="blood-card bg-white overflow-hidden shadow rounded-lg">
      <div className="px-6 py-5">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
          <i className={`fas fa-${fact.icon} text-xl`}></i>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">{fact.title}</h3>
        <p className="mt-2 text-base text-gray-500">
          {fact.content}
        </p>
      </div>
      <div className="px-6 py-3 bg-gray-50">
        <div className="text-sm">
          <a href={fact.link || "#"} className="font-medium text-primary-600 hover:text-primary-500">
            Learn more <span aria-hidden="true">&rarr;</span>
          </a>
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
    <section id="blood-facts" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Blood Facts
          </h2>
          <p className="mt-4 text-lg text-gray-500 font-body">
            Learn more about blood donation and how it saves lives.
          </p>
        </div>
        
        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bloodFacts.map((fact) => (
              <BloodFactCard key={fact.id} fact={fact} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BloodFacts;

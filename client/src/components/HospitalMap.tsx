import React from 'react';

const HospitalMap: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nearby Blood Donation Centers
          </h2>
          <p className="mt-4 text-lg text-gray-500 font-body">
            Find the closest hospitals and blood banks where you can donate.
          </p>
        </div>
        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="h-96 bg-gray-200 sm:rounded-t-lg relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Mock Google Map */}
              <img 
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Map of nearby hospitals" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none"></div>
              <div className="absolute bottom-4 right-4">
                <button className="bg-white px-4 py-2 rounded-md shadow text-gray-700 text-sm font-medium flex items-center">
                  <i className="fas fa-location-arrow mr-2 text-primary-600"></i> Get Directions
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Find Blood Donation Centers
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Allow location access to find centers near you or search by city name.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="relative rounded-md shadow-sm">
                  <input 
                    type="text" 
                    name="search-location" 
                    id="search-location" 
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" 
                    placeholder="Enter city or pincode"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
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

export default HospitalMap;

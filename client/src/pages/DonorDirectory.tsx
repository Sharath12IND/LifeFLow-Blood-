import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Donor } from '@shared/schema';
import BloodDropLogo from '@/components/BloodDropLogo';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { formatDistance } from 'date-fns';
import EmergencyAlert from '@/components/EmergencyAlert';

const DonorDirectory: React.FC = () => {
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  
  // Fetch all donors
  const { data: donors = [], isLoading } = useQuery<Donor[]>({
    queryKey: ['/api/donors/filter', { bloodGroup: bloodGroupFilter, city: cityFilter, availability: availabilityFilter }],
  });
  
  // Helper function to get donor badge text based on donation count
  const getDonorBadge = (count: number): string => {
    if (count >= 10) return `${count}X Donor`;
    if (count >= 5) return `${count}X Donor`;
    if (count >= 1) return `${count}X Donor`;
    return 'New Donor';
  };
  
  // Helper function to get badge color class based on donation count
  const getBadgeColorClass = (count: number): string => {
    if (count >= 10) return 'bg-purple-100 text-purple-800';
    if (count >= 5) return 'bg-blue-100 text-blue-800';
    if (count >= 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  // Helper function to format the name
  const formatName = (donor: Donor): string => {
    if (donor.isAnonymous) {
      const parts = donor.fullName.split(' ');
      return parts.map(part => part[0] || '').join('.') + '.';
    }
    return donor.fullName;
  };
  
  // Helper function to format the last donation date
  const formatLastDonation = (date: Date | string | null | undefined): string => {
    if (!date) return 'No previous donations';
    const donationDate = typeof date === 'string' ? new Date(date) : date;
    return `Last donated: ${formatDistance(donationDate, new Date(), { addSuffix: true })}`;
  };
  
  return (
    <>
      <EmergencyAlert />
      <section id="donor-directory" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
              Find Blood Donors
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-body">
              Search our directory of available donors to find the blood type you need.
            </p>
          </div>

          <div className="mt-12">
            <div className="bg-white shadow-lg overflow-hidden sm:rounded-xl border border-gray-100">
              <div className="px-6 py-6 sm:p-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2 border-gray-200">Filter Donors</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="filter-blood-group" className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <Select 
                      onValueChange={setBloodGroupFilter}
                      value={bloodGroupFilter}
                    >
                      <SelectTrigger id="filter-blood-group" className="mt-2 w-full shadow-sm">
                        <SelectValue placeholder="All Blood Groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Blood Groups</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="filter-city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Input 
                      id="filter-city" 
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="mt-2 shadow-sm"
                      placeholder="Enter city name"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="filter-availability" className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <Select 
                      onValueChange={setAvailabilityFilter}
                      value={availabilityFilter}
                    >
                      <SelectTrigger id="filter-availability" className="mt-2 w-full shadow-sm">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available Now</SelectItem>
                        <SelectItem value="unavailable">Currently Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : donors.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-gray-500">No donors found matching your criteria.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <div key={donor.id} className="blood-card bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-100">
                  <div className="px-6 py-6 relative">
                    <span className={`absolute right-4 top-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${donor.isAvailable ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                      {donor.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 p-1">
                        <BloodDropLogo size="lg" bloodType={donor.bloodGroup} animated={donor.isAvailable} />
                      </div>
                      <div>
                        <h3 className="text-xl leading-6 font-semibold text-gray-900">{formatName(donor)}</h3>
                        <p className="text-sm text-gray-500 mt-1"><i className="fas fa-map-marker-alt mr-1"></i> {donor.city}, {donor.pincode}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-between items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium shadow-sm ${getBadgeColorClass(donor.donationCount)}`}>
                        {getDonorBadge(donor.donationCount)}
                      </span>
                      <p className="text-sm text-gray-500"><i className="far fa-calendar-alt mr-1"></i> {formatLastDonation(donor.lastDonationDate)}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600"><i className="fas fa-heartbeat mr-1"></i> <span className="font-medium">Health:</span> {donor.healthCondition || 'Good'}</p>
                      <p className="text-sm text-gray-600 mt-1"><i className="fas fa-user-clock mr-1"></i> <span className="font-medium">Age:</span> {donor.age} years</p>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between">
                      <a 
                        href={`tel:${donor.contactNumber}`} 
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${donor.isAvailable ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
                        aria-disabled={!donor.isAvailable}
                        onClick={(e) => !donor.isAvailable && e.preventDefault()}
                      >
                        <i className="fas fa-phone-alt mr-1"></i> Call
                      </a>
                      <a 
                        href={`https://wa.me/${typeof donor.contactNumber === 'string' ? donor.contactNumber.replace(/\D/g, '') : donor.contactNumber}`} 
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${donor.isAvailable ? 'text-white bg-green-600 hover:bg-green-700' : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
                        aria-disabled={!donor.isAvailable}
                        onClick={(e) => !donor.isAvailable && e.preventDefault()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                      </a>
                      <a 
                        href={`mailto:donor@example.com?subject=Blood%20Donation%20Request&body=Hello%20${encodeURIComponent(donor.fullName)},%0A%0AI%20am%20in%20need%20of%20${encodeURIComponent(donor.bloodGroup)}%20blood.%20Please%20contact%20me%20if%20you%20are%20available%20to%20donate.%0A%0AThank%20you.`} 
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${donor.isAvailable ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
                        aria-disabled={!donor.isAvailable}
                        onClick={(e) => !donor.isAvailable && e.preventDefault()}
                      >
                        <i className="fas fa-envelope mr-1"></i> Email
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination - simplified version for now */}
          {donors.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-lg shadow-md overflow-hidden" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-3 py-2.5 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left"></i>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-red-50 border-red-200 text-red-700 relative inline-flex items-center px-4 py-2.5 border text-sm font-semibold">
                  1
                </a>
                <a href="#" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 relative inline-flex items-center px-4 py-2.5 border text-sm font-medium transition-colors">
                  2
                </a>
                <a href="#" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 relative inline-flex items-center px-4 py-2.5 border text-sm font-medium transition-colors">
                  3
                </a>
                <a href="#" className="relative inline-flex items-center px-3 py-2.5 border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  <span className="sr-only">Next</span>
                  <i className="fas fa-chevron-right"></i>
                </a>
              </nav>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DonorDirectory;

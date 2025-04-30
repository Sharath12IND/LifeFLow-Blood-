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
  const formatLastDonation = (date: Date | null | undefined): string => {
    if (!date) return 'No previous donations';
    return `Last donated: ${formatDistance(new Date(date), new Date(), { addSuffix: true })}`;
  };
  
  return (
    <>
      <EmergencyAlert />
      <section id="donor-directory" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find Blood Donors
            </h2>
            <p className="mt-4 text-lg text-gray-500 font-body">
              Search our directory of available donors to find the blood type you need.
            </p>
          </div>

          <div className="mt-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="filter-blood-group" className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <Select 
                      onValueChange={setBloodGroupFilter}
                      value={bloodGroupFilter}
                    >
                      <SelectTrigger id="filter-blood-group" className="mt-1">
                        <SelectValue placeholder="All Blood Groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Blood Groups</SelectItem>
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
                      className="mt-1"
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
                      <SelectTrigger id="filter-availability" className="mt-1">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
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
                <div key={donor.id} className="blood-card bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-6 py-5 relative">
                    <span className={`absolute right-6 top-5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {donor.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <BloodDropLogo size="lg" bloodType={donor.bloodGroup} />
                      </div>
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{formatName(donor)}</h3>
                        <p className="text-sm text-gray-500">{donor.city}, {donor.pincode}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${getBadgeColorClass(donor.donationCount)}`}>
                        {getDonorBadge(donor.donationCount)}
                      </span>
                      <p className="mt-2 text-sm text-gray-500">{formatLastDonation(donor.lastDonationDate)}</p>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex justify-between">
                      <a 
                        href={`tel:${donor.contactNumber}`} 
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${donor.isAvailable ? 'text-primary-700 bg-primary-100 hover:bg-primary-200' : 'text-gray-500 bg-gray-100 cursor-not-allowed'}`}
                        aria-disabled={!donor.isAvailable}
                        onClick={(e) => !donor.isAvailable && e.preventDefault()}
                      >
                        <i className="fas fa-phone-alt mr-1"></i> Call
                      </a>
                      <a 
                        href={`https://wa.me/${donor.contactNumber.replace(/\D/g, '')}`} 
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${donor.isAvailable ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-gray-500 bg-gray-100 cursor-not-allowed'}`}
                        aria-disabled={!donor.isAvailable}
                        onClick={(e) => !donor.isAvailable && e.preventDefault()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                      </a>
                      <a 
                        href={`mailto:donor@example.com?subject=Blood%20Donation%20Request&body=Hello%20${encodeURIComponent(donor.fullName)},%0A%0AI%20am%20in%20need%20of%20${encodeURIComponent(donor.bloodGroup)}%20blood.%20Please%20contact%20me%20if%20you%20are%20available%20to%20donate.%0A%0AThank%20you.`} 
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${donor.isAvailable ? 'text-blue-700 bg-blue-100 hover:bg-blue-200' : 'text-gray-500 bg-gray-100 cursor-not-allowed'}`}
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
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left"></i>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </a>
                <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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

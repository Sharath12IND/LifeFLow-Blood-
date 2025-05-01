import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { BloodRequest, insertBloodRequestSchema, Donor } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import BloodDropLogo from '@/components/BloodDropLogo';
import { formatDistance } from 'date-fns';
import EmergencyAlert from '@/components/EmergencyAlert';
import { FaHeartbeat, FaMapMarkerAlt, FaUserClock, FaPhone, FaEnvelope, FaHospital, FaInfoCircle, FaCheck, FaWhatsapp, FaCalendarAlt } from 'react-icons/fa';

// Extend the insertBloodRequestSchema to add validation rules
const formSchema = insertBloodRequestSchema.extend({
  patientName: z.string().min(2, 'Patient name is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  hospitalName: z.string().min(2, 'Hospital name is required'),
  hospitalLocation: z.string().min(2, 'Hospital location is required'),
  contactNumber: z.string().min(10, 'Valid contact number is required'),
  urgency: z.string().min(1, 'Urgency level is required'),
});

type FormData = z.infer<typeof formSchema>;

const RequestBlood: React.FC = () => {
  const { toast } = useToast();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [submittedForm, setSubmittedForm] = useState<boolean>(false);
  
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const { data: bloodRequests = [], isLoading, refetch } = useQuery<BloodRequest[]>({
    queryKey: ['/api/blood-requests/active'],
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
  
  // Manual refresh function with visual indicator
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Query to fetch donors matching the selected blood group
  const { data: matchingDonors = [], isLoading: isLoadingDonors } = useQuery<Donor[]>({
    queryKey: ['/api/donors/filter', { bloodGroup: selectedBloodGroup }],
    enabled: !!selectedBloodGroup && submittedForm,
  });
  
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      bloodGroup: '',
      hospitalName: '',
      hospitalLocation: '',
      contactNumber: '',
      urgency: 'medium',
      additionalInfo: '',
    }
  });
  
  const createRequest = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/blood-requests', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Request Submitted",
        description: "Your blood request has been submitted successfully. Matching donors are shown below.",
        variant: "default",
      });
      
      // Don't reset the form yet so the blood group selection remains
      // We'll keep submittedForm true to display matching donors
      
      // Force a refresh of the data
      setTimeout(() => {
        // Invalidate queries to refresh blood requests list
        queryClient.invalidateQueries({ queryKey: ['/api/blood-requests/active'] });
        queryClient.invalidateQueries({ queryKey: ['/api/donors/filter'] });
      }, 300); // Small delay to ensure the database has time to process
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const fulfillRequest = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/blood-requests/${id}/fulfill`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Fulfilled",
        description: "The blood request has been marked as fulfilled.",
        variant: "default",
      });
      // Invalidate queries to refresh blood requests list
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests/active'] });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = async (data: FormData) => {
    setSelectedBloodGroup(data.bloodGroup);
    await createRequest.mutate(data);
    setSubmittedForm(true);
  };
  
  // Helper function to get urgency badge class
  const getUrgencyBadgeClass = (urgency: string): string => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper function to format the creation date
  const formatCreationDate = (date: Date | string): string => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if date is valid before formatting
      if (isNaN(dateObj.getTime())) {
        return 'Posted recently';
      }
      
      return `Posted: ${formatDistance(dateObj, new Date(), { addSuffix: true })}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Posted recently';
    }
  };
  
  return (
    <>
      <EmergencyAlert />
      <section id="request-blood" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
              Request Blood
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-body">
              Need blood urgently? Submit a request and we'll connect you with potential donors.
            </p>
          </div>
          <div className="mt-12 bg-white py-8 px-4 shadow-lg sm:rounded-xl border border-gray-100 sm:px-10">
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">Submit a Blood Request</h3>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label htmlFor="patientName" className="text-gray-700">Patient Name</Label>
                  <Input 
                    id="patientName"
                    className="mt-2 shadow-sm"
                    {...register('patientName')}
                    aria-invalid={errors.patientName ? 'true' : 'false'}
                  />
                  {errors.patientName && (
                    <p className="text-sm text-red-600 mt-1">{errors.patientName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="bloodGroup" className="text-gray-700">Blood Group Needed</Label>
                  <Controller
                    control={control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="bloodGroup" className="mt-2 shadow-sm">
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
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
                    )}
                  />
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-600 mt-1">{errors.bloodGroup.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="hospitalName" className="text-gray-700">Hospital Name</Label>
                  <Input 
                    id="hospitalName"
                    className="mt-2 shadow-sm"
                    {...register('hospitalName')}
                    aria-invalid={errors.hospitalName ? 'true' : 'false'}
                  />
                  {errors.hospitalName && (
                    <p className="text-sm text-red-600 mt-1">{errors.hospitalName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="hospitalLocation" className="text-gray-700">Hospital Location</Label>
                  <Input 
                    id="hospitalLocation"
                    className="mt-2 shadow-sm"
                    {...register('hospitalLocation')}
                    aria-invalid={errors.hospitalLocation ? 'true' : 'false'}
                  />
                  {errors.hospitalLocation && (
                    <p className="text-sm text-red-600 mt-1">{errors.hospitalLocation.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="contactNumber" className="text-gray-700">Contact Number</Label>
                  <Input 
                    id="contactNumber"
                    className="mt-2 shadow-sm"
                    {...register('contactNumber')}
                    aria-invalid={errors.contactNumber ? 'true' : 'false'}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="urgency" className="text-gray-700">Urgency Level</Label>
                  <Controller
                    control={control}
                    name="urgency"
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="urgency" className="mt-2 shadow-sm">
                          <SelectValue placeholder="Select Urgency Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.urgency && (
                    <p className="text-sm text-red-600 mt-1">{errors.urgency.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor="additionalInfo" className="text-gray-700">Additional Information</Label>
                  <Textarea 
                    id="additionalInfo"
                    className="mt-2 shadow-sm"
                    {...register('additionalInfo')}
                    rows={3}
                  />
                  <p className="mt-2 text-sm text-gray-500">Add any details that might help donors understand the situation better.</p>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium shadow-md transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FaHeartbeat className="mr-2" /> Submit Blood Request
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {submittedForm && selectedBloodGroup && (
            <div className="mt-12 bg-white py-8 px-4 shadow-lg sm:rounded-xl border border-gray-100 sm:px-10">
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
                Matching Donors ({selectedBloodGroup})
              </h3>
              
              {isLoadingDonors ? (
                <div className="mt-6 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
              ) : matchingDonors.length === 0 ? (
                <p className="mt-4 text-gray-500 text-center py-8">No matching donors found for blood group {selectedBloodGroup}.</p>
              ) : (
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {matchingDonors.map((donor) => (
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
                            <h3 className="text-xl leading-6 font-semibold text-gray-900">{donor.isAnonymous ? 'Anonymous Donor' : donor.fullName}</h3>
                            <p className="text-sm text-gray-500 mt-1"><FaMapMarkerAlt className="inline mr-1" size={12} /> {donor.city}, {donor.pincode}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-between items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium shadow-sm ${donor.donationCount > 5 ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                            {donor.donationCount > 10 ? 'Platinum Donor' : donor.donationCount > 5 ? 'Gold Donor' : donor.donationCount > 0 ? 'Regular Donor' : 'New Donor'}
                          </span>
                          <p className="text-sm text-gray-500">
                            <FaCalendarAlt className="inline mr-1" size={12} /> 
                            {donor.lastDonationDate 
                              ? (() => {
                                  try {
                                    const donationDate = new Date(donor.lastDonationDate);
                                    return isNaN(donationDate.getTime()) 
                                      ? 'No previous donations'
                                      : `Last donated: ${formatDistance(donationDate, new Date(), { addSuffix: true })}`;
                                  } catch (e) {
                                    return 'No previous donations';
                                  }
                                })() 
                              : 'No previous donations'}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600"><FaHeartbeat className="inline mr-1" size={12} /> <span className="font-medium">Health:</span> {donor.healthCondition || 'Good'}</p>
                          <p className="text-sm text-gray-600 mt-1"><FaUserClock className="inline mr-1" size={12} /> <span className="font-medium">Age:</span> {donor.age} years</p>
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex justify-center gap-3">
                          <a 
                            href={`tel:${donor.contactNumber}`} 
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors w-32 justify-center ${donor.isAvailable ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
                            aria-disabled={!donor.isAvailable}
                            onClick={(e) => !donor.isAvailable && e.preventDefault()}
                          >
                            <FaPhone className="mr-1" size={12} /> Call
                          </a>
                          <a 
                            href={`mailto:donor@example.com?subject=Blood%20Donation%20Request&body=Hello%20${encodeURIComponent(donor.isAnonymous ? 'Donor' : donor.fullName)},%0A%0AI%20am%20in%20need%20of%20${encodeURIComponent(donor.bloodGroup)}%20blood.%20Please%20contact%20me%20if%20you%20are%20available%20to%20donate.%0A%0AThank%20you.`} 
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors w-32 justify-center ${donor.isAvailable ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
                            aria-disabled={!donor.isAvailable}
                            onClick={(e) => !donor.isAvailable && e.preventDefault()}
                          >
                            <FaEnvelope className="mr-1" size={12} /> Email
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-12 bg-white py-8 px-4 shadow-lg sm:rounded-xl border border-gray-100 sm:px-10">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Current Blood Requests</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="text-sm flex items-center"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <span className="animate-spin mr-1 h-3 w-3 border border-current border-t-transparent rounded-full"></span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FaCalendarAlt className="mr-1 h-3 w-3" /> Refresh List
                  </>
                )}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : bloodRequests.length === 0 ? (
              <p className="mt-4 text-gray-500 text-center py-8">No active blood requests at the moment.</p>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bloodRequests.map((request) => (
                  <div key={request.id} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-100">
                    <div className="px-6 py-6 relative">
                      <span className={`absolute right-4 top-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-md ${getUrgencyBadgeClass(request.urgency)} border-2 ${request.urgency === 'high' ? 'border-red-300' : request.urgency === 'medium' ? 'border-yellow-300' : 'border-green-300'}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 p-1">
                          <BloodDropLogo size="lg" bloodType={request.bloodGroup} animated={request.urgency === 'high'} />
                        </div>
                        <div>
                          <h3 className="text-xl leading-6 font-semibold text-gray-900">{request.patientName}</h3>
                          <p className="text-sm text-gray-500 mt-1"><FaHospital className="inline mr-1" size={12} /> {request.hospitalName}, {request.hospitalLocation}</p>
                        </div>
                      </div>
                      <div className="mt-5">
                        <p className="text-sm text-gray-600"><FaCalendarAlt className="inline mr-1" size={12} /> {formatCreationDate(request.createdAt)}</p>
                        
                        {request.additionalInfo && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                            <p className="text-sm text-gray-600"><FaInfoCircle className="inline mr-1" size={12} /> <span className="font-medium">Additional Info:</span> {request.additionalInfo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-center gap-3">
                        <a 
                          href={`tel:${request.contactNumber}`} 
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors w-28 justify-center text-white bg-red-600 hover:bg-red-700"
                        >
                          <FaPhone className="mr-1" size={12} /> Call
                        </a>
                        <a 
                          href={`https://wa.me/${typeof request.contactNumber === 'string' ? request.contactNumber.replace(/\D/g, '') : request.contactNumber}`} 
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors w-28 justify-center text-white bg-green-600 hover:bg-green-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp className="mr-1" size={12} /> WhatsApp
                        </a>
                        <button 
                          type="button" 
                          onClick={() => fulfillRequest.mutate(request.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors w-28 justify-center text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FaCheck className="mr-1" size={12} /> Fulfilled
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default RequestBlood;

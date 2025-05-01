import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { BloodRequest, insertBloodRequestSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import BloodDropLogo from '@/components/BloodDropLogo';
import { formatDistance } from 'date-fns';
import EmergencyAlert from '@/components/EmergencyAlert';

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
  
  const { data: bloodRequests = [], isLoading } = useQuery<BloodRequest[]>({
    queryKey: ['/api/blood-requests/active'],
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
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your blood request has been submitted successfully.",
        variant: "default",
      });
      reset();
      // Invalidate queries to refresh blood requests list
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests/active'] });
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
    await createRequest.mutate(data);
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
    const dateObj = date instanceof Date ? date : new Date(date);
    return `Posted: ${formatDistance(dateObj, new Date(), { addSuffix: true })}`;
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
                  className="w-full py-3 px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Blood Request'}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-medium text-gray-900">Current Blood Requests</h3>
            
            {isLoading ? (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : bloodRequests.length === 0 ? (
              <p className="mt-4 text-gray-500">No active blood requests at the moment.</p>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bloodRequests.map((request) => (
                  <div key={request.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    <div className="px-6 py-5 relative">
                      <span className={`absolute right-6 top-5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyBadgeClass(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <BloodDropLogo size="lg" bloodType={request.bloodGroup} />
                        </div>
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">{request.patientName}</h3>
                          <p className="text-sm text-gray-500">{request.hospitalName}, {request.hospitalLocation}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">{formatCreationDate(request.createdAt)}</p>
                        {request.additionalInfo && (
                          <p className="mt-1 text-sm text-gray-500">{request.additionalInfo}</p>
                        )}
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <div className="flex justify-between">
                        <a 
                          href={`tel:${request.contactNumber}`} 
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <i className="fas fa-phone-alt mr-1"></i> Call
                        </a>
                        <a 
                          href={`https://wa.me/${typeof request.contactNumber === 'string' ? request.contactNumber.replace(/\D/g, '') : request.contactNumber}`} 
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                        </a>
                        <button 
                          type="button" 
                          onClick={() => fulfillRequest.mutate(request.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <i className="fas fa-check mr-1"></i> Mark Fulfilled
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

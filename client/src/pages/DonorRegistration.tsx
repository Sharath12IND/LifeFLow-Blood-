import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { insertDonorSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import EmergencyAlert from '@/components/EmergencyAlert';

// Extend the insertDonorSchema to add validation rules
const formSchema = insertDonorSchema.extend({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.number().min(18, 'You must be at least 18 years old').max(65, 'Maximum age for donation is 65'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(5, 'Valid pincode is required'),
  contactNumber: z.string().min(10, 'Valid contact number is required'),
  healthCondition: z.string().min(1, 'Health condition is required'),
});

type FormData = z.infer<typeof formSchema>;

const DonorRegistration = () => {
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      age: undefined,
      bloodGroup: '',
      city: '',
      pincode: '',
      contactNumber: '',
      lastDonationDate: undefined,
      healthCondition: 'good',
      isAvailable: true,
      isAnonymous: false,
    }
  });
  
  const registerDonor = useMutation({
    mutationFn: async (data: FormData) => {
      // Add isAvailable from toggle state
      const donorData = { ...data, isAvailable };
      
      const response = await apiRequest('POST', '/api/donors', donorData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully registered as a donor.",
        variant: "default",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = async (data: FormData) => {
    await registerDonor.mutate(data);
  };
  
  return (
    <>
      <EmergencyAlert />
      <section id="donor-registration" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Become a Donor
            </h2>
            <p className="mt-4 text-lg text-gray-500 font-body">
              Register as a blood donor today and help save lives. Your information will be kept secure and only used to connect you with those in need.
            </p>
          </div>
          <div className="mt-12 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    className="mt-1"
                    {...register('fullName')}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    className="mt-1"
                    {...register('age', { valueAsNumber: true })}
                    aria-invalid={errors.age ? 'true' : 'false'}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Controller
                    control={control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="mt-1">
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
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    className="mt-1"
                    {...register('city')}
                    aria-invalid={errors.city ? 'true' : 'false'}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input 
                    id="pincode"
                    className="mt-1"
                    {...register('pincode')}
                    aria-invalid={errors.pincode ? 'true' : 'false'}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input 
                    id="contactNumber"
                    className="mt-1"
                    {...register('contactNumber')}
                    aria-invalid={errors.contactNumber ? 'true' : 'false'}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="lastDonationDate">Last Donation Date</Label>
                  <Input 
                    id="lastDonationDate"
                    type="date"
                    className="mt-1"
                    {...register('lastDonationDate')}
                    aria-invalid={errors.lastDonationDate ? 'true' : 'false'}
                  />
                  {errors.lastDonationDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.lastDonationDate.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <div className="space-y-4">
                    <Label>Health Condition</Label>
                    <Controller
                      control={control}
                      name="healthCondition"
                      render={({ field }) => (
                        <RadioGroup 
                          defaultValue={field.value} 
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="excellent" id="health-excellent" />
                            <Label htmlFor="health-excellent">Excellent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="good" id="health-good" />
                            <Label htmlFor="health-good">Good</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fair" id="health-fair" />
                            <Label htmlFor="health-fair">Fair</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.healthCondition && (
                      <p className="text-sm text-red-600">{errors.healthCondition.message}</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <div 
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${isAvailable ? 'bg-primary-600' : 'bg-gray-200'}`}
                      onClick={() => setIsAvailable(!isAvailable)}
                      role="switch"
                      aria-checked={isAvailable}
                      tabIndex={0}
                    >
                      <span 
                        aria-hidden="true" 
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`}
                      ></span>
                    </div>
                    <span className="ml-3">
                      <Label>Available to Donate</Label>
                    </span>
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="isAnonymous"
                      render={({ field }) => (
                        <Checkbox 
                          id="isAnonymous" 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="isAnonymous">Remain anonymous (only show initials)</Label>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full py-3 px-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register as Donor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonorRegistration;

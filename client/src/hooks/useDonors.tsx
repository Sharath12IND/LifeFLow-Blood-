import { useQuery } from '@tanstack/react-query';
import { Donor } from '@shared/schema';

type UseDonorsParams = {
  bloodGroup?: string;
  city?: string;
  available?: boolean;
};

export function useDonors(params?: UseDonorsParams) {
  // Build query string
  let queryString = '/api/donors/filter?';
  
  if (params?.bloodGroup) {
    queryString += `bloodGroup=${encodeURIComponent(params.bloodGroup)}&`;
  }
  
  if (params?.city) {
    queryString += `city=${encodeURIComponent(params.city)}&`;
  }
  
  if (params?.available !== undefined) {
    queryString += `availability=${params.available ? 'available' : 'unavailable'}&`;
  }
  
  // Remove trailing '&' or '?'
  queryString = queryString.replace(/[&?]$/, '');
  
  return useQuery<Donor[]>({
    queryKey: [queryString],
  });
}

export function useDonor(id: number) {
  return useQuery<Donor>({
    queryKey: [`/api/donors/${id}`],
    enabled: id > 0, // Only run if ID is valid
  });
}

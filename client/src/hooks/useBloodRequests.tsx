import { useQuery, useMutation } from '@tanstack/react-query';
import { BloodRequest, InsertBloodRequest } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

export function useBloodRequests(active: boolean = true) {
  const endpoint = active ? '/api/blood-requests/active' : '/api/blood-requests';
  
  return useQuery<BloodRequest[]>({
    queryKey: [endpoint],
  });
}

export function useBloodRequest(id: number) {
  return useQuery<BloodRequest>({
    queryKey: [`/api/blood-requests/${id}`],
    enabled: id > 0, // Only run if ID is valid
  });
}

export function useCreateBloodRequest() {
  return useMutation({
    mutationFn: async (data: InsertBloodRequest) => {
      const response = await apiRequest('POST', '/api/blood-requests', data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both active and all blood requests queries
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests'] });
    },
  });
}

export function useMarkBloodRequestFulfilled() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/blood-requests/${id}/fulfill`, {});
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both active and all blood requests queries
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blood-requests'] });
    },
  });
}

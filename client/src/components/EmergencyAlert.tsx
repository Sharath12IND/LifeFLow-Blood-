import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface EmergencyAlertProps {
  message?: string;
  contactNumber?: string;
}

const EmergencyAlert = ({ message, contactNumber }: EmergencyAlertProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  
  const { data: emergencyAlerts = [] } = useQuery({
    queryKey: ['/api/emergency-alerts/active'],
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Use passed message/contactNumber or the first alert from the API
  const alertMessage = message || (emergencyAlerts[0]?.message ?? '');
  const alertContactNumber = contactNumber || (emergencyAlerts[0]?.contactNumber ?? '');
  
  // Don't render if no alert or if dismissed
  if (isDismissed || !alertMessage) {
    return null;
  }
  
  return (
    <div className="alert-banner bg-red-600 text-white px-4 py-3 shadow-md" role="alert">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          <span className="font-medium">{alertMessage}</span>
        </div>
        <div className="flex space-x-3">
          {alertContactNumber && (
            <a 
              href={`tel:${alertContactNumber}`} 
              className="underline text-white text-sm hover:text-gray-100"
              aria-label={`Call ${alertContactNumber}`}
            >
              Respond Now
            </a>
          )}
          <button 
            onClick={() => setIsDismissed(true)}
            className="text-white hover:text-gray-200"
            aria-label="Dismiss alert"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;

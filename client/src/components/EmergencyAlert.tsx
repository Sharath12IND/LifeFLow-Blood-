import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BloodDropLogo from './BloodDropLogo';
import { EmergencyAlert as EmergencyAlertType } from '@shared/schema';

interface EmergencyAlertProps {
  message?: string;
  contactNumber?: string;
}

const EmergencyAlert = ({ message, contactNumber }: EmergencyAlertProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: emergencyAlerts = [] } = useQuery<EmergencyAlertType[]>({
    queryKey: ['/api/emergency-alerts/active'],
    refetchInterval: 60000, // Refetch every minute
  });
  
  useEffect(() => {
    // Auto-expand after a short delay to grab attention
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use passed message/contactNumber or the first alert from the API
  const alertMessage = message || (emergencyAlerts?.[0]?.message ?? '');
  const alertContactNumber = contactNumber || (emergencyAlerts?.[0]?.contactNumber ?? '');
  
  // Parse blood type from message if present
  const extractBloodType = (msg: string): string | null => {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    for (const type of bloodTypes) {
      if (msg.includes(type)) {
        return type;
      }
    }
    return null;
  };
  
  const bloodType = extractBloodType(alertMessage);
  
  // Don't render if no alert or if dismissed
  if (isDismissed || !alertMessage) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="alert-banner bg-red-600 text-white px-4 py-3 shadow-md relative z-50" 
        role="alert"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {bloodType ? (
                    <BloodDropLogo size="md" bloodType={bloodType} animated />
                  ) : (
                    <i className="fas fa-exclamation-triangle text-2xl"></i>
                  )}
                </motion.div>
              </div>
              <div>
                <div className="font-medium text-lg">{alertMessage}</div>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs md:text-sm text-red-100"
                  >
                    {bloodType ? (
                      <span>We urgently need {bloodType} blood type donors. Your donation can save lives!</span>
                    ) : (
                      <span>Emergency alert: Please respond if you can help</span>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              {alertContactNumber && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href={`tel:${alertContactNumber}`} 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label={`Call ${alertContactNumber}`}
                  >
                    <i className="fas fa-phone-alt mr-2"></i>
                    Respond Now
                  </a>
                </motion.div>
              )}
              <button 
                onClick={() => setIsDismissed(true)}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label="Dismiss alert"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-1 flex justify-end"
            >
              <button 
                onClick={() => setIsExpanded(false)} 
                className="text-xs text-red-200 hover:text-white focus:outline-none"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmergencyAlert;

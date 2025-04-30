import React, { useState, useEffect } from 'react';

interface BloodDropLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  bloodType?: string;
  animated?: boolean;
}

const BloodDropLogo: React.FC<BloodDropLogoProps> = ({ 
  className = '', 
  size = 'md',
  withText = false,
  bloodType,
  animated = false
}) => {
  const [pulsing, setPulsing] = useState(animated);
  
  // Define size based on prop
  const sizeClasses = {
    sm: 'h-6 w-4',
    md: 'h-8 w-6',
    lg: 'h-12 w-8',
  };
  
  // Set color based on blood type
  const getTypeColor = (type?: string) => {
    if (!type) return '';
    
    switch(type.toUpperCase()) {
      case 'A+':
      case 'A-':
        return 'bg-red-700';
      case 'B+':
      case 'B-':
        return 'bg-red-600';
      case 'AB+':
      case 'AB-':
        return 'bg-red-800';
      case 'O+':
      case 'O-':
        return 'bg-red-500';
      default:
        return 'bg-primary-600';
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (animated) {
        setPulsing(prev => !prev);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <div className="flex items-center">
      <div 
        className={`blood-drop-shape flex items-center justify-center text-white font-bold ${sizeClasses[size]} ${bloodType ? getTypeColor(bloodType) : 'bg-primary-600'} ${pulsing ? 'animate-pulse-scale' : ''} ${className}`}
      >
        {bloodType && (
          <span className={`text-white ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>{bloodType}</span>
        )}
      </div>
      {withText && (
        <div className="ml-2">
          <span className="font-bold text-xl text-gray-800">Life<span className="text-primary-600">Flow</span></span>
          {bloodType && (
            <div className="text-xs text-gray-500">Donate & Save Lives</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BloodDropLogo;

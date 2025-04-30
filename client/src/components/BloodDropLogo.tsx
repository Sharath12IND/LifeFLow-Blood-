import React from 'react';

interface BloodDropLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  bloodType?: string;
}

const BloodDropLogo: React.FC<BloodDropLogoProps> = ({ 
  className = '', 
  size = 'md',
  withText = false,
  bloodType
}) => {
  // Define size based on prop
  const sizeClasses = {
    sm: 'h-6 w-4',
    md: 'h-8 w-6',
    lg: 'h-12 w-8',
  };

  return (
    <div className="flex items-center">
      <div 
        className={`blood-drop-shape bg-primary-600 flex items-center justify-center text-white font-bold ${sizeClasses[size]} ${className}`}
      >
        {bloodType && (
          <span className={`text-white ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>{bloodType}</span>
        )}
      </div>
      {withText && (
        <span className="ml-2 font-bold text-xl text-gray-800">LifeFlow</span>
      )}
    </div>
  );
};

export default BloodDropLogo;

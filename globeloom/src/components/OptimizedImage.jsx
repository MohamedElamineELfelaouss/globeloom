import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  fallback = "/placeholder.jpg",
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-800 to-midnight-900 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-aurora-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={hasError ? fallback : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
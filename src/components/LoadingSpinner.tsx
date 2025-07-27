import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Processing your PDF...</p>
      <p className="text-sm text-gray-500">This might take a moment, especially for image descriptions.</p>
    </div>
  );
};

export default LoadingSpinner;
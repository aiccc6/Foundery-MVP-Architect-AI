
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="h-64 loading-shimmer rounded-[3rem] w-full"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl loading-shimmer"></div>
            <div className="h-6 loading-shimmer rounded w-1/3"></div>
          </div>
          <div className="space-y-3 pl-14">
            <div className="h-4 loading-shimmer rounded w-full"></div>
            <div className="h-4 loading-shimmer rounded w-full"></div>
            <div className="h-4 loading-shimmer rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl loading-shimmer"></div>
            <div className="h-6 loading-shimmer rounded w-1/3"></div>
          </div>
          <div className="space-y-3 pl-14">
            <div className="h-4 loading-shimmer rounded w-full"></div>
            <div className="h-4 loading-shimmer rounded w-full"></div>
            <div className="h-4 loading-shimmer rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div className="h-10 loading-shimmer rounded-xl w-1/4"></div>
        <div className="h-48 loading-shimmer rounded-3xl w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

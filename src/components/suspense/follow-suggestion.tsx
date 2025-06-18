import React from "react";

interface SuspenseUIFollowSuggestionProps {
  repeat?: number;
}

const SuspenseUIFollowSuggestion: React.FC<SuspenseUIFollowSuggestionProps> = ({
  repeat,
}) => {
  // Single UI (when repeat is undefined or 1)
  const SingleSkeleton = () => (
    <div className="animate-pulse p-4 max-w-md mx-auto">
      <div className="flex gap-4 items-center w-full">
        <div className="rounded-full bg-gray-800 h-12 w-12"></div>
        <div className="flex-1 space-y-2 w-[70%]">
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-3 bg-gray-800 rounded w-full"></div>
        </div>
        <div className="w-[20%]">
          <div className="h-9 bg-gray-800 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  // If repeat is not provided or is 1, return single skeleton
  if (!repeat || repeat === 1) {
    return <SingleSkeleton />;
  }

  // If repeat > 1, return array of skeletons
  return (
    <>
      {Array.from({ length: repeat }).map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </>
  );
};

export default SuspenseUIFollowSuggestion;
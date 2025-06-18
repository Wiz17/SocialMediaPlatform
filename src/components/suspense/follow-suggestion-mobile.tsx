import React from "react"

interface FollowSuggestionMobileProps {
  repeat?: number;
}

const FollowSuggestionMobile: React.FC<FollowSuggestionMobileProps> = ({ repeat }) => {
  // Single skeleton UI
  const SingleSkeleton = () => (
    <div className="bg-zinc-800 rounded-lg w-[160px] flex-shrink-0 py-5">
      <div className="w-12 h-12 rounded-full bg-zinc-700 mx-auto animate-pulse"></div>
      <div className="h-4 w-20 bg-zinc-700 rounded mt-3 mx-auto animate-pulse"></div>
      <div className="h-4 w-20 bg-zinc-600 rounded mt-2 mx-auto animate-pulse"></div>
      <div className="flex justify-center mt-4">
        <div className="h-6 w-20 bg-zinc-700 rounded animate-pulse"></div>
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
      <div className="flex gap-3">
        {Array.from({ length: repeat }).map((_, index) => (
          <SingleSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export default FollowSuggestionMobile;
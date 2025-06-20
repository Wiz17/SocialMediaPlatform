import React from "react";

interface PostFeedProps {
  repeat?: number;
}

const PostFeed: React.FC<PostFeedProps> = ({ repeat }) => {
  // Single skeleton post UI
  const SinglePostSkeleton = () => (
    <div className="bg-black text-white p-4 rounded-lg w-full max-w-full mx-auto">
      <div className="flex space-x-4">
        {/* Left vertical div (avatar circle) */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-[50%] animate-pulse mb-1" />
              <div className="h-3 bg-gray-800 rounded w-[50%] animate-pulse" />
            </div>
          </div>

          <div className="h-56 bg-gray-800 rounded-lg mt-4 animate-pulse w-11/12" />

          <div className="flex items-center mt-4 space-x-4">
            <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
            <div className="h-3 w-12 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  // If repeat is not provided or is 1, return single skeleton
  if (!repeat || repeat === 1) {
    return <SinglePostSkeleton />;
  }

  // If repeat > 1, return array of skeletons
  return (
    <>
      {Array.from({ length: repeat }).map((_, index) => (
        <SinglePostSkeleton key={index} />
      ))}
    </>
  );
};

export default PostFeed;
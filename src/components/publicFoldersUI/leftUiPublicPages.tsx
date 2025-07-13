import React from "react";

const LeftUiPublicPages = () => {
  return (
    <>
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15),_transparent_50%)]"></div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-500"></div>

        <div className="relative z-10 text-center max-w-md px-8">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
            <img
              src="https://arxkebsmrbstwstaxbig.supabase.co/storage/v1/object/public/post-images/uploads/socialX.png"
              alt="X Logo"
              className="w-32 h-32 mx-auto relative z-10 rounded-2xl shadow-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Happening now
          </h1>
          <p className="text-xl text-gray-300 font-light mb-8">Join today.</p>
          <div className="flex flex-col space-y-2 text-gray-400 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <span>Connect with people worldwide</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span>Share your thoughts instantly</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>Be part of the conversation</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftUiPublicPages;

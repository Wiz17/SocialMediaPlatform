import React from "react";

const PostFeed = () => {
    return (

        <>
            <div className="bg-black text-white p-4 rounded-lg w-full max-w-full mx-auto">
                <div className="flex space-x-4">
                    {/* Left vertical div (avatar circle) */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse" />
                    </div>

                    {/* Right vertical div (name, post, image, actions) */}
                    <div className="flex flex-col flex-grow">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-800 rounded w-[50%] animate-pulse mb-1" />
                                <div className="h-3 bg-gray-800 rounded w-[50%] animate-pulse" />
                            </div>
                        </div>

                        <div className="h-56 bg-gray-800 rounded-lg mt-4 animate-pulse" />

                        <div className="flex items-center mt-4 space-x-4">
                            <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
                            <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
                            <div className="h-3 w-12 bg-gray-800 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default PostFeed;
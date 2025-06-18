import React from "react";

const SuspenseUIFollowSuggestion=()=>{
    return(
        <>
        <div className="animate-pulse p-4 max-w-md mx-auto">
                                    {/* First Row: Circle (20%) + Middle (70%) + End (20%) */}
                                    <div className="flex gap-4 items-center w-full">
                                        {/* Circle - 20% width */}
                                        <div className="rounded-full bg-gray-800 h-12 w-12"></div>

                                        {/* Middle Section - 70% width (two stacked rectangles) */}
                                        <div className="flex-1 space-y-2 w-[70%]">
                                            <div className="h-4 bg-gray-800 rounded w-full"></div>
                                            <div className="h-3 bg-gray-800 rounded w-full"></div>
                                        </div>

                                        {/* End Section - 20% width (single rectangle) */}
                                        <div className="w-[20%]">
                                            <div className="h-9 bg-gray-800 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
        </>
    )
}

export default SuspenseUIFollowSuggestion;
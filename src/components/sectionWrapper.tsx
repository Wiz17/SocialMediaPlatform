import React from "react";

interface SectionWrapperProps {
    loading: boolean;
    error: boolean;
    onRetry: () => void;
    children: React.ReactNode;
    loader?: React.ReactNode;
    errorMessage?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
    loading,
    error,
    onRetry,
    children,
    loader,
    errorMessage = "We're facing some technical issues. Please try again.",
}) => {
    if (loading) {
        return <>{loader || <div className="text-gray-400 p-4">Loading...</div>}</>;
    }

    if (error) {
        return (
            <div className="w-full sm:w-2/3 mx-auto text-center py-16">
                <h1 className="text-xl text-red-400 font-semibold">
                    Failed to fetch data.
                </h1>
                <p className="text-base text-gray-500 mt-2 mb-4">
                    Please try again.
                </p>
                <button
                    onClick={onRetry}
                    className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return <>{children}</>;
};

export default SectionWrapper;

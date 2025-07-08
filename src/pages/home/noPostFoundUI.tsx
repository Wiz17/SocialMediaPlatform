const NoPostFoundUI = () => {
  return (
    <>
      <div className="text-center py-8">
        <h1 className="text-white text-4xl font-light mb-4 tracking-wide">
          Follow to see{" "}
          <span className="font-bold text-blue-400 relative">
            feed
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-400 rounded-full"></div>
          </span>
        </h1>
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NoPostFoundUI;

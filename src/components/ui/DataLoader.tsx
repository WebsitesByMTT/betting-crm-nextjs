import React from "react";

const DataLoader = () => {
  return (
    <div className="flex space-x-2 pb-6 justify-center items-center dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="h-5 w-5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.02s]"></div>
      <div className="h-5 w-5 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-5 w-5 bg-gray-600 rounded-full animate-bounce"></div>
    </div>
  );
};

export default DataLoader;

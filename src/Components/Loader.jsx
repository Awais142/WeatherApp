// Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-4 h-4 bg-rose-400 rounded-full animate-ping"></div>
      <div className="w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
      <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
      <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="w-4 h-4 border-r-indigo-400 rounded-full animate-ping"></div>
    </div>
  );
};

export default Loader;

import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Securing your business portal...",
  "Authenticating your identity...",
  "Connecting to secure servers...",
  "Finalizing your digital workspace...",
  "Just a moment, magic is happening...",
];

const Loader = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycles through professional loading messages every 2.5 seconds
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/50 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl">
      {/* Industry-standard spinning ring using Tailwind animate-spin */}
      <div className="w-14 h-14 border-4 border-t-emerald-400 border-r-emerald-400 border-b-slate-700 border-l-slate-700 rounded-full animate-spin"></div>
      
      <p className="mt-6 text-lg text-slate-300 font-medium tracking-tight animate-pulse">
        {loadingMessages[messageIndex]}
      </p>
      
      <div className="mt-2 text-xs text-slate-500 uppercase tracking-[0.2em] font-black">
        Vyapar AI Security
      </div>
    </div>
  );
};

export default Loader;
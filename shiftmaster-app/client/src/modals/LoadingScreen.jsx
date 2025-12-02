import React, { useState, useEffect } from 'react';

function LoadingScreen({ isOpen, statusText, countdown }) {
  const [secondsLeft, setSecondsLeft] = useState(countdown);
  let messages = [
    "Initializing system…", "Connecting to database…", "Starting backend services…",
    "Generating UI layout…", "Processing requests…", "Finalizing setup…"
  ];
  messages = messages.sort(() => Math.random() - 0.5); // Jumble order

  useEffect(() => {
    let timer;
    let msgInterval;
    let currentMsgIndex = 0;

    if (isOpen) {
      setSecondsLeft(countdown);
      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Only cycle messages if a countdown is active (i.e., not a static 'Authenticating session...')
      if (countdown > 0) {
        currentMsgIndex = 0;
        msgInterval = setInterval(() => {
          currentMsgIndex = (currentMsgIndex + 1) % messages.length;
          // statusText here will update based on parent prop, but this component internal state for messages not directly used for prop update.
          // For this particular request, `statusText` is controlled by the parent `App.jsx` based on timer, not internally.
        }, 8000);
      }
    }

    return () => {
      clearInterval(timer);
      clearInterval(msgInterval);
    };
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center text-white transition-opacity duration-500">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold animate-pulse text-center">Accessing Dashboard</h2>
      <p className="text-slate-400 text-sm mt-4 text-center min-h-[20px]">{statusText}</p>
      {countdown > 0 && <p className="text-blue-400 font-mono text-xl mt-2">{secondsLeft}s</p>}

      <div className="absolute bottom-10 text-xs text-slate-500 font-semibold tracking-widest uppercase">
        Powered By <span className="ramware-glow font-bold ml-1 text-sm">RamWare</span>
      </div>
    </div>
  );
}

export default LoadingScreen;
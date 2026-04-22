
import React, { useState, useEffect } from 'react';
import { Event } from '../types';

interface QueueProps {
  event: Event;
  onFinished: () => void;
}

const QueueRoom: React.FC<QueueProps> = ({ event, onFinished }) => {
  // Further reduced initial position for a much faster entry experience (approx 3-5 seconds)
  const INITIAL_POS = 50;
  const [position, setPosition] = useState(INITIAL_POS);

  useEffect(() => {
    const timer = setInterval(() => {
      setPosition((prev) => {
        const next = prev - Math.floor(Math.random() * 8) - 4;
        return next > 0 ? next : 0;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (position === 0) {
      onFinished();
    }
  }, [position, onFinished]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center mt-12 animate-fadeIn">
      <div className="max-w-xl w-full">
        <div className="mb-8">
          <div className="inline-block px-4 py-1 rounded-full border border-rose-500/30 text-rose-500 text-xs font-black uppercase tracking-widest mb-4">
            Direct Access Loading
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2">{event.title}</h1>
          <p className="text-neutral-500">{event.venue} | {event.date}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-10 relative overflow-hidden">
          {/* Animated Wave Background */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <div className="w-64 h-64 border-[20px] border-purple-600 rounded-full animate-ping"></div>
          </div>

          <div className="relative z-10">
             <div className="text-7xl font-black text-white mb-2 tabular-nums">
               {position.toLocaleString()}
             </div>
             <p className="text-neutral-400 uppercase tracking-widest text-[10px] font-black mb-8">Users Ahead of You</p>
             
             <div className="w-full bg-black h-3 rounded-full mb-8 overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-rose-600 to-purple-600 transition-all duration-700 ease-out"
                 style={{ width: `${100 - (position / INITIAL_POS) * 100}%` }}
               ></div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Estimated Wait</p>
                 <p className="text-lg font-black text-rose-500">Less than 1 Min</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-neutral-500 text-[10px] uppercase font-bold mb-1">System Status</p>
                 <p className="text-lg font-bold text-emerald-500 flex items-center justify-center gap-2">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   Optimized
                 </p>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-neutral-400">
            Hold tight! We are preparing the seating chart for you. <br/>Redirecting in just a few seconds...
          </p>
          <div className="flex justify-center gap-2">
             <span className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
             <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
             <span className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueRoom;

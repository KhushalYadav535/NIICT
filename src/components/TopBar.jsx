import React from 'react';

const TopBar = () => {
  return (
    <>
      {/* SDEI-style Top Strip with gradient background */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end items-center gap-6 text-white text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Email :</span>
              <span>niict01@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Phone :</span>
              <span>+91 8182838680</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrolling Disclaimer Marquee */}
      <div className="bg-amber-50 border-b border-amber-200 py-1">
        <marquee direction="left" scrollamount="6" onMouseOver={e => e.target.stop()} onMouseOut={e => e.target.start()} className="text-xs text-amber-800">
          <span className="font-semibold">Disclaimer!</span> Our organization does not claim that certificates are applicable for any type of government job. Because only certificates according to recruitment advertisements are valid for government jobs.
        </marquee>
      </div>
    </>
  );
};

export default TopBar;

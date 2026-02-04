'use client';

import React, { useState, useRef } from 'react';

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const pullThreshold = 80; 

  const handleTouchStart = (e: React.TouchEvent) => {
    
    if (window.scrollY === 0 && !isRefreshing) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing || window.scrollY > 0) return;

    const currentY = e.touches[0].pageY;
    const distance = (currentY - startY.current) * 0.4; 

    if (distance > 0) {
      
      setPullDistance(Math.min(distance, 120)); 
    }
  };

  const handleTouchEnd = () => {
    if (isRefreshing) return;

    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true);
      setPullDistance(60); 

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ICON LOADING: Warna Gelap #2e385b sesuai palet */}
      <div 
        className="fixed left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center transition-all duration-200"
        style={{ 
          top: `${pullDistance - 50}px`, 
          opacity: pullDistance > 20 ? 1 : 0,
        }}
      >
        <div className={`bg-white shadow-xl rounded-full p-3 border border-gray-100 ${isRefreshing ? 'animate-spin' : ''}`}>
          <svg 
            className="w-6 h-6 text-[#2e385b]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ transform: !isRefreshing ? `rotate(${pullDistance * 4}deg)` : 'none' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      {/* Konten Utama */}
      <div 
        className="relative z-10 transition-transform duration-200"
        style={{ 
          transform: pullDistance > 0 ? `translateY(${pullDistance * 0.5}px)` : 'none' 
        }}
      >
        {children}
      </div>
    </div>
  );
}
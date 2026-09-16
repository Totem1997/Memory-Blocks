import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PortraitLock: React.FC = () => {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

  useEffect(() => {
    // Check if the device is a mobile device in landscape mode
    const checkOrientation = () => {
      // Coarse pointer indicates a touch device (mobile/tablet)
      const isTouch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      
      // We only want to block mobile/touch devices in landscape, 
      // not desktop computers which are naturally landscape.
      setIsLandscapeMobile(isTouch && isLandscape && window.innerHeight < 600);
    };

    // Check on mount
    checkOrientation();

    // Listen for resize/orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLandscapeMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#1D1D1F] flex items-center justify-center text-white px-6 md:px-12 w-full h-full select-none"
        >
          <div className="flex flex-row items-center justify-center max-w-3xl gap-8 md:gap-12 w-full">
            {/* Left side: Icon */}
            <motion.div
              animate={{ rotate: -90 }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut",
                repeatType: "reverse"
              }}
              className="flex-shrink-0"
            >
              <Smartphone className="w-24 h-24 text-white" strokeWidth={1.5} />
            </motion.div>

            {/* Right side: Text */}
            <div className="flex flex-col text-left">
              <h2 className="text-2xl font-bold font-display mb-3">Please Rotate Your Phone</h2>
              <p className="text-[#86868B] max-w-[320px] leading-relaxed text-sm mb-4">
                This game is designed for vertical portrait mode. Please rotate your device back to continue.
              </p>
              <div className="bg-[#2D2D2F] p-4 rounded-xl max-w-[320px] border border-[#3D3D3F]">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="font-bold text-white mr-1">💡 Tip:</span> 
                  To prevent accidental screen flips while playing, we highly recommend turning off your phone's auto-rotate feature!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

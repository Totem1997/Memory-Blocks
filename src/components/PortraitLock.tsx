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
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      
      // We only want to block mobile/touch devices in landscape, 
      // not desktop computers which are naturally landscape.
      // We also bypass this check if the app is installed (standalone) since the OS handles the orientation lock.
      setIsLandscapeMobile(isTouch && isLandscape && window.innerHeight < 600 && !isStandalone);
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
          className="fixed inset-0 z-[9999] bg-[#1D1D1F] flex flex-col items-center justify-center text-white px-6 text-center select-none"
        >
          <motion.div
            animate={{ rotate: -90 }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut",
              repeatType: "reverse"
            }}
            className="mb-8"
          >
            <Smartphone className="w-20 h-20 text-white" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-2xl font-bold font-display mb-4">Please Rotate Your Phone</h2>
          <p className="text-[#86868B] max-w-[280px] leading-relaxed text-base mb-6">
            This game is designed to be played in vertical portrait mode. Please rotate your device back to continue playing.
          </p>
          <div className="bg-[#2D2D2F] p-4 rounded-xl max-w-[300px]">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-bold text-white mr-1">💡 Tip:</span> 
              For the best experience, add this game to your home screen from the main menu to lock the screen automatically!
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

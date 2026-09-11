import React from 'react';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';

interface GiftScreenProps {
  onOpen: () => void;
}

export const GiftScreen: React.FC<GiftScreenProps> = ({ onOpen }) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 max-w-md mx-auto select-none text-center bg-[#F5F5F7] cursor-pointer"
      onClick={onOpen}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center w-full"
      >
        <div className="w-full max-w-[320px] mb-8 mt-12 h-24 relative overflow-visible">
          <svg viewBox="0 0 320 100" className="w-full h-full overflow-visible">
            <path id="curve" d="M 20,90 Q 160,20 300,90" fill="transparent" />
            <text className="text-[17px] font-bold tracking-[0.1em] fill-[#1D1D1F] uppercase font-display" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                A GIFT IS WAITING FOR YOU
              </textPath>
            </text>
          </svg>
        </div>

        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative mb-16 text-[#E11D48]"
        >
          {/* Subtle glow behind the gift */}
          <div className="absolute inset-0 bg-[#E11D48]/20 blur-xl rounded-full scale-150 animate-pulse" />
          <Gift className="w-24 h-24 relative z-10" strokeWidth={1.5} />
        </motion.div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-semibold tracking-wider text-[#86868B] uppercase font-display"
        >
          Click to open!
        </motion.p>
      </motion.div>
    </div>
  );
};

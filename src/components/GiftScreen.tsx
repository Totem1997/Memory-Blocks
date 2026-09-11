import React from 'react';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';

interface GiftScreenProps {
  onOpen: () => void;
}

export const GiftScreen: React.FC<GiftScreenProps> = ({ onOpen }) => {
  return (
    <div
      className="flex flex-col items-center pt-32 min-h-screen px-6 max-w-md mx-auto select-none text-center bg-[#F5F5F7]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center w-full"
      >
        <div className="w-full max-w-[380px] mb-12 h-32 relative overflow-visible">
          <svg viewBox="0 0 380 120" className="w-full h-full overflow-visible">
            <path id="curve" d="M 10,110 Q 190,10 370,110" fill="transparent" />
            <text className="text-[23px] font-extrabold tracking-[0.08em] fill-[#1D1D1F] uppercase font-display" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                A GIFT IS WAITING FOR YOU
              </textPath>
            </text>
          </svg>
        </div>

        <motion.div
          onClick={onOpen}
          animate={{ 
            y: [-10, 10, -10],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative mb-16 text-[#E11D48] cursor-pointer p-8 rounded-full"
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

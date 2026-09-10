import React from 'react';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';

interface GiftScreenProps {
  onOpen: () => void;
}

export const GiftScreen: React.FC<GiftScreenProps> = ({ onOpen }) => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 max-w-md mx-auto select-none text-center bg-[#FAF7F2] cursor-pointer"
      onClick={onOpen}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center w-full"
      >
        <h1 className="text-xl font-bold tracking-widest text-[#2D2A26] uppercase font-display mb-16 text-center">
          A GIFT IS WAITING FOR YOU
        </h1>

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
          className="text-sm font-semibold tracking-wider text-[#8C7A6B] uppercase font-display"
        >
          Click the gift to open!
        </motion.p>
      </motion.div>
    </div>
  );
};

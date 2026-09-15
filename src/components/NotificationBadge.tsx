import React from 'react';
import { motion } from 'motion/react';

export const NotificationBadge: React.FC = () => {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border-[1.5px] border-white z-10 font-sans pointer-events-none"
    >
      1
    </motion.div>
  );
};

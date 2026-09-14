import React from 'react';
import { motion } from 'motion/react';
import { Gift } from 'lucide-react';

interface GiftScreenProps {
  onOpen: () => void;
}

export const GiftScreen: React.FC<GiftScreenProps> = ({ onOpen }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-10 max-w-md mx-auto select-none text-center bg-[#F5F5F7]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center w-full my-auto"
      >
        <div className="w-full max-w-[380px] mb-6 h-28 relative overflow-visible">
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
          className="relative mb-10 cursor-pointer p-3 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          {/* Subtle warm glow behind the gift */}
          <div className="absolute inset-0 bg-[#E11D48]/15 blur-2xl rounded-full scale-125 animate-pulse pointer-events-none" />
          
          {!imgError ? (
            <img
              src="/gift_box.png"
              alt="Gift Box"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-48 h-48 object-contain relative z-10 drop-shadow-xl select-none pointer-events-none"
            />
          ) : (
            <Gift className="w-24 h-24 relative z-10 text-[#E11D48]" strokeWidth={1.5} />
          )}
        </motion.div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-semibold tracking-wider text-[#86868B] uppercase font-display"
        >
          Tap to open!
        </motion.p>
      </motion.div>
    </div>
  );
};

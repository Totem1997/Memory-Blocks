import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { WhiteGridOverlay } from './WhiteGridOverlay';

interface LoadingScreenProps {
  photoSrc: string;
  onFinished: () => void;
}

const STEPS = [
  'Setting up your memory...',
  'Building your game...',
  'Almost ready...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  photoSrc,
  onFinished,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 750);
    const timer2 = setTimeout(() => setStepIndex(2), 1500);
    const timer3 = setTimeout(() => onFinished(), 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinished]);

  return (
    <div
      id="loading-screen"
      className="flex flex-col items-center justify-center min-h-screen px-6 max-w-md mx-auto select-none text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* Animated preview container showing photo with block grid appearing */}
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white mb-8 bg-[#F3ECE4]">
          <img
            src={photoSrc}
            alt="Your memory"
            className="w-full h-full object-cover"
            style={{
              filter: 'contrast(0.86) brightness(0.97) saturate(0.88)',
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-multiply" />

          {/* White Grid overlay */}
          <WhiteGridOverlay className="opacity-95" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="p-3 rounded-full bg-white/80 shadow-md backdrop-blur-xs text-[#2D2A26]"
            >
              <Sparkles className="w-6 h-6 text-[#F59E0B]" />
            </motion.div>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#2D2A26] font-display mb-2">
          Creating your fun experience...
        </h2>

        {/* Step-by-step changing subtext */}
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-medium text-[#8C7A6B]"
            >
              {STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Subtle progress indicator */}
        <div className="w-44 h-1.5 bg-[#EAE1D7] rounded-full mt-6 overflow-hidden">
          <motion.div
            initial={{ width: '10%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.1, ease: 'easeInOut' }}
            className="h-full bg-[#2D2A26] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

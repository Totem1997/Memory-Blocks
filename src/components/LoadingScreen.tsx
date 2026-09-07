import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  photoSrc: string;
  onFinished: () => void;
  isReturningPlayer?: boolean;
}

const NEW_PLAYER_STEPS = [
  'Making the surprise awesome for you!',
  'Transforming your memory...',
  'Adding a fun little twist...',
  'Almost there...',
];

const RETURNING_PLAYER_STEPS = [
  'Framing your new memory...',
  'Preparing the board...',
  'Putting the pieces in place...',
  'Almost ready...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onFinished,
  isReturningPlayer = false,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = isReturningPlayer ? RETURNING_PLAYER_STEPS : NEW_PLAYER_STEPS;

  useEffect(() => {
    // Spread across 8 seconds to build anticipation
    const timer1 = setTimeout(() => setStepIndex(1), 2200);
    const timer2 = setTimeout(() => setStepIndex(2), 4600);
    const timer3 = setTimeout(() => setStepIndex(3), 6600);
    const timer4 = setTimeout(() => onFinished(), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinished]);

  return (
    <div
      id="loading-screen"
      className="flex flex-col items-center justify-center min-h-screen px-6 max-w-md mx-auto select-none text-center bg-transparent"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full"
      >
        {/* Cinematic cycling main headline */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={stepIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-extrabold text-[#2D2A26] font-display text-center"
            >
              {steps[stepIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Subtle progress indicator */}
        <div className="w-48 h-1.5 bg-[#EAE1D7] rounded-full mt-10 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, ease: 'linear' }}
            className="h-full bg-[#2D2A26] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

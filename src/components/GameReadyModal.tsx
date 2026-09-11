import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, ArrowRight } from 'lucide-react';

interface GameReadyModalProps {
  onClose: () => void;
}

export const GameReadyModal: React.FC<GameReadyModalProps> = ({ onClose }) => {
  useEffect(() => {
    // Fire confetti when the modal mounts
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-[#F5F5F7] rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-[#F43F5E]/10 rounded-full flex items-center justify-center mb-6 text-[#F43F5E]">
            <Gift className="w-8 h-8" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-black text-[#1D1D1F] font-display mb-4">
            Everything is set!
          </h2>
          
          <div className="space-y-4 text-[#515154] text-base leading-relaxed mb-8">
            <p>
              Your favorite memory turned into a fun puzzle game! Place the blocks to clear lines and see how high you can score.
            </p>
            <p>
              Every time you return to play, you'll unlock a special new inspirational reward. Ready to jump in?
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-[#1D1D1F] hover:bg-[#000000] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
          >
            <span>PLAY NOW</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

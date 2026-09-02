import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, X } from 'lucide-react';
import { AudienceType, RewardItem } from '../types';

interface RewardModalProps {
  isOpen: boolean;
  reward: RewardItem | null;
  audience: AudienceType;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  reward,
  audience,
  onClose,
}) => {
  if (!isOpen || !reward) return null;

  const isChild = audience === 'child';
  const heading = 'Welcome Back!';

  return (
    <AnimatePresence>
      <div
        id="reward-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-xs select-none"
      >
        <motion.div
          id="reward-modal"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm p-6 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] text-center overflow-hidden"
        >
          {/* Close icon in top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F0E6D8] text-[#8C7A6B] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative gift/sparkle icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F4E9D8] flex items-center justify-center text-[#2D2A26] shadow-sm">
            {isChild ? (
              <Sparkles className="w-8 h-8 text-[#F59E0B]" />
            ) : (
              <Gift className="w-8 h-8 text-[#E11D48]" />
            )}
          </div>

          <h3 className="text-2xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-4">
            {heading}
          </h3>

          {/* Clean reading card */}
          <div className="p-4 rounded-2xl bg-white/80 border border-[#EAE1D7] text-[#4A423A] text-lg leading-relaxed font-medium mb-6 shadow-xs">
            &ldquo;{reward.content}&rdquo;
          </div>

          {/* KEEP PLAYING button (Section 24 specification) */}
          <button
            id="btn-reward-keep-playing"
            onClick={onClose}
            className="w-full py-3.5 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all font-display uppercase tracking-wide cursor-pointer"
          >
            CONTINUE PLAYING
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

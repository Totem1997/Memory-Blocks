import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  bestScore,
  isNewBest,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="game-over-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-xs select-none"
      >
        <motion.div
          id="game-over-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-xs p-6 bg-[#F5F5F7] rounded-3xl shadow-2xl border border-[#E5E5EA] text-center"
        >
          <div className="text-sm font-semibold tracking-wider text-[#86868B] uppercase font-display mb-1">
            No More Moves
          </div>

          <h3 className="text-3xl font-extrabold text-[#1D1D1F] font-display tracking-tight mb-4">
            Game Over
          </h3>

          {/* Score card */}
          <div className="p-4 rounded-2xl bg-white/90 border border-[#EAE1D7] shadow-xs mb-6 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                Final Score
              </div>
              <div className="text-3xl font-black text-[#1D1D1F] font-display">
                {score.toLocaleString()}
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0E6D8] flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-[#F43F5E]" />
              <span className="text-xs font-semibold text-[#86868B]">Best:</span>
              <span className="text-sm font-bold text-[#F43F5E] font-display">
                {bestScore.toLocaleString()}
              </span>
              {isNewBest && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#F43F5E] text-white text-[10px] font-extrabold">
                  NEW!
                </span>
              )}
            </div>
          </div>

          {/* PLAY AGAIN button */}
          <button
            id="btn-game-over-play-again"
            onClick={onPlayAgain}
            className="w-full py-4 px-6 bg-[#1D1D1F] hover:bg-[#000000] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-[#FDE047]" />
            <span>PLAY AGAIN</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

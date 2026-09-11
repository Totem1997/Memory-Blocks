import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, RotateCcw, Share } from 'lucide-react';
import { toPng } from 'html-to-image';

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
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!scoreCardRef.current || isSharing) return;
    
    try {
      setIsSharing(true);
      // Brief pause to ensure fonts are rendered if first load
      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await toPng(scoreCardRef.current, {
        quality: 1,
        pixelRatio: 2, // High resolution
        skipFonts: true, // Prevent CORS issues with remote Google Fonts
        style: {
          margin: '0',
        },
      });

      // Convert data URL to Blob and then to File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'memory-blocks-score.png', { type: 'image/png' });

      // Check if native sharing supports files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Memory Blocks Score',
          text: `I just scored ${score.toLocaleString()} in Memory Blocks! Can you beat my score?`,
          files: [file],
        });
      } else {
        // Fallback: trigger image download
        const link = document.createElement('a');
        link.download = 'memory-blocks-score.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to share score image', err);
    } finally {
      setIsSharing(false);
    }
  };

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

          {/* Score card - This is what gets captured in the screenshot */}
          <div 
            ref={scoreCardRef}
            className="p-6 rounded-2xl bg-white border border-[#EAE1D7] shadow-sm mb-6 flex flex-col items-center justify-center"
          >
            {/* Top Logo */}
            <div className="text-[15px] sm:text-base font-black uppercase tracking-[0.2em] font-display mb-3 flex items-center">
              <span className="text-[#3B82F6]">M</span>
              <span className="text-[#EF4444]">E</span>
              <span className="text-[#10B981]">M</span>
              <span className="text-[#F59E0B]">O</span>
              <span className="text-[#8B5CF6]">R</span>
              <span className="text-[#EC4899]">Y</span>
              <span className="w-2"></span>
              <span className="text-[#6366F1]">B</span>
              <span className="text-[#14B8A6]">L</span>
              <span className="text-[#F97316]">O</span>
              <span className="text-[#0EA5E9]">C</span>
              <span className="text-[#F43F5E]">K</span>
              <span className="text-[#84CC16]">S</span>
            </div>

            {/* Score Number */}
            <div className="text-6xl font-black text-[#1D1D1F] font-display leading-none tracking-tight mb-4 mt-1">
              {score.toLocaleString()}
            </div>

            {/* Bottom Label */}
            <div className="pt-4 border-t border-[#F0E6D8] w-full flex items-center justify-center">
              {isNewBest ? (
                <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-bold uppercase tracking-widest">
                  <Crown className="w-4 h-4 mb-0.5" />
                  <span>New High Score!</span>
                </div>
              ) : (
                <div className="text-xs font-bold uppercase tracking-widest text-[#86868B]">
                  Final Score
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full py-4 px-6 bg-[#3B82F6] hover:bg-[#2563EB] active:scale-[0.98] disabled:opacity-70 text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
            >
              {isSharing ? (
                <span className="animate-pulse">Capturing...</span>
              ) : (
                <>
                  <Share className="w-5 h-5" />
                  <span>SHARE SCORE</span>
                </>
              )}
            </button>

            <button
              id="btn-game-over-play-again"
              onClick={onPlayAgain}
              className="w-full py-4 px-6 bg-[#1D1D1F] hover:bg-[#000000] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-[#FDE047]" />
              <span>CONTINUE PLAYING</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

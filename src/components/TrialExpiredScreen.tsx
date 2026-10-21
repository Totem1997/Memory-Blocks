import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Share, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getTrialScore, resetTrialForTesting } from '../utils/config';

interface TrialExpiredScreenProps {
  onResetTrial: () => void;
}

export const TrialExpiredScreen: React.FC<TrialExpiredScreenProps> = ({ onResetTrial }) => {
  const trialScore = getTrialScore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;

    try {
      setIsSharing(true);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          margin: '0',
        },
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'memory-blocks-trial-score.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Memory Blocks Trial Score',
          text: `I scored ${trialScore?.toLocaleString() || '0'} in my Memory Blocks trial run!`,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.download = 'memory-blocks-trial-score.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to share trial score image', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleReset = () => {
    resetTrialForTesting();
    onResetTrial();
  };

  return (
    <div
      id="trial-expired-screen"
      className="flex flex-col items-center justify-center min-h-[100dvh] px-5 py-8 max-w-md mx-auto select-none text-center bg-[#F5F5F7]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full my-auto flex flex-col items-center"
      >
        {/* Top Logo */}
        <div className="text-[17px] sm:text-lg font-black uppercase tracking-[0.22em] font-display mb-6 flex items-center justify-center">
          <span className="text-[#3B82F6]">M</span>
          <span className="text-[#EF4444]">E</span>
          <span className="text-[#10B981]">M</span>
          <span className="text-[#F59E0B]">O</span>
          <span className="text-[#8B5CF6]">R</span>
          <span className="text-[#EC4899]">Y</span>
          <span className="w-2.5"></span>
          <span className="text-[#6366F1]">B</span>
          <span className="text-[#14B8A6]">L</span>
          <span className="text-[#F97316]">O</span>
          <span className="text-[#0EA5E9]">C</span>
          <span className="text-[#F43F5E]">K</span>
          <span className="text-[#84CC16]">S</span>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#E5E5EA] mb-6 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-[#86868B] text-xs font-bold uppercase tracking-wider font-display mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>1-Session Trial Completed</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#1D1D1F] font-display tracking-tight mb-2">
            Trial Expired
          </h2>

          <p className="text-[#6E6E73] text-sm leading-relaxed mb-6 max-w-xs mx-auto">
            Thank you for trying Memory Blocks! You have completed your free trial play session.
          </p>

          {/* Trial Score Showcase if available */}
          {trialScore !== null && (
            <div className="w-full bg-[#F5F5F7] rounded-2xl p-4 border border-[#EAE1D7] mb-6 flex flex-col items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#86868B] font-display mb-1">
                Your Trial Score
              </span>
              <span className="text-5xl font-black text-[#1D1D1F] font-display leading-none tracking-tight">
                {trialScore.toLocaleString()}
              </span>
            </div>
          )}

          {/* Highlight feature callout */}
          <div className="w-full bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 text-left flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#166534] leading-relaxed">
              <p className="font-bold text-[#14532D] mb-0.5">Want to gift this experience?</p>
              Give a gift they'll actually play! Imagine their reaction when it's made from their favorite photos! Order the greeting card so they can pick their own favorite memory and play.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 max-w-xs">
          {trialScore !== null && (
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full py-3.5 px-6 bg-[#3B82F6] hover:bg-[#2563EB] active:scale-[0.98] disabled:opacity-70 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
            >
              {isSharing ? (
                <span className="animate-pulse">Capturing...</span>
              ) : (
                <>
                  <Share className="w-4 h-4" />
                  <span>SHARE TRIAL SCORE</span>
                </>
              )}
            </button>
          )}

          {/* Reset button for testing / repeat demonstration */}
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 bg-transparent hover:bg-black/5 active:scale-[0.98] text-[#86868B] hover:text-[#1D1D1F] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Trial Session (Testing)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

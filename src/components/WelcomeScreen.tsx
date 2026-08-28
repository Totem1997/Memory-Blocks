import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ThemeConfig } from '../types';

interface WelcomeScreenProps {
  themeConfig: ThemeConfig;
  hasSavedPhoto: boolean;
  onStart: () => void;
  onResume: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  themeConfig,
  hasSavedPhoto,
  onStart,
  onResume,
}) => {
  return (
    <div
      id="welcome-screen"
      className="relative flex flex-col items-center justify-between min-h-screen px-6 py-12 max-w-md mx-auto overflow-hidden text-center select-none"
    >
      {/* Subtle decorative dot grids in corners inspired by reference */}
      <div className="absolute top-4 right-4 grid grid-cols-4 gap-2 opacity-35 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E5D5C5]" />
        ))}
      </div>
      <div className="absolute bottom-6 left-4 grid grid-cols-4 gap-2 opacity-35 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E5D5C5]" />
        ))}
      </div>

      {/* Top spacer */}
      <div className="pt-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE4] text-[#8C7A6B] text-xs font-semibold tracking-wider uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E68A5C]" />
          <span>A Playable Gift</span>
        </motion.div>
      </div>

      {/* Main message card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="w-full my-auto py-8"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2D2A26] tracking-tight font-display leading-[1.2] mb-6">
          {themeConfig.welcomeHeadline}
        </h1>

        <div className="space-y-3 max-w-[320px] mx-auto text-[#6D655E] text-base leading-relaxed">
          <p className="font-medium">{themeConfig.welcomeSubtext}</p>
          <p className="text-sm font-semibold text-[#8C7A6B] pt-2">
            Ready to see what&apos;s waiting for you?
          </p>
        </div>

        {/* Playful preview icon cluster */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <div className="w-8 h-8 rounded-lg shadow-sm bg-gradient-to-br from-[#C084FC] to-[#9333EA] block-tile" />
          <div className="w-8 h-8 rounded-lg shadow-sm bg-gradient-to-br from-[#FDE047] to-[#F59E0B] block-tile" />
          <div className="w-8 h-8 rounded-lg shadow-sm bg-gradient-to-br from-[#FCA5A5] to-[#EF4444] block-tile" />
          <div className="w-8 h-8 rounded-lg shadow-sm bg-gradient-to-br from-[#7DD3FC] to-[#0284C7] block-tile" />
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="w-full space-y-3 pb-4"
      >
        <button
          id="btn-welcome-lets-go"
          onClick={onStart}
          className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display tracking-wide cursor-pointer"
        >
          <span>LET&apos;S GO</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {hasSavedPhoto && (
          <button
            id="btn-welcome-resume"
            onClick={onResume}
            className="w-full py-3 px-6 bg-[#F3ECE4] hover:bg-[#EAE1D7] active:scale-[0.98] text-[#5C534B] font-semibold text-sm rounded-xl transition-all font-display tracking-wide cursor-pointer"
          >
            Resume Saved Memory
          </button>
        )}
      </motion.div>
    </div>
  );
};

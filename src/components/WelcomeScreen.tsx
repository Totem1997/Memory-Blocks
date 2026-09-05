import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ThemeConfig } from '../types';

interface WelcomeScreenProps {
  themeConfig: ThemeConfig;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  themeConfig,
  onStart,
}) => {
  return (
    <div
      id="welcome-screen"
      className="relative flex flex-col justify-center min-h-screen px-6 py-12 max-w-md mx-auto bg-transparent select-none overflow-hidden text-center"
    >
      {/* Main message card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center w-full my-auto"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2D2A26] font-display tracking-tight leading-[1.1] mb-6">
          {themeConfig.welcomeHeadline}
        </h1>

        <div className="space-y-4 max-w-[280px] mx-auto text-[#6D655E] text-lg leading-relaxed">
          <p className="font-medium">{themeConfig.welcomeSubtext}</p>
          <p className="text-[#8C7A6B] text-sm font-semibold tracking-wide uppercase mt-8 pb-8">
            Ready to see what&apos;s waiting for you?
          </p>
        </div>

        {/* Primary Action */}
        <button
          id="btn-welcome-lets-go"
          onClick={onStart}
          className="w-full max-w-[280px] py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
        >
          <span>LET&apos;S GO</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

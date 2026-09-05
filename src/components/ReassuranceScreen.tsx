import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ReassuranceScreenProps {
  onContinue: () => void;
}

export const ReassuranceScreen: React.FC<ReassuranceScreenProps> = ({
  onContinue,
}) => {
  return (
    <div
      id="reassurance-screen"
      className="relative flex flex-col justify-center min-h-screen px-6 py-8 max-w-md mx-auto select-none bg-transparent"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E5F5E0] flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[#059669]" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-4">
          Great choice!
        </h1>
        
        <p className="text-[#6D655E] text-lg max-w-xs mx-auto mb-10 leading-relaxed">
          Just so you know, you can always change this picture later if you want.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

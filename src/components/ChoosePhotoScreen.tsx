import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { ThemeConfig } from '../types';

interface ChoosePhotoScreenProps {
  themeConfig: ThemeConfig;
  onPhotoSelected: (dataUrl: string) => void;
  onBack: () => void;
}

export const ChoosePhotoScreen: React.FC<ChoosePhotoScreenProps> = ({
  themeConfig,
  onPhotoSelected,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onPhotoSelected(result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Could not read this photo. Please try another one.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      id="choose-photo-screen"
      className="relative flex flex-col min-h-screen px-6 py-8 max-w-md mx-auto select-none bg-transparent"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top navigation */}
      <div className="flex items-center justify-between w-full pt-2 mb-8">
        <button
          id="btn-choose-photo-back"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/50 text-[#515154] transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col justify-start pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-[#1D1D1F] font-display tracking-tight mb-6">
              Choose your favorite memory
            </h1>
            <p className="text-[#515154] text-lg max-w-sm mx-auto mb-10 leading-relaxed">
              Take a moment to find a memory that always makes you smile. It can be a photo together with the person who gifted you this, your favorite cute pet photo, or any photo that really inspires you. If you have it saved on your device, we can turn it into something fun.
            </p>

            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-6 bg-[#1D1D1F] hover:bg-[#000000] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
              >
                <ImageIcon className="w-5 h-5 text-[#FDE047]" />
                <span>CHOOSE A PHOTO</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

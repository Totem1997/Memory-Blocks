import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, ArrowLeft, ArrowRight, Upload } from 'lucide-react';

interface ChoosePhotoScreenProps {
  onPhotoSelected: (dataUrl: string) => void;
  onBack: () => void;
}

export const ChoosePhotoScreen: React.FC<ChoosePhotoScreenProps> = ({
  onPhotoSelected,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
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
      className="relative flex flex-col min-h-screen px-6 py-8 max-w-md mx-auto select-none bg-[#F4EFE6]"
    >
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileChange}
      />
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
          onClick={() => {
            if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
            else onBack();
          }}
          className="p-2 -ml-2 rounded-full hover:bg-white/50 text-[#6D655E] transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-[#8C7A6B] uppercase font-display">
          Step {step} of 3
        </span>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-4">
                What is your favorite memory together?
              </h1>
              <p className="text-[#6D655E] text-base max-w-xs mx-auto mb-10 leading-relaxed">
                Take a moment to think of a time with them that always makes you smile. If you have a photo of that memory saved, we will turn it into something special.
              </p>

              {errorMsg && (
                <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-[#FDE047]" />
                  <span>I HAVE A PHOTO</span>
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 px-4 text-[#8C7A6B] hover:text-[#5C534B] font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span className="underline underline-offset-4 decoration-[#E5DACE]">I don't have one handy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-4">
                That&apos;s perfectly okay.
              </h1>
              <p className="text-[#6D655E] text-base max-w-xs mx-auto mb-10 leading-relaxed">
                The best time to capture a beautiful moment is right now. If they are with you, let&apos;s take a new photo together and let the magic begin.
              </p>

              {errorMsg && (
                <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-[#7DD3FC]" />
                  <span>TAKE A SELFIE</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-3 px-4 text-[#8C7A6B] hover:text-[#5C534B] font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span className="underline underline-offset-4 decoration-[#E5DACE]">They aren't here right now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-2xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-4 leading-tight">
                You&apos;re the star of this surprise!
              </h1>
              <p className="text-[#6D655E] text-base max-w-xs mx-auto mb-10 leading-relaxed">
                Since this experience was made especially for you, a photo of yourself is absolutely perfect. Let&apos;s capture one right now and let the magic unfold.
              </p>

              {errorMsg && (
                <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-[#FDE047]" />
                  <span>TAKE A SELFIE</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 bg-white hover:bg-white/70 active:scale-[0.98] text-[#2D2A26] font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-3 font-display tracking-wide border border-[#E5DACE] shadow-sm cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-[#8C7A6B]" />
                  <span>CHOOSE A PHOTO</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

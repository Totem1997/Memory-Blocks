import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Image as ImageIcon, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { SAMPLE_PHOTOS, SamplePhoto } from '../data/samplePhotos';

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
  const [isLoadingSample, setIsLoadingSample] = useState(false);
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

  const handleSelectSample = async (sample: SamplePhoto) => {
    setIsLoadingSample(true);
    setErrorMsg(null);
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsLoadingSample(false);
        if (reader.result) {
          onPhotoSelected(reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback: direct URL
      setIsLoadingSample(false);
      onPhotoSelected(sample.url);
    }
  };

  return (
    <div
      id="choose-photo-screen"
      className="relative flex flex-col justify-between min-h-screen px-6 py-8 max-w-md mx-auto select-none"
    >
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
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
      <div className="flex items-center justify-between w-full pt-2">
        <button
          id="btn-choose-photo-back"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#F3ECE4] text-[#6D655E] transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-[#8C7A6B] uppercase font-display">
          Step 1 of 2
        </span>
        <div className="w-8" />
      </div>

      {/* Main Header */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center my-auto py-6"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F5EDE3] flex items-center justify-center text-[#2D2A26] shadow-sm">
          <ImageIcon className="w-8 h-8 text-[#8C7A6B]" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-2">
          Choose Your Memory
        </h1>
        <p className="text-[#6D655E] text-base max-w-xs mx-auto">
          Pick a favorite photo to turn into your game.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-3 mt-8">
          <button
            id="btn-take-photo"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
          >
            <Camera className="w-5 h-5 text-[#FDE047]" />
            <span>TAKE A PHOTO</span>
          </button>

          <button
            id="btn-choose-from-photos"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-6 bg-[#F3ECE4] hover:bg-[#EAE1D7] active:scale-[0.98] text-[#2D2A26] font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-3 font-display tracking-wide border border-[#E5DACE] cursor-pointer"
          >
            <ImageIcon className="w-5 h-5 text-[#8C7A6B]" />
            <span>CHOOSE FROM PHOTOS</span>
          </button>
        </div>

        {/* Instant Sample Memories */}
        <div className="mt-10 pt-6 border-t border-[#EAE1D7]">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E68A5C]" />
            <span>Or try with a sample memory</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {SAMPLE_PHOTOS.map((sample) => (
              <button
                key={sample.id}
                id={`btn-sample-${sample.id}`}
                disabled={isLoadingSample}
                onClick={() => handleSelectSample(sample)}
                className="group relative flex flex-col items-center rounded-xl overflow-hidden p-1 bg-white border border-[#E8DFC8] hover:border-[#2D2A26] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-1">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-medium text-[#6D655E] truncate w-full text-center">
                  {sample.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Privacy Guarantee Footer (Section 35) */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F5EDE3]/70 text-[#8C7A6B] text-xs font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
        <span>Your photo stays on this device. It is never uploaded to any server.</span>
      </div>
    </div>
  );
};

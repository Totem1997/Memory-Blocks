import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Image as ImageIcon, Volume2, VolumeX, X } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onChangeMemory: () => void;
  onClose: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onChangeMemory,
  onClose,
}) => {
  const [sound, setSound] = React.useState(isSoundEnabled());

  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };

  return (
    <AnimatePresence>
      <div
        id="pause-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-xs select-none"
      >
        <motion.div
          id="pause-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xs p-6 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F0E6D8] text-[#8C7A6B] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-extrabold text-[#2D2A26] font-display tracking-tight mb-6">
            Game Paused
          </h3>

          <div className="space-y-2.5">
            {/* Resume button */}
            <button
              id="btn-pause-resume"
              onClick={onResume}
              className="w-full py-3.5 px-4 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume</span>
            </button>

            {/* Restart button */}
            <button
              id="btn-pause-restart"
              onClick={onRestart}
              className="w-full py-3.5 px-4 bg-[#F3ECE4] hover:bg-[#EAE1D7] active:scale-[0.98] text-[#2D2A26] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 font-display border border-[#E5DACE] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#8C7A6B]" />
              <span>Restart Run</span>
            </button>

            {/* Change memory button */}
            <button
              id="btn-pause-change-memory"
              onClick={onChangeMemory}
              className="w-full py-3 px-4 bg-[#F3ECE4] hover:bg-[#EAE1D7] active:scale-[0.98] text-[#5C534B] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#8C7A6B]" />
              <span>Change Photo Memory</span>
            </button>

            {/* Sound Toggle */}
            <div className="pt-2">
              <button
                id="btn-pause-toggle-sound"
                onClick={toggleSound}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#8C7A6B] hover:bg-[#F3ECE4] transition-colors cursor-pointer"
              >
                {sound ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Sound: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Sound: OFF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

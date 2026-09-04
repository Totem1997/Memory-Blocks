import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Settings, Image as ImageIcon, Trash2, X, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';
import { ThemeConfig } from '../types';

interface HomeScreenProps {
  themeConfig: ThemeConfig;
  onPlay: () => void;
  onChangePhoto: () => void;
  onClearGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  themeConfig,
  onPlay, 
  onChangePhoto,
  onClearGame
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'other'>('main');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearGame = () => {
    onClearGame();
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
    // Reset view after animation finishes
    setTimeout(() => setSettingsView('main'), 300);
  };

  return (
    <div
      id="home-screen"
      className="relative flex flex-col justify-center min-h-screen px-6 py-12 max-w-md mx-auto bg-[#F4EFE6] select-none"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center my-auto w-full"
      >
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-[#E8DFC8] flex items-center justify-center mb-8">
          <Play className="w-10 h-10 text-[#E68A5C] fill-[#E68A5C]/20 ml-1" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-[#2D2A26] font-display tracking-tight leading-tight mb-3">
          Your Memory <br/>Puzzle
        </h1>
        
        <p className="text-[#6D655E] text-base mb-12">
          Welcome back! Ready to continue piecing together your memory?
        </p>

        <div className="w-full max-w-[280px] space-y-4">
          <button
            onClick={onPlay}
            className="w-full py-4 px-6 bg-[#2D2A26] hover:bg-[#1A1816] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 font-display tracking-wide cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PLAY</span>
          </button>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full py-4 px-6 bg-white hover:bg-white/70 active:scale-[0.98] text-[#2D2A26] font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-3 font-display tracking-wide border border-[#E5DACE] shadow-sm cursor-pointer"
          >
            <Settings className="w-5 h-5 text-[#8C7A6B]" />
            <span>SETTINGS</span>
          </button>
        </div>
      </motion.div>

      {/* Settings Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-[#F4EFE6]/90 backdrop-blur-sm flex flex-col items-center justify-end pb-8 px-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[280px]"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#F4EFE6] shrink-0">
                <div className="flex items-center gap-2">
                  {settingsView === 'other' && (
                    <button 
                      onClick={() => setSettingsView('main')}
                      className="p-1 -ml-1 text-[#8C7A6B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="text-xl font-bold text-[#2D2A26] font-display">
                    {settingsView === 'main' ? 'Settings' : 'Other Options'}
                  </h2>
                </div>
                <button 
                  onClick={closeSettings}
                  className="p-2 -mr-2 text-[#8C7A6B] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  {settingsView === 'main' && (
                    <motion.div
                      key="main-view"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 p-6 space-y-4"
                    >
                      <button
                        onClick={() => {
                          closeSettings();
                          onChangePhoto();
                        }}
                        className="w-full flex items-center justify-between p-4 bg-[#F4EFE6]/50 hover:bg-[#F4EFE6] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-[#8C7A6B]" />
                          <span className="font-semibold text-[#2D2A26]">Change Board Photo</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setSettingsView('other')}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#F4EFE6]/30 border border-[#F4EFE6] rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-[#8C7A6B]" />
                          <span className="font-semibold text-[#6D655E]">Other Options</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#8C7A6B]" />
                      </button>
                    </motion.div>
                  )}

                  {settingsView === 'other' && (
                    <motion.div
                      key="other-view"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 p-6 space-y-4"
                    >
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer border border-red-100"
                      >
                        <div className="flex items-center gap-3 text-red-600">
                          <Trash2 className="w-5 h-5" />
                          <span className="font-semibold">Clear Saved Game</span>
                        </div>
                      </button>
                      <p className="text-xs text-center text-[#8C7A6B] px-4">
                        This action will reset your app back to its original state.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#2D2A26]/40 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2A26] font-display mb-2">Are you sure?</h3>
              <p className="text-[#6D655E] mb-8 leading-relaxed">
                This will wipe your highscore and board photo. You will need to set up the game again.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleClearGame}
                  className="w-full py-3.5 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Yes, Clear It
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="w-full py-3.5 bg-white hover:bg-gray-50 active:scale-[0.98] text-[#6D655E] font-bold rounded-xl transition-all cursor-pointer border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

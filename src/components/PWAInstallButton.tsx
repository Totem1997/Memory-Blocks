import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const buttonClass = "w-full py-4 px-6 bg-white hover:bg-white/70 active:scale-[0.98] text-[#1D1D1F] font-bold rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center border border-[#E5E5EA] cursor-pointer";

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <>
        <button
          onClick={() => setShowAndroidGuide(true)}
          className={buttonClass}
        >
          <div className="flex items-center gap-3 text-base font-display tracking-wide">
            <Download className="w-5 h-5" />
            <span>ADD TO HOME SCREEN</span>
          </div>
          <span className="text-xs opacity-70 mt-1.5 font-normal normal-case font-sans">(for offline play sessions)</span>
        </button>

        {showAndroidGuide && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col items-center">
              <h3 className="text-2xl font-bold text-[#1D1D1F] font-display mb-4 text-center">Add to Home Screen</h3>
              <p className="text-base text-[#515154] leading-relaxed mb-4">
                This will add the game directly to your device. Please note it may take a few seconds to process in the background.
              </p>
              <p className="text-base text-[#515154] leading-relaxed mb-8">
                You may check your homescreen after some time and the game will show up as an app and playable offline. Enjoy playing!
              </p>
              <button
                onClick={() => {
                  setShowAndroidGuide(false);
                  install();
                }}
                className="w-full rounded-2xl bg-[#1D1D1F] text-white py-4 px-2 text-sm font-bold tracking-wider hover:bg-[#000000] active:scale-[0.98] transition-all cursor-pointer font-display text-center"
              >
                CONTINUE TO ADD TO HOME SCREEN
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={buttonClass}
        >
          <div className="flex items-center gap-3 text-base font-display tracking-wide">
            <Download className="w-5 h-5" />
            <span>ADD TO HOME SCREEN</span>
          </div>
          <span className="text-xs opacity-70 mt-1.5 font-normal normal-case font-sans">(for offline play sessions)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col items-center">
              <h3 className="text-2xl font-bold text-[#1D1D1F] font-display mb-4 text-center">Add to Home Screen</h3>
              <p className="text-base text-[#515154] leading-relaxed mb-4 w-full">
                1. Tap the <strong>Share</strong> button in the Safari toolbar.<br /><br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <p className="text-base text-[#515154] leading-relaxed mb-8 w-full">
                Once added, the game will show up as an app and playable offline. Enjoy playing!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-2xl bg-[#1D1D1F] text-white py-4 px-2 text-sm font-bold tracking-wider hover:bg-[#000000] active:scale-[0.98] transition-all cursor-pointer font-display text-center"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="w-full py-3 px-6 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 active:scale-[0.98] text-indigo-700 font-bold rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm font-display tracking-wide">
          <Download className="w-4 h-4" />
          <span>ADD TO HOME SCREEN</span>
        </div>
        <span className="text-[11px] opacity-80 mt-1 font-normal normal-case">(for offline play sessions)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="w-full py-3 px-6 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 active:scale-[0.98] text-indigo-700 font-bold rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="flex items-center gap-2 text-sm font-display tracking-wide">
            <Download className="w-4 h-4" />
            <span>ADD TO HOME SCREEN</span>
          </div>
          <span className="text-[11px] opacity-80 mt-1 font-normal normal-case">(for offline play sessions)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
              <h3 className="text-2xl font-bold text-[#1D1D1F] font-display mb-2">Install on iOS</h3>
              <p className="mt-2 text-base text-[#515154] leading-relaxed mb-6">
                1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-2xl bg-[#1D1D1F] text-white py-3.5 text-sm font-bold tracking-wider hover:bg-[#000000] active:scale-[0.98] transition-all cursor-pointer font-display"
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

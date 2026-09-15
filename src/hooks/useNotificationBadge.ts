import { useState, useEffect } from 'react';
import { usePWAInstall } from './usePWAInstall';

export function useNotificationBadge() {
  const { isInstallable, isInstalled, isIOS } = usePWAInstall();
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const checkBadgeStatus = () => {
      // 1. Must be installable (Android or iOS)
      const canInstall = isInstallable || isIOS;
      // 2. Must not be already installed
      if (isInstalled || !canInstall) {
        setShowBadge(false);
        return;
      }
      
      // 3. User must have completed at least one game
      const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0', 10);
      if (gamesPlayed < 1) {
        setShowBadge(false);
        return;
      }
      
      // 4. Must not be dismissed yet
      const dismissed = localStorage.getItem('pwaBadgeDismissed') === 'true';
      if (dismissed) {
        setShowBadge(false);
        return;
      }

      setShowBadge(true);
    };

    // Initial check
    checkBadgeStatus();

    // Listen for custom events to update status instantly
    const handleStatusUpdate = () => {
      checkBadgeStatus();
    };

    window.addEventListener('pwaBadgeDismissed', handleStatusUpdate);
    window.addEventListener('gamesPlayedUpdated', handleStatusUpdate);

    return () => {
      window.removeEventListener('pwaBadgeDismissed', handleStatusUpdate);
      window.removeEventListener('gamesPlayedUpdated', handleStatusUpdate);
    };
  }, [isInstallable, isInstalled, isIOS]);

  const dismissBadge = () => {
    localStorage.setItem('pwaBadgeDismissed', 'true');
    window.dispatchEvent(new Event('pwaBadgeDismissed'));
  };

  return { showBadge, dismissBadge };
}

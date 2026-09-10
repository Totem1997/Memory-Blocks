import { useState, useEffect, useRef } from 'react';
import { AppScreen, AudienceType, ThemeConfig } from './types';
import { parseAppConfig } from './utils/config';
import { getStoredItem, setStoredItem, clearAllData } from './utils/storage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeScreen } from './components/HomeScreen';
import { ChoosePhotoScreen } from './components/ChoosePhotoScreen';
import { CropPhotoScreen } from './components/CropPhotoScreen';
import { ReassuranceScreen } from './components/ReassuranceScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { GameBoard } from './components/GameBoard';
import { GiftScreen } from './components/GiftScreen';
import { GameReadyModal } from './components/GameReadyModal';

export default function App() {
  // Config determined by QR code / URL params
  const [audience, setAudience] = useState<AudienceType>('adult');
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => parseAppConfig().themeConfig);

  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('initializing');
  const [showGameReadyPopup, setShowGameReadyPopup] = useState(false);
  const [hasPlayedBefore, setHasPlayedBefore] = useState<boolean>(() => {
    return localStorage.getItem('hasPlayedBefore') === 'true';
  });

  // Photo state
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [hasSavedPhoto, setHasSavedPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize config and check for stored photo in IndexedDB
  useEffect(() => {
    const config = parseAppConfig();
    setAudience(config.audience);
    setThemeConfig(config.themeConfig);

    getStoredItem<string | null>('photo', null).then((saved) => {
      if (saved) {
        setActivePhoto(saved);
        setHasSavedPhoto(true);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('gift');
      }
    });
  }, []);

  // Handlers for user flow
  const handleStartFromWelcome = () => {
    setCurrentScreen('choose-photo');
  };

  const handleResumeSaved = () => {
    setCurrentScreen('game');
  };

  const handlePhotoSelected = (dataUrl: string) => {
    setRawPhotoSrc(dataUrl);
    setCurrentScreen('crop-photo');
  };

  const handleCropConfirmed = async (croppedDataUrl: string) => {
    setActivePhoto(croppedDataUrl);
    
    // Persist cropped photo and reset background theme
    await setStoredItem('photo', croppedDataUrl);
    await setStoredItem('bg-theme', 'minimalist-white');
    
    if (hasSavedPhoto) {
      setCurrentScreen('creating');
    } else {
      setHasSavedPhoto(true);
      setCurrentScreen('reassurance');
    }
  };

  const handleContinueFromReassurance = () => {
    setCurrentScreen('creating');
  };

  const handleLoadingFinished = () => {
    if (!hasPlayedBefore) {
      setShowGameReadyPopup(true);
    }
    setHasPlayedBefore(true);
    localStorage.setItem('hasPlayedBefore', 'true');
    setCurrentScreen('game');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setRawPhotoSrc(result);
        setCurrentScreen('crop-photo');
      }
    };
    reader.readAsDataURL(file);
    
    // Reset the input value so the same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleChangeMemory = () => {
    fileInputRef.current?.click();
  };

  const handleClearGame = async () => {
    await clearAllData();
    localStorage.removeItem('hasPlayedBefore');
    setHasPlayedBefore(false);
    setActivePhoto(null);
    setHasSavedPhoto(false);
    setCurrentScreen('gift');
  };

  if (currentScreen === 'initializing') {
    return <main className="min-h-screen bg-[#F5F5F7]" />;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <main className={`min-h-[100dvh] text-[#1D1D1F] flex flex-col justify-center ${currentScreen === 'game' ? 'bg-transparent' : 'bg-[#F5F5F7]'}`}>
        {currentScreen === 'gift' && (
          <GiftScreen onOpen={() => setCurrentScreen('welcome')} />
        )}

        {currentScreen === 'welcome' && (
        <WelcomeScreen
          themeConfig={themeConfig}
          onStart={handleStartFromWelcome}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          themeConfig={themeConfig}
          onPlay={handleResumeSaved}
          onChangePhoto={handleChangeMemory}
          onClearGame={handleClearGame}
        />
      )}

      {currentScreen === 'choose-photo' && (
        <ChoosePhotoScreen
          onPhotoSelected={handlePhotoSelected}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'crop-photo' && rawPhotoSrc && (
        <CropPhotoScreen
          photoSrc={rawPhotoSrc}
          onCropConfirmed={handleCropConfirmed}
          onBack={() => setCurrentScreen('choose-photo')}
          onRequestNewPhoto={handleChangeMemory}
        />
      )}

      {currentScreen === 'reassurance' && (
        <ReassuranceScreen
          onContinue={handleContinueFromReassurance}
        />
      )}

      {currentScreen === 'creating' && activePhoto && (
        <LoadingScreen
          photoSrc={activePhoto}
          onFinished={handleLoadingFinished}
          isReturningPlayer={hasPlayedBefore}
        />
      )}

      {currentScreen === 'game' && activePhoto && (
        <>
          <GameBoard
            photoSrc={activePhoto}
            audience={audience}
            themeConfig={themeConfig}
            onChangeMemory={handleChangeMemory}
          />
          {showGameReadyPopup && (
            <GameReadyModal onClose={() => setShowGameReadyPopup(false)} />
          )}
        </>
      )}
      </main>
    </>
  );
}

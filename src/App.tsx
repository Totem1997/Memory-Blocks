import { useState, useEffect } from 'react';
import { AppScreen, AudienceType, ThemeConfig, ThemeType } from './types';
import { parseAppConfig } from './utils/config';
import { getStoredItem, setStoredItem, clearAllData } from './utils/storage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeScreen } from './components/HomeScreen';
import { ChoosePhotoScreen } from './components/ChoosePhotoScreen';
import { CropPhotoScreen } from './components/CropPhotoScreen';
import { ReassuranceScreen } from './components/ReassuranceScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { GameBoard } from './components/GameBoard';

export default function App() {
  // Config determined by QR code / URL params
  const [audience, setAudience] = useState<AudienceType>('adult');
  const [, setTheme] = useState<ThemeType>('birthday');
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => parseAppConfig().themeConfig);

  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('initializing');

  // Photo state
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [, setHasSavedPhoto] = useState<boolean>(false);

  // Initialize config and check for stored photo in IndexedDB
  useEffect(() => {
    const config = parseAppConfig();
    setAudience(config.audience);
    setTheme(config.theme);
    setThemeConfig(config.themeConfig);

    getStoredItem<string | null>('photo', null).then((saved) => {
      if (saved) {
        setActivePhoto(saved);
        setHasSavedPhoto(true);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('welcome');
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
    setHasSavedPhoto(true);
    // Persist cropped photo and reset background theme
    await setStoredItem('photo', croppedDataUrl);
    await setStoredItem('bg-theme', 'minimalist-white');
    setCurrentScreen('reassurance');
  };

  const handleContinueFromReassurance = () => {
    setCurrentScreen('creating');
  };

  const handleLoadingFinished = () => {
    setCurrentScreen('game');
  };

  const handleChangeMemory = () => {
    setCurrentScreen('choose-photo');
  };

  const handleClearGame = async () => {
    await clearAllData();
    setActivePhoto(null);
    setHasSavedPhoto(false);
    setCurrentScreen('welcome');
  };

  if (currentScreen === 'initializing') {
    return <main className="min-h-screen bg-[#F4EFE6]" />;
  }

  return (
    <main className={`min-h-screen text-[#2D2A26] flex flex-col justify-center ${currentScreen === 'game' ? 'bg-transparent' : 'bg-[#FAF7F2]'}`}>
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
        />
      )}

      {currentScreen === 'game' && activePhoto && (
        <GameBoard
          photoSrc={activePhoto}
          audience={audience}
          themeConfig={themeConfig}
          onChangeMemory={handleChangeMemory}
        />
      )}
    </main>
  );
}

import { useState, useEffect } from 'react';
import { AppScreen, AudienceType, ThemeConfig, ThemeType } from './types';
import { parseAppConfig } from './utils/config';
import { getStoredItem, setStoredItem } from './utils/storage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChoosePhotoScreen } from './components/ChoosePhotoScreen';
import { CropPhotoScreen } from './components/CropPhotoScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { GameBoard } from './components/GameBoard';

export default function App() {
  // Config determined by QR code / URL params
  const [audience, setAudience] = useState<AudienceType>('adult');
  const [, setTheme] = useState<ThemeType>('birthday');
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => parseAppConfig().themeConfig);

  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');

  // Photo state
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [hasSavedPhoto, setHasSavedPhoto] = useState<boolean>(false);

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
      }
    });
  }, []);

  // Handlers for user flow
  const handleStartFromWelcome = () => {
    setCurrentScreen('choose-photo');
  };

  const handleResumeSaved = () => {
    if (activePhoto) {
      setCurrentScreen('game');
    } else {
      setCurrentScreen('choose-photo');
    }
  };

  const handlePhotoSelected = (dataUrl: string) => {
    setRawPhotoSrc(dataUrl);
    setCurrentScreen('crop-photo');
  };

  const handleCropConfirmed = async (croppedDataUrl: string) => {
    setActivePhoto(croppedDataUrl);
    setHasSavedPhoto(true);
    // Persist cropped photo in IndexedDB
    await setStoredItem('photo', croppedDataUrl);
    setCurrentScreen('creating');
  };

  const handleLoadingFinished = () => {
    setCurrentScreen('game');
  };

  const handleChangeMemory = () => {
    setCurrentScreen('choose-photo');
  };

  return (
    <main className={`min-h-screen text-[#2D2A26] flex flex-col justify-center ${currentScreen === 'game' ? 'bg-transparent' : 'bg-[#FAF7F2]'}`}>
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          themeConfig={themeConfig}
          hasSavedPhoto={hasSavedPhoto}
          onStart={handleStartFromWelcome}
          onResume={handleResumeSaved}
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

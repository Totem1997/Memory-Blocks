export type BgThemeType = 'blur' | 'color';

export interface BgTheme {
  id: string;
  name: string;
  type: BgThemeType;
  color: string;
  swatchBackground?: string;
}

export const BACKGROUND_THEMES: BgTheme[] = [
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    type: 'color',
    color: '#EAD5B9', // Richer warm cream/sand
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    type: 'color',
    color: '#FFB8C6', // Richer soft pastel pink
  },
  {
    id: 'gentle-sage',
    name: 'Gentle Sage',
    type: 'color',
    color: '#B7D9C0', // Richer soft pastel green
  },
  {
    id: 'pale-sky',
    name: 'Pale Sky',
    type: 'color',
    color: '#AEDBFF', // Richer soft pastel blue
  },
  {
    id: 'blur',
    name: 'Blurred Photo',
    type: 'blur',
    color: 'transparent',
    swatchBackground: 'conic-gradient(from 180deg at 50% 50%, #fca5a5 0deg, #fcd34d 120deg, #93c5fd 240deg, #fca5a5 360deg)',
  },
];

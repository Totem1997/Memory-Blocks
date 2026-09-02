export interface BgTheme {
  id: string;
  name: string;
  gradient: string;
  color: string;
}

export const BACKGROUND_THEMES: BgTheme[] = [
  { id: 'teal', name: 'Mint Teal', gradient: 'linear-gradient(to top, #0d9488 0%, #f0fdfa 100%)', color: '#0d9488' },
  { id: 'rose', name: 'Soft Rose', gradient: 'linear-gradient(to top, #e11d48 0%, #fff1f2 100%)', color: '#e11d48' },
  { id: 'lavender', name: 'Lavender', gradient: 'linear-gradient(to top, #7c3aed 0%, #f5f3ff 100%)', color: '#7c3aed' },
  { id: 'sky', name: 'Sky Blue', gradient: 'linear-gradient(to top, #0284c7 0%, #f0f9ff 100%)', color: '#0284c7' },
];

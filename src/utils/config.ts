import { AudienceType, ThemeConfig, ThemeType } from '../types';

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  birthday: {
    id: 'birthday',
    name: 'Birthday',
    welcomeHeadline: 'A little birthday gift made just for you.',
    welcomeSubtext: "This isn't just something to open. It's something to experience.",
    accentColor: '#F43F5E',
    bgDotColor: '#FDE047',
    tagline: 'Happy Birthday!',
  },
  christmas: {
    id: 'christmas',
    name: 'Holiday',
    welcomeHeadline: 'A cozy holiday gift made just for you.',
    welcomeSubtext: "This isn't just something to open. It's something to experience.",
    accentColor: '#059669',
    bgDotColor: '#EF4444',
    tagline: 'Happy Holidays!',
  },
  friendship: {
    id: 'friendship',
    name: 'Best Friends',
    welcomeHeadline: 'A special gift made just for you.',
    welcomeSubtext: "This isn't just something to open. It's something to experience.",
    accentColor: '#8B5CF6',
    bgDotColor: '#EC4899',
    tagline: 'Celebrating our friendship',
  },
  general: {
    id: 'general',
    name: 'Memory Blocks',
    welcomeHeadline: 'A little gift made just for you.',
    welcomeSubtext: "This isn't just something to open. It's something to experience.",
    accentColor: '#E11D48',
    bgDotColor: '#F59E0B',
    tagline: 'A favorite memory turned into a game',
  },
};

export function parseAppConfig(): {
  audience: AudienceType;
  theme: ThemeType;
  themeConfig: ThemeConfig;
} {
  if (typeof window === 'undefined') {
    return {
      audience: 'adult',
      theme: 'birthday',
      themeConfig: THEME_CONFIGS.birthday,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawAudience = params.get('audience')?.toLowerCase();
  const rawTheme = params.get('theme')?.toLowerCase();

  const audience: AudienceType = rawAudience === 'child' || rawAudience === 'kid' ? 'child' : 'adult';

  let theme: ThemeType = 'birthday';
  if (rawTheme && rawTheme in THEME_CONFIGS) {
    theme = rawTheme as ThemeType;
  } else if (rawTheme === 'xmas' || rawTheme === 'holiday') {
    theme = 'christmas';
  } else if (rawTheme === 'friends' || rawTheme === 'friend') {
    theme = 'friendship';
  }

  return {
    audience,
    theme,
    themeConfig: THEME_CONFIGS[theme],
  };
}

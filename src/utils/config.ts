import { AudienceType, ThemeConfig } from '../types';

export const APP_CONFIG: ThemeConfig = {
  name: 'Memory Blocks',
  welcomeHeadline: 'A little gift made just for you.',
  welcomeSubtext: 'Time flies, but the moments we cherish always stay with us. The person who gave you this wanted to turn a favorite memory into a fun experience.',
  accentColor: '#E11D48',
  bgDotColor: '#F59E0B',
  tagline: 'A favorite memory turned into a game',
};

export function parseAppConfig(): {
  audience: AudienceType;
  themeConfig: ThemeConfig;
} {
  if (typeof window === 'undefined') {
    return {
      audience: 'adult',
      themeConfig: APP_CONFIG,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawAudience = params.get('audience')?.toLowerCase();

  const audience: AudienceType = rawAudience === 'child' || rawAudience === 'kid' ? 'child' : 'adult';

  return {
    audience,
    themeConfig: APP_CONFIG,
  };
}

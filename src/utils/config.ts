import { AudienceType, ThemeConfig } from '../types';

export const APP_CONFIG: ThemeConfig = {
  name: 'Memory Blocks',
  welcomeHeadline: 'A GAME MADE FROM A FAVORITE MEMORY',
  welcomeSubtext: 'Time flies, but the moments we cherish always stay with us. The awesome person who gifted this to you wants to turn your favorite memories into a fun experience.',
  accentColor: '#E11D48',
  bgDotColor: '#F59E0B',
  tagline: 'A favorite memory turned into a game',
};

export function parseAppConfig(): {
  audience: AudienceType;
  themeConfig: ThemeConfig;
  isTrial: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      audience: 'adult',
      themeConfig: APP_CONFIG,
      isTrial: false,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const rawAudience = params.get('audience')?.toLowerCase();

  const audience: AudienceType = rawAudience === 'child' || rawAudience === 'kid' ? 'child' : 'adult';

  const trialParam = params.get('trial')?.toLowerCase();
  const modeParam = params.get('mode')?.toLowerCase();
  const hasTrialParam = trialParam === 'true' || trialParam === '1' || modeParam === 'trial';

  if (hasTrialParam) {
    sessionStorage.setItem('mb_is_trial', 'true');
  }

  const isTrial = hasTrialParam || sessionStorage.getItem('mb_is_trial') === 'true';

  return {
    audience,
    themeConfig: APP_CONFIG,
    isTrial,
  };
}

export function isTrialMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const trialParam = params.get('trial')?.toLowerCase();
  const modeParam = params.get('mode')?.toLowerCase();
  if (trialParam === 'true' || trialParam === '1' || modeParam === 'trial') {
    sessionStorage.setItem('mb_is_trial', 'true');
    return true;
  }
  return sessionStorage.getItem('mb_is_trial') === 'true';
}

export function isTrialCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('reset_trial') === 'true' || params.get('reset_trial') === '1') {
    localStorage.removeItem('mb_trial_completed');
    localStorage.removeItem('mb_trial_score');
    return false;
  }
  return localStorage.getItem('mb_trial_completed') === 'true';
}

export function markTrialCompleted(finalScore?: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mb_trial_completed', 'true');
  if (finalScore !== undefined) {
    localStorage.setItem('mb_trial_score', finalScore.toString());
  }
}

export function getTrialScore(): number | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem('mb_trial_score');
  return val ? parseInt(val, 10) : null;
}

export function resetTrialForTesting(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('mb_trial_completed');
  localStorage.removeItem('mb_trial_score');
  sessionStorage.removeItem('mb_is_trial');
}

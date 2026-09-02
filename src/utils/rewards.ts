import funfactsData from '../data/Funfacts_Rewards.json';
import remindersData from '../data/Reminders_Rewards.json';
import { AudienceType, RewardItem } from '../types';
import { getStoredItem, setStoredItem } from './storage';

const COOLDOWN_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

const KID_HYPE_MESSAGES = [
  { id: 'hype_1', content: 'You are super awesome! Have a great day!' },
  { id: 'hype_2', content: 'Don\'t forget to drink some water so you can grow strong!' },
  { id: 'hype_3', content: 'Did you do something kind for someone today?' },
  { id: 'hype_4', content: 'A smile is contagious, pass it on!' },
  { id: 'hype_5', content: 'You can do anything you put your mind to!' },
];

export function getRewardsForAudience(audience: AudienceType): RewardItem[] {
  if (audience === 'child') {
    const facts = funfactsData.map((item) => ({
      id: item.id,
      content: item.funfact,
    }));
    return [...facts, ...KID_HYPE_MESSAGES];
  }
  return remindersData.map((item) => ({
    id: item.id,
    content: item.reminder,
  }));
}

export async function getNextReward(audience: AudienceType): Promise<RewardItem> {
  const allRewards = getRewardsForAudience(audience);
  let usedIds = await getStoredItem<string[]>('usedRewardIds', []);

  // Filter out rewards that have already been used
  let availableRewards = allRewards.filter((r) => !usedIds.includes(r.id));

  // If all rewards exhausted, reset cycle!
  if (availableRewards.length === 0) {
    usedIds = [];
    availableRewards = allRewards;
  }

  // Pick random reward from available
  const randomIndex = Math.floor(Math.random() * availableRewards.length);
  const selectedReward = availableRewards[randomIndex];

  // Mark as used and persist
  usedIds.push(selectedReward.id);
  await setStoredItem('usedRewardIds', usedIds);

  return selectedReward;
}

export async function checkWelcomeBackEligibility(): Promise<boolean> {
  const firstOpenStr = await getStoredItem<number | null>('first_app_open_time', null);
  const now = Date.now();

  // If first time opening app ever
  if (!firstOpenStr) {
    await setStoredItem('first_app_open_time', now);
    // Initialize last seen to now, so they must wait 5 hours from first open
    await setStoredItem('last_welcome_message_time', now);
    return false;
  }

  const lastSeen = await getStoredItem<number>('last_welcome_message_time', 0);
  if (now - lastSeen >= COOLDOWN_DURATION_MS) {
    return true;
  }
  return false;
}

export async function markWelcomeMessageSeen(): Promise<void> {
  await setStoredItem('last_welcome_message_time', Date.now());
}

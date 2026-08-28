import funfactsData from '../data/Funfacts_Rewards.json';
import remindersData from '../data/Reminders_Rewards.json';
import { AudienceType, RewardItem } from '../types';
import { getStoredItem, setStoredItem } from './storage';

const COOLDOWN_DURATION_MS = 3 * 60 * 1000; // 3 minutes

export function getRewardsForAudience(audience: AudienceType): RewardItem[] {
  if (audience === 'child') {
    return funfactsData.map((item) => ({
      id: item.id,
      content: item.funfact,
    }));
  }
  return remindersData.map((item) => ({
    id: item.id,
    content: item.reminder,
  }));
}

export async function isRewardOnCooldown(): Promise<boolean> {
  const cooldownUntil = await getStoredItem<number>('cooldownUntil', 0);
  return Date.now() < cooldownUntil;
}

export async function getNextReward(audience: AudienceType): Promise<RewardItem> {
  const allRewards = getRewardsForAudience(audience);
  let usedIds = await getStoredItem<string[]>('usedRewardIds', []);

  // Filter out rewards that have already been used
  let availableRewards = allRewards.filter((r) => !usedIds.includes(r.id));

  // If all 50 rewards exhausted, reset cycle!
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

export async function startRewardCooldown(): Promise<number> {
  const expiresAt = Date.now() + COOLDOWN_DURATION_MS;
  await setStoredItem('cooldownUntil', expiresAt);
  return expiresAt;
}

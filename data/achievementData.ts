
import { Achievement } from '../types';
import { battleAchievements } from './achievements/battle';
import { collectionAchievements } from './achievements/collection';
import { economyAchievements } from './achievements/economy';
import { hiddenAchievements } from './achievements/hidden';
import { itemAchievements } from './achievements/items';
import { progressionAchievements } from './achievements/progression';

export const ACHIEVEMENT_REGISTRY: Achievement[] = [
  ...collectionAchievements,
  ...battleAchievements,
  ...progressionAchievements,
  ...economyAchievements,
  ...itemAchievements,
  ...hiddenAchievements,
];

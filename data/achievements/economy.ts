
import { Achievement } from '../../types';

export const economyAchievements: Achievement[] = [
  {
    id: 'money_reach_10k', title: 'Financially Stable', description: 'Possess $10,000.',
    icon: '💰', trigger: 'BATTLE_WON',
    condition: (_, ps) => ps.money >= 10000,
    reward: { itemId: 'ultra-ball', itemCount: 5 }
  },
  {
    id: 'money_reach_50k', title: 'High Roller', description: 'Possess $50,000.',
    icon: '💸', trigger: 'BATTLE_WON',
    condition: (_, ps) => ps.money >= 50000,
    reward: { itemId: 'rare-candy', itemCount: 5 }
  },
  {
    id: 'money_reach_100k', title: 'Millionaire in Training', description: 'Possess $100,000.',
    icon: '🤑', trigger: 'BATTLE_WON',
    condition: (_, ps) => ps.money >= 100000,
    reward: { itemId: 'master-ball', itemCount: 1 }
  },
];

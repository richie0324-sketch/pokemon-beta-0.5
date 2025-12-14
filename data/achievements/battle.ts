
import { Achievement } from '../../types';

export const battleAchievements: Achievement[] = [
  // --- BATTLE: STREAKS ---
  {
    id: 'battle_win_1', title: 'First Victory', description: 'Win your first battle.',
    icon: '⚔️', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak === 1,
    reward: { itemId: 'potion', itemCount: 3 }
  },
  {
    id: 'battle_streak_5', title: 'On a Roll!', description: 'Achieve a 5-win streak.',
    icon: '🔥', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak >= 5,
    reward: { money: 2000, itemId: 'x-attack', itemCount: 1 }
  },
  {
    id: 'battle_streak_10', title: 'Unstoppable', description: 'Achieve a 10-win streak.',
    icon: '🔥🔥', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak >= 10,
    reward: { money: 5000, itemId: 'super-potion', itemCount: 5 }
  },
    {
    id: 'battle_streak_15', title: 'Dominating', description: 'Achieve a 15-win streak.',
    icon: '☄️', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak >= 15,
    reward: { money: 7500 }
  },
  {
    id: 'battle_streak_20', title: 'Invincible', description: 'Achieve a 20-win streak.',
    icon: '🔥🔥🔥', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak >= 20,
    reward: { money: 10000, itemId: 'rare-candy', itemCount: 1 }
  },
    {
    id: 'battle_streak_30', title: 'Godlike', description: 'Achieve a 30-win streak.',
    icon: '🌌', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak >= 30,
    reward: { money: 20000 }
  },
  {
    id: 'battle_streak_50', title: 'Legendary', description: 'Achieve a 50-win streak.',
    icon: '🏆', trigger: 'BATTLE_WON',
    condition: (payload) => payload.streak >= 50,
    reward: { money: 50000, itemId: 'master-ball', itemCount: 1 }
  },
  
  // --- BATTLE: TRAINER DEFEATS ---
  {
    id: 'trainer_defeat_joey', title: 'Top Percentage', description: 'Defeat Youngster Joey.',
    icon: '🧢', trigger: 'BATTLE_WON',
    condition: (payload) => payload.isTrainer && payload.trainerId === 'youngster-joey',
    reward: { money: 500 }
  },
  {
    id: 'trainer_defeat_mrye', title: 'Hello, World', description: 'Defeat Developer Mr. Ye.',
    icon: '💻', trigger: 'BATTLE_WON',
    condition: (payload) => payload.isTrainer && payload.trainerId === 'mr-ye',
    reward: { itemId: 'exp-share', itemCount: 1 }
  },
  {
    id: 'trainer_defeat_rocket', title: 'Blasting Off Again', description: 'Defeat a Team Rocket Grunt.',
    icon: '🚀', trigger: 'BATTLE_WON',
    condition: (payload) => payload.isTrainer && payload.trainerId === 'rocket-grunt-m',
    reward: { money: 2000 }
  },
  {
    id: 'trainer_defeat_giovanni', title: 'Crime Doesn\'t Pay', description: 'Defeat the boss, Giovanni.',
    icon: '🌍', trigger: 'BATTLE_WON',
    condition: (payload) => payload.isTrainer && payload.trainerId === 'leader-giovanni',
    reward: { money: 10000 }
  },
  {
    id: 'trainer_hunter_1', title: 'Trainer Duelist', description: 'Defeat 5 unique trainers.',
    icon: '🤺', trigger: 'BATTLE_WON',
    condition: (payload, ps) => payload.isTrainer && ps.defeatedTrainers.length >= 5,
    reward: { money: 5000 }
  },
  {
    id: 'trainer_hunter_10', title: 'Trainer Conqueror', description: 'Defeat 10 unique trainers.',
    icon: '🎖️', trigger: 'BATTLE_WON',
    condition: (payload, ps) => payload.isTrainer && ps.defeatedTrainers.length >= 10,
    reward: { money: 10000 }
  },
];

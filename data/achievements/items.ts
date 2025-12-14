
import { Achievement } from '../../types';

export const itemAchievements: Achievement[] = [
  {
    id: 'item_use_rarecandy', title: 'Sweet Tooth', description: 'Use a Rare Candy for the first time.',
    icon: '🍬', trigger: 'ITEM_USED',
    condition: (payload) => payload.itemId === 'rare-candy',
    reward: { money: 500 }
  },
  {
    id: 'item_use_stone', title: 'Geologist', description: 'Use an evolution stone for the first time.',
    icon: '💎', trigger: 'ITEM_USED',
    condition: (payload) => ['fire-stone', 'water-stone', 'thunder-stone', 'leaf-stone', 'moon-stone', 'sun-stone'].includes(payload.itemId),
    reward: { money: 1000 }
  },
  {
    id: 'item_use_masterball', title: 'No-Miss Shot', description: 'Use the legendary Master Ball.',
    icon: 'Ⓜ️', trigger: 'ITEM_USED',
    condition: (payload) => payload.itemId === 'master-ball',
    reward: { money: 1337 }
  },
  {
    id: 'evolve_by_firestone', title: 'Born of Flame', description: 'Evolve a Pokemon with a Fire Stone.',
    icon: '🔥', trigger: 'ITEM_USED',
    condition: (payload) => payload.itemId === 'fire-stone',
    reward: { money: 1000 }
  },
  {
    id: 'evolve_by_waterstone', title: 'Child of the Sea', description: 'Evolve a Pokemon with a Water Stone.',
    icon: '💧', trigger: 'ITEM_USED',
    condition: (payload) => payload.itemId === 'water-stone',
    reward: { money: 1000 }
  },
  {
    id: 'evolve_by_thunderstone', title: 'Forged in Lightning', description: 'Evolve a Pokemon with a Thunder Stone.',
    icon: '⚡', trigger: 'ITEM_USED',
    condition: (payload) => payload.itemId === 'thunder-stone',
    reward: { money: 1000 }
  },
];

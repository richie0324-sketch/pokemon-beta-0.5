
import { Achievement } from '../../types';

export const hiddenAchievements: Achievement[] = [
  {
    id: 'hidden_catch_magikarp', title: 'Just Keep Splashing', description: 'Catch a Magikarp.',
    icon: '🐟', trigger: 'POKEMON_CAUGHT',
    condition: (payload) => payload.speciesId === 129,
    isHidden: true,
    reward: { money: 100 }
  },
  {
    id: 'hidden_evolve_magikarp', title: 'From Zero to Hero', description: 'Evolve a Magikarp into Gyarados.',
    icon: '🐉', trigger: 'POKEMON_EVOLVED',
    condition: (payload) => payload.prevSpeciesId === 129 && payload.nextSpeciesId === 130,
    isHidden: true,
    reward: { money: 10000, itemId: 'rare-candy', itemCount: 5 }
  },
  {
    id: 'hidden_catch_unown', title: 'Alphabet Soup', description: 'Catch an Unown.',
    icon: '❓', trigger: 'POKEMON_CAUGHT',
    condition: (payload) => payload.speciesId === 201,
    isHidden: true,
    reward: { money: 201 }
  },
  {
    id: 'hidden_catch_pikachu', title: 'Electric Mouse', description: 'Catch a Pikachu.',
    icon: '⚡', trigger: 'POKEMON_CAUGHT',
    condition: (payload) => payload.speciesId === 25,
    isHidden: true,
    reward: { itemId: 'thunder-stone', itemCount: 1 }
  },
];

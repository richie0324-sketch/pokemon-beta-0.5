
import { Achievement } from '../../types';

export const progressionAchievements: Achievement[] = [
  // --- NEW ACHIEVEMENT: JOURNEY START ---
  {
    id: 'journey_starts', title: 'Journey Start', description: 'Selected your first Pokemon. The adventure begins!',
    icon: '🚀', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length === 1,
    reward: { money: 1000 }
  },

  {
    id: 'level_reach_10', title: 'Getting Stronger', description: 'Raise a Pokemon to Level 10.',
    icon: '💪', trigger: 'POKEMON_LEVELED_UP',
    condition: (payload) => payload.newLevel >= 10,
    reward: { itemId: 'super-potion', itemCount: 2 }
  },
  {
    id: 'level_reach_25', title: 'Powering Up', description: 'Raise a Pokemon to Level 25.',
    icon: '⚡', trigger: 'POKEMON_LEVELED_UP',
    condition: (payload) => payload.newLevel >= 25,
    reward: { money: 2500, itemId: 'rare-candy', itemCount: 1 }
  },
  {
    id: 'level_reach_50', title: 'Max Potential', description: 'Raise a Pokemon to Level 50.',
    icon: '🌟', trigger: 'POKEMON_LEVELED_UP',
    condition: (payload) => payload.newLevel >= 50,
    reward: { money: 10000, itemId: 'rare-candy', itemCount: 3 }
  },

  // --- PROGRESSION: EVOLUTION ---
  {
    id: 'evolve_first', title: 'Metamorphosis', description: 'Evolve a Pokemon for the first time.',
    icon: '🦋', trigger: 'POKEMON_EVOLVED',
    condition: () => true, // Any evolution triggers this
    reward: { money: 1000 }
  },
  {
    id: 'evolve_starter', title: 'Journey\'s Partner', description: 'Evolve your starter Pokemon to its final form.',
    icon: '🎓', trigger: 'POKEMON_EVOLVED',
    condition: (payload) => [3, 6, 9, 154, 157, 160].includes(payload.nextSpeciesId),
    reward: { money: 5000 }
  },
  {
    id: 'evolve_eevee', title: 'Branching Paths', description: 'Evolve an Eevee.',
    icon: '🧬', trigger: 'POKEMON_EVOLVED',
    condition: (payload) => payload.prevSpeciesId === 133,
    reward: { itemId: 'rare-candy', itemCount: 1 }
  },
];

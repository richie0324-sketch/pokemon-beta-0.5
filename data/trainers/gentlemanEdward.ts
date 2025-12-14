
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const gentlemanEdward: Trainer = {
    id: 'gentleman-edward',
    name: 'Edward',
    title: 'Gentleman',
    spriteUrl: `${SPRITE_BASE}/gentleman-gen2.png`,
    tier: 'Elite',
    teamSize: 3,
    baseMoney: 5000, // High money drop
    dialogue: {
        intro: "I shall teach you the etiquette of battling.",
        win: "Splendid show, young one. Splendid.",
        lose: "Lack of discipline!"
    },
    preferredTypes: [PokemonType.FIRE, PokemonType.ELECTRIC],
    rewardItems: [{ itemId: 'ultra-ball', chance: 0.5 }]
};

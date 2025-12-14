
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const leaderGiovanni: Trainer = {
    id: 'leader-giovanni',
    name: 'Giovanni',
    title: 'Boss',
    spriteUrl: `${SPRITE_BASE}/giovanni.png`,
    tier: 'Master',
    teamSize: 5,
    baseMoney: 10000,
    dialogue: {
        intro: "I will show you the true power of the earth!",
        win: "What? How could a child defeat me?!",
        lose: "The world is mine!"
    },
    preferredTypes: [PokemonType.GROUND, PokemonType.ROCK],
    rewardItems: [{ itemId: 'master-ball', chance: 0.1 }, { itemId: 'rare-candy', chance: 1.0 }]
};

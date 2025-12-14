
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const championRed: Trainer = {
    id: 'champion-red',
    name: 'Red',
    title: 'Champion',
    spriteUrl: `${SPRITE_BASE}/red.png`,
    tier: 'Master',
    teamSize: 6,
    baseMoney: 20000,
    dialogue: {
        intro: "...",
        win: "...",
        lose: "..."
    },
    preferredTypes: [PokemonType.NORMAL, PokemonType.FIRE, PokemonType.WATER, PokemonType.GRASS, PokemonType.ELECTRIC],
    rewardItems: [{ itemId: 'master-ball', chance: 0.5 }]
};

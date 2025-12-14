
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const lassAnna: Trainer = {
    id: 'lass-anna',
    name: 'Anna',
    title: 'Lass',
    spriteUrl: `${SPRITE_BASE}/lass-gen2.png`,
    tier: 'Common',
    teamSize: 3,
    baseMoney: 600,
    dialogue: {
        intro: "My cute Pokemon are also super strong! Don't underestimate us!",
        win: "You're mean! You hurt them!",
        lose: "See? Cuteness always wins!"
    },
    preferredTypes: [PokemonType.GRASS, PokemonType.NORMAL]
};

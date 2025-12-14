
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const hikerDave: Trainer = {
    id: 'hiker-dave',
    name: 'Dave',
    title: 'Hiker',
    spriteUrl: `${SPRITE_BASE}/hiker-gen2.png`,
    tier: 'Common',
    teamSize: 3,
    baseMoney: 800,
    dialogue: {
        intro: "Math is like climbing a mountain. One step at a time!",
        win: "Whoa! Rock slide!",
        lose: "Solid as a rock foundation!"
    },
    preferredTypes: [PokemonType.ROCK, PokemonType.GROUND, PokemonType.FIGHTING]
};

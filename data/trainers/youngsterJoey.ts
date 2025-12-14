
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const youngsterJoey: Trainer = {
    id: 'youngster-joey',
    name: 'Joey',
    title: 'Youngster',
    spriteUrl: `${SPRITE_BASE}/youngster-gen2.png`,
    tier: 'Common',
    teamSize: 3,
    baseMoney: 500,
    dialogue: {
        intro: "My Rattata is in the top percentage of Rattatas! Battle me!",
        win: "I need to train harder!",
        lose: "Ha! Top percentage, I told you!"
    },
    preferredTypes: [PokemonType.NORMAL, PokemonType.BUG]
};

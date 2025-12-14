
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const rocketGrunt: Trainer = {
    id: 'rocket-grunt-m',
    name: 'Grunt',
    title: 'Team Rocket',
    spriteUrl: `${SPRITE_BASE}/rocketgrunt.png`,
    tier: 'Elite',
    teamSize: 3,
    baseMoney: 2000,
    dialogue: {
        intro: "Hand over that rare Pokemon! Math won't save you now!",
        win: "The boss will hear about this...",
        lose: "Prepare for trouble! And make it double!"
    },
    preferredTypes: [PokemonType.POISON, PokemonType.DARK],
    rewardItems: [{ itemId: 'rare-candy', chance: 0.3 }]
};


import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

export const aceTrainerCool: Trainer = {
    id: 'ace-trainer-cool',
    name: 'Ace',
    title: 'Cool Trainer',
    spriteUrl: `${SPRITE_BASE}/cooltrainer-gen2.png`,
    tier: 'Elite',
    teamSize: 4,
    baseMoney: 2500,
    dialogue: {
        intro: "I've calculated every possible outcome. You cannot win.",
        win: "My calculations were... wrong?",
        lose: "Just as predicted by the formula."
    },
    preferredTypes: [PokemonType.DRAGON, PokemonType.ELECTRIC, PokemonType.ICE],
    rewardItems: [{ itemId: 'max-revive', chance: 0.2 }]
};

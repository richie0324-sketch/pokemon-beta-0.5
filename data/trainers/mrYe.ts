
import { Trainer } from '../../types';
import { SPRITE_BASE } from './constants';

export const mrYe: Trainer = {
    id: 'mr-ye',
    name: 'Mr. Ye',
    title: 'Developer',
    // Updated to "Cheren (BW2)" for a handsome, glasses-wearing look
    spriteUrl: `${SPRITE_BASE}/cheren-gen5bw2.png`, 
    tier: 'Common',
    teamSize: 3,
    baseMoney: 1000,
    dialogue: {
        intro: "Hope you enjoy my game, and learn to love Math.",
        win: "Excellent calculation!",
        lose: "Keep practicing, you will get better."
    },
    preferredTypes: [], // Special case: Uses Starters
    rewardItems: [{ itemId: 'exp-share', chance: 1.0 }] // Guaranteed Drop
};

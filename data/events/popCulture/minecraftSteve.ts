
import { GameEvent } from '../../../types';

export const minecraftSteveEvent: GameEvent = {
    id: 'minecraft_steve',
    title: 'The Blocky Traveler',
    description: 'A strange man made of cubes approaches you. His name is Steve. He places a Crafting Table down. "Hrrrn." (He wants to enchant your gear)',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.15, // Increased to High Frequency
    effects: {},
    choices: [
        {
            label: 'Enchant: Efficiency V',
            riskText: 'Simplifies Math',
            onSelect: (actions) => {
                actions.game.addBuff('efficiency_v', 5);
                actions.ui.playSound('correct');
                return { description: 'Steve enchants your Pokedex! Incorrect answers will be hidden for 5 turns.', type: 'positive' };
            }
        },
        {
            label: 'Enchant: Sharpness IV',
            riskText: 'Critical Hits',
            onSelect: (actions) => {
                actions.game.addBuff('sharpness_iv', 3);
                actions.ui.playSound('attack');
                return { description: 'Your attacks feel sharper! Guaranteed CRITICAL HITS for 3 turns.', type: 'positive' };
            }
        },
        {
            label: 'Eat Golden Apple',
            riskText: 'Full Restore',
            onSelect: (actions) => {
                actions.player.healActive();
                actions.ui.playSound('correct');
                return { description: 'You ate the Golden Apple! You feel fully regenerated and stronger!', type: 'positive' };
            }
        }
    ]
};

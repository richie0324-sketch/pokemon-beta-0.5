
import { GameEvent } from '../../../types';

export const fortniteStormEvent: GameEvent = {
    id: 'fortnite_storm',
    title: 'The Storm Circle',
    description: 'A blue bus flies overhead! The Storm is shrinking! You see a Supply Drop landing nearby.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.15, // Increased to High Frequency
    effects: {},
    choices: [
        {
            label: 'Camp in Bush',
            riskText: 'Stealth Mode',
            onSelect: (actions) => {
                actions.game.addBuff('bush_camp', 3);
                return { description: 'You are hiding in a bush. Enemies won\'t attack you for the first 2 turns of the next 3 battles!', type: 'positive' };
            }
        },
        {
            label: 'Drink Chug Jug',
            riskText: 'Full Restore',
            onSelect: (actions) => {
                actions.player.healActive();
                actions.ui.playSound('correct');
                return { description: '15 seconds later... Full Health and Status Restored!', type: 'positive' };
            }
        },
        {
            label: 'Loot Supply Drop',
            riskText: 'Random Loot',
            onSelect: (actions) => {
                const roll = Math.random();
                if (roll < 0.4) {
                    actions.player.addItem('master-ball', 1);
                    actions.ui.playSound('correct');
                    return { description: 'Legendary Loot! You found a Master Ball!', type: 'positive' };
                } else {
                    actions.player.addItem('potion', 1);
                    return { description: 'Just a grey pistol... and a Potion.', type: 'neutral' };
                }
            }
        }
    ]
};

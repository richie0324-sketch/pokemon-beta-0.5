
import { GameEvent } from '../../../types';

export const robloxNoobEvent: GameEvent = {
    id: 'roblox_noob',
    title: 'The Glitch Encounter',
    description: 'The world flickers. A yellow "Noob" character floats down. "OOF! System lag detected." He offers you some glitched tools.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.15, // Increased to High Frequency
    effects: {},
    choices: [
        {
            label: 'Use Lag Switch',
            riskText: 'Freeze Timer',
            onSelect: (actions) => {
                actions.game.addBuff('lag_switch', 3);
                return { description: 'Network Lag! The battle timer will be frozen for 3 turns.', type: 'positive' };
            }
        },
        {
            label: 'Equip Gravity Coil',
            riskText: 'Def Up',
            onSelect: (actions) => {
                actions.game.addBuff('gravity_coil', 3);
                actions.ui.playSound('correct');
                return { description: 'Boing! You feel lighter. Incoming damage reduced for 3 turns.', type: 'positive' };
            }
        },
        {
            label: 'Ask for Admin',
            riskText: 'Skip Battle Item',
            onSelect: (actions) => {
                actions.player.addItem('admin-key', 1);
                actions.ui.playSound('correct');
                return { description: 'He gives you an ADMIN KEY. Use it to skip a battle instantly!', type: 'positive' };
            }
        }
    ]
};

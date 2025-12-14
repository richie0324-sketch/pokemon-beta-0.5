
import { GameEvent } from '../../../types';
import { useGameStore } from '../../../store/useGameStore';
import { usePlayerStore } from '../../../store/usePlayerStore';

// Dynamic Event that changes based on floor progress
export const towerOfRiskEvent: GameEvent = {
    id: 'tower_step',
    title: 'Bell Tower Trial',
    description: 'A monk blocks the staircase to the next floor. "Fate favours the bold... or the wealthy."',
    trigger: 'RANDOM_ANYTIME',
    chance: 0, // Triggered manually by code
    kind: 'dungeon_step',
    effects: {},
    choices: [
        {
            label: 'MAKE OFFERING ($500)',
            riskText: '100% Safe',
            onSelect: (actions) => {
                const { money } = usePlayerStore.getState();
                if (money < 500) {
                    actions.ui.playSound('incorrect');
                    return { description: '"Your pockets are empty, traveler. You must face the trial of risk."', type: 'negative' };
                }
                
                actions.player.addMoney(-500);
                useGameStore.getState().updateQuestProgress(1);
                actions.ui.playSound('correct');
                return { description: 'The monk bows and steps aside. You ascend safely to the next floor.', type: 'positive' };
            }
        },
        {
            label: 'TRIAL OF FLAME',
            riskText: '50% Burn Risk',
            onSelect: (actions) => {
                const success = Math.random() > 0.5;
                
                useGameStore.getState().updateQuestProgress(1); // Progress regardless, but with penalty if fail
                
                if (success) {
                    actions.ui.playSound('correct');
                    return { description: 'You walked through the flames unharmed! The spirits favor your courage.', type: 'positive' };
                } else {
                    actions.player.damageActivePct(0.25);
                    actions.game.addBuff('scorch', 99); // Permanent burn for this run (until boss)
                    actions.ui.playSound('damage');
                    return { description: 'The fire scorched you! You took damage and the heat is draining your energy (Permanent Burn).', type: 'negative' };
                }
            }
        }
    ]
};

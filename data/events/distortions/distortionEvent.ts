
import { GameEvent } from '../../../types';
import { useGameStore } from '../../../store/useGameStore';

export const distortionEvent: GameEvent = {
    id: 'distortion_signal',
    title: '⚠️ CRITICAL ERROR ⚠️',
    description: 'Your Pokedex screen flickers with static. Strange code fragments are floating in the air. Something does not belong in this dimension.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.05, // Very rare
    kind: 'quest_trigger',
    effects: {},
    choices: [
        {
            label: 'DEBUG THE SYSTEM',
            riskText: 'Survival Mode',
            onSelect: (actions) => {
                const topic = useGameStore.getState().selectedTopic;
                const isGen1 = topic === 'linear';

                // Gen 1: Mewtwo (150), Gen 2: Celebi (251)
                const bossId = isGen1 ? 150 : 251;
                const bossName = isGen1 ? "Mewtwo" : "Celebi";

                actions.game.startQuest('GLITCH_FIELD', bossId, bossName, 'WIN_BATTLES', 3);

                return { 
                    description: `You attempt to stabilize the signal. The world around you begins to pixelate. ${bossName} has accepted your challenge! Survive 3 battles!`, 
                    type: 'negative'
                };
            }
        },
        {
            label: 'REBOOT DEVICE',
            onSelect: (actions) => {
                return { description: "You turned it off and on again. The anomaly vanished.", type: 'neutral' };
            }
        }
    ]
};

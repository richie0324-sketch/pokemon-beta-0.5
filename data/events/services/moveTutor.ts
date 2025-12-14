
import { GameEvent } from '../../../types';
import { usePlayerStore } from '../../../store/usePlayerStore';

export const moveTutorEvent: GameEvent = {
    id: 'move_tutor',
    title: 'The Move Tutor',
    description: 'A martial artist is meditating under a waterfall. "I can teach your Pokemon the secret arts... for a price."',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1,
    effects: {},
    choices: [
        {
            label: 'LEARN MIND READER ($2000)',
            riskText: 'Efficiency Buff',
            onSelect: (actions) => {
                const { money, setMoney } = usePlayerStore.getState();
                if (money < 2000) return { description: "Come back when you have more cash.", type: 'negative' };
                
                setMoney(m => m - 2000);
                actions.game.addBuff('efficiency_v', 5); // Longer duration than standard item
                actions.ui.playSound('correct');
                return { description: 'Your Pokemon learned to read the flow of battle! (Wrong answers hidden for 5 turns)', type: 'positive' };
            }
        },
        {
            label: 'LEARN DYNAMIC PUNCH ($1500)',
            riskText: 'Crit Buff',
            onSelect: (actions) => {
                const { money, setMoney } = usePlayerStore.getState();
                if (money < 1500) return { description: "Come back when you have more cash.", type: 'negative' };
                
                setMoney(m => m - 1500);
                actions.game.addBuff('sharpness_iv', 5);
                actions.ui.playSound('attack');
                return { description: 'Your Pokemon learned to strike weak points! (Guaranteed Crits for 5 turns)', type: 'positive' };
            }
        },
        {
            label: 'NOT INTERESTED',
            onSelect: () => ({ description: 'The martial artist returns to his meditation.', type: 'neutral' })
        }
    ]
};

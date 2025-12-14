
import { GameEvent } from '../../../types';

export const madScientistEvent: GameEvent = {
    id: 'mad_scientist',
    title: 'The Mad Scientist',
    description: 'A scientist with explosive hair runs up to you holding two bubbling flasks. "TEST SUBJECT NEEDED! Drink one! For science!"',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1,
    effects: {},
    choices: [
        {
            label: 'DRINK RED POTION',
            riskText: 'Power or Pain',
            onSelect: (actions) => {
                if (Math.random() > 0.5) {
                    actions.game.addBuff('sharpness_iv', 5);
                    actions.player.healActive();
                    actions.ui.playSound('correct');
                    return { description: 'Delicious! Your Pokemon feels incredible power! (Crit Rate UP + Full Heal)', type: 'positive' };
                } else {
                    actions.player.damageActivePct(0.5);
                    actions.ui.playSound('damage');
                    return { description: 'It tastes like burning! Your Pokemon lost 50% HP.', type: 'negative' };
                }
            }
        },
        {
            label: 'DRINK BLUE POTION',
            riskText: 'Smart or Theft',
            onSelect: (actions) => {
                if (Math.random() > 0.5) {
                    actions.game.addBuff('efficiency_v', 5);
                    actions.ui.playSound('correct');
                    return { description: 'Brain blast! Math answers will be easier to see for 5 turns.', type: 'positive' };
                } else {
                    // Lose 20% money
                    // Since we can't read money easily in this context without importing store, we simulate a flat fee or standard loss
                    actions.player.addMoney(-1000); 
                    actions.ui.playSound('incorrect');
                    return { description: 'You passed out for a second... The scientist is gone, and your wallet feels lighter. (-$1000)', type: 'negative' };
                }
            }
        },
        {
            label: 'RUN AWAY',
            onSelect: () => ({ description: 'You sprint away before he can throw the potions at you.', type: 'neutral' })
        }
    ]
};

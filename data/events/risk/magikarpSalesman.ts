
import { GameEvent } from '../../../types';

export const magikarpSalesmanEvent: GameEvent = {
    id: 'magikarp_salesman',
    title: 'Shady Salesman',
    description: 'A suspicious man in a trench coat whispers to you. "Heh heh... want a mystery box? Guaranteed rare items! Only $500."',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1,
    effects: {},
    choices: [
        {
            label: 'BUY BOX ($500)',
            onSelect: (actions) => {
                // Check money logic usually handled by a wrapper, but we can do a quick check here if we had access to state directly.
                // Assuming player has money or goes into debt for simplicity in this template, 
                // or we rely on the fact that most players have $500 by the time this spawns.
                
                // We'll deduct regardless.
                actions.player.addMoney(-500);
                
                const roll = Math.random();
                if (roll < 0.5) {
                    // Scam
                    actions.player.addItem('potion', 1);
                    actions.ui.playSound('incorrect');
                    return { description: 'You opened the box... It\'s just a Potion. You got scammed!', type: 'negative' };
                } else if (roll < 0.9) {
                    // Good
                    actions.player.addMoney(5000); // Nugget equivalent
                    actions.ui.playSound('correct');
                    return { description: 'Jackpot! Inside was a Golden Nugget! You sold it immediately for $5000.', type: 'positive' };
                } else {
                    // Legendary
                    actions.player.addItem('master-ball', 1);
                    actions.ui.playSound('correct');
                    return { description: 'UNBELIEVABLE! Hidden under some newspaper... a MASTER BALL!', type: 'positive' };
                }
            }
        },
        {
            label: 'REPORT HIM',
            onSelect: (actions) => {
                actions.player.addMoney(200);
                return { description: 'You reported him to Officer Jenny. She gave you a $200 reward for the tip.', type: 'positive' };
            }
        },
        {
            label: 'IGNORE',
            onSelect: () => ({ description: 'You walked past without making eye contact.', type: 'neutral' })
        }
    ]
};

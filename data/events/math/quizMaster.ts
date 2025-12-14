
import { GameEvent } from '../../../types';

export const quizMasterEvent: GameEvent = {
    id: 'quiz_master',
    title: 'The Quiz Master',
    description: 'A man in a flashy suit jumps out! "TIME FOR A QUIZ! I have 4 red balls and 6 blue balls in a bag. What is the probability of picking a RED ball?"',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1,
    effects: {},
    choices: [
        {
            label: '40% (or 2/5)',
            onSelect: (actions) => {
                actions.player.addMoney(1000);
                actions.ui.playSound('correct');
                return { description: '"CORRECT! You know your numbers!" He hands you $1000.', type: 'positive' };
            }
        },
        {
            label: '60% (or 3/5)',
            onSelect: (actions) => {
                actions.player.addMoney(-200);
                actions.ui.playSound('incorrect');
                return { description: '"WRONG! That is the blue probability!" He takes $200 as a penalty fee.', type: 'negative' };
            }
        },
        {
            label: '50% (or 1/2)',
            onSelect: (actions) => {
                actions.player.addMoney(-200);
                actions.ui.playSound('incorrect');
                return { description: '"WRONG! Do I look like I play fair 50/50 games?" He takes $200.', type: 'negative' };
            }
        }
    ]
};

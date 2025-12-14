
import { GameEvent } from '../../../types';
import { ITEM_REGISTRY } from '../../itemData';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { POKEDEX_REGISTRY } from '../../pokedexData';
import { getExpToNextLevel, MAX_LEVEL, getStatGrowth } from '../../../constants';

// Internal function to handle logic normally found in items.ts, but executed via Event
const performTraining = (): boolean => {
    const { playerPokemon, setPlayerPokemon, money, setMoney } = usePlayerStore.getState();
    if (!playerPokemon) return false;
    
    if (money < 1000) return false;
    if (playerPokemon.level >= MAX_LEVEL) return true; // Just take money if maxed (scam? or just service fee)

    // Deduct Cost
    setMoney(m => m - 1000);

    // Level Up Logic
    let p = { ...playerPokemon };
    p.level += 1;
    p.exp = 0;
    p.maxExp = getExpToNextLevel(p.level);
    
    // Stats
    const growth = getStatGrowth(p.rarity);
    p.maxHp += growth.hp;
    p.attack += growth.atk;
    p.defense += growth.def;
    p.currHp = p.maxHp;

    setPlayerPokemon(p);
    return true;
};

export const dayCareEvent: GameEvent = {
    id: 'day_care',
    title: 'Mobile Day Care',
    description: 'An elderly lady has set up a mobile grooming station. "Your Pokemon look tired, dear. Shall I groom them?"',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.12,
    effects: {},
    choices: [
        {
            label: 'SPECIAL TRAINING ($1000)',
            riskText: 'Level Up',
            onSelect: (actions) => {
                const { money } = usePlayerStore.getState();
                if (money < 1000) {
                    actions.ui.playSound('incorrect');
                    return { description: "You don't have enough money, dear.", type: 'negative' };
                }
                
                const success = performTraining();
                if (success) {
                    actions.ui.playSound('correct');
                    return { description: 'Your Pokemon looks stronger! It leveled up!', type: 'positive' };
                } else {
                    return { description: 'Your Pokemon is already at peak performance (Max Level).', type: 'neutral' };
                }
            }
        },
        {
            label: 'MASSAGE ($200)',
            riskText: 'Full Heal',
            onSelect: (actions) => {
                const { money } = usePlayerStore.getState();
                if (money < 200) {
                    return { description: "Services aren't free, dear.", type: 'negative' };
                }
                actions.player.addMoney(-200);
                actions.player.healActive();
                actions.ui.playSound('correct');
                return { description: 'Your Pokemon looks relaxed and refreshed! (HP Fully Restored)', type: 'positive' };
            }
        },
        {
            label: 'POLITE DECLINE',
            onSelect: () => ({ description: '"Take care now!"', type: 'neutral' })
        }
    ]
};

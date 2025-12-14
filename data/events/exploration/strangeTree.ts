
import { GameEvent } from '../../../types';
import { POKEDEX_REGISTRY } from '../../pokedexData';
import { createPokemonInstance } from '../../../services/pokemonGenService';
import { useGameStore } from '../../../store/useGameStore';

export const strangeTreeEvent: GameEvent = {
    id: 'strange_tree',
    title: 'The Strange Tree',
    description: 'You spot a peculiar tree blocking the path. It seems to be wiggling slightly. It has delicious-looking berries.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1,
    condition: () => useGameStore.getState().selectedTopic === 'probability', // Gen 2 Only (Probability topic)
    effects: {},
    choices: [
        {
            label: 'EAT BERRIES',
            onSelect: (actions) => {
                actions.player.healActive();
                actions.ui.playSound('correct');
                return { description: 'Sweet and tangy! Your Pokemon feels refreshed and fully healed.', type: 'positive' };
            }
        },
        {
            label: 'SHAKE TREE',
            riskText: 'Risk: Battle',
            onSelect: (actions) => {
                const roll = Math.random();
                if (roll < 0.4) {
                    // Item Reward
                    actions.player.addItem('rare-candy', 1);
                    actions.ui.playSound('correct');
                    return { description: 'A Rare Candy fell out of the branches!', type: 'positive' };
                } else {
                    // Battle: Sudowoodo (185) or Pineco (204)
                    const targetId = Math.random() > 0.5 ? 185 : 204;
                    const entry = POKEDEX_REGISTRY.find(p => p.speciesId === targetId);
                    
                    if (entry) {
                        const enemy = createPokemonInstance(entry, false, 25);
                        actions.battle.startWild(enemy);
                        // No return description needed as battle starts immediately
                        return;
                    }
                    return { description: 'The tree stopped moving.', type: 'neutral' };
                }
            }
        },
        {
            label: 'LEAVE IT ALONE',
            onSelect: () => ({ description: 'Better safe than sorry.', type: 'neutral' })
        }
    ]
};

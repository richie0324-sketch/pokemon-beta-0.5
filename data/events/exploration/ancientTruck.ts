
import { GameEvent, PokemonType } from '../../../types';
import { POKEDEX_REGISTRY } from '../../pokedexData';
import { createPokemonInstance } from '../../../services/pokemonGenService';
import { useGameStore } from '../../../store/useGameStore';

export const ancientTruckEvent: GameEvent = {
    id: 'ancient_truck',
    title: 'The Lonely Truck',
    description: 'You find an old pickup truck parked on a small strip of land near the S.S. Anne. Rumors say a mythical Pokemon hides beneath it.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.05, // Very Rare
    condition: () => useGameStore.getState().selectedTopic === 'linear', // Gen 1 Only
    effects: {},
    choices: [
        {
            label: 'PUSH TRUCK',
            riskText: 'Check: Strength',
            onSelect: (actions) => {
                // Check for Fighting/Rock/Ground types in party for "Strength"
                const team = actions.player.getAllCaught();
                const hasStrength = team.some(p => 
                    p.type === PokemonType.FIGHTING || 
                    p.type === PokemonType.ROCK || 
                    p.type === PokemonType.GROUND ||
                    p.attack > 100 // Or just really strong
                );
                
                // 100% chance if strong, 30% chance if just lucky
                if (hasStrength || Math.random() < 0.3) {
                    const mewEntry = POKEDEX_REGISTRY.find(p => p.speciesId === 151); // Mew
                    if (mewEntry) {
                        const mew = createPokemonInstance(mewEntry, true, 30);
                        actions.battle.startWild(mew);
                        return;
                    }
                }
                
                actions.ui.playSound('incorrect');
                return { description: "You shove the truck with all your might... but it won't budge. You need a stronger Pokemon (Fighting/Rock/Ground).", type: 'negative' };
            }
        },
        {
            label: 'LOOK UNDER',
            onSelect: (actions) => {
                if (Math.random() < 0.5) {
                     actions.player.addItem('rare-candy', 1);
                     actions.ui.playSound('correct');
                     return { description: 'You crawled underneath... and found a Rare Candy stuck in the exhaust pipe!', type: 'positive' };
                }
                return { description: 'Just some dust, oil stains, and a stale Lava Cookie wrapper.', type: 'neutral' };
            }
        },
        {
            label: 'LEAVE',
            onSelect: () => ({ description: 'Probably just an urban legend.', type: 'neutral' })
        }
    ]
};


import { GameEvent } from '../../../types';
import { createPokemonInstance } from '../../../services/pokemonGenService';

export const ultraSignalEvent: GameEvent = {
    id: 'ultra_signal',
    title: 'Elite Signal Detected',
    description: 'You pick up a high-frequency broadcast. It\'s a Master Trainer! "I possess a Pokemon with perfect genetics. Do you have the skill to face perfection?"',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.08,
    kind: 'ultra_perfect',
    effects: {},
    choices: [
        {
            label: 'ACCEPT CHALLENGE',
            riskText: 'Lv.35 Perfect IVs',
            onSelect: (actions, event) => {
                if (event.data?.entry) {
                    const level = event.data.level || 35;
                    const baseEntry = event.data.entry;
                    
                    // Create basic instance
                    let enemy = createPokemonInstance(baseEntry, false, level);
                    
                    // Apply "Ultra" Perfect IVs
                    const { hp, atk, def } = baseEntry.baseStats;
                    const maxHp = hp + 31 + (level * 2);
                    const attack = atk + 31 + level;
                    const defense = def + 31 + level;
                    
                    enemy = { 
                        ...enemy, 
                        rarity: 'Ultra', 
                        ivs: { hp: 31, atk: 31, def: 31 }, 
                        maxHp, currHp: maxHp, attack, defense 
                    };

                    actions.battle.startWild(enemy);
                    // FIXED: Do not call closeEvent() here, as it resets state to prevState (Victory Screen)
                    return;
                }
                return { description: "The signal was lost.", type: 'negative' };
            }
        },
        {
            label: 'IGNORE',
            onSelect: (actions) => {
                return { description: 'You blocked the signal and continued your journey.', type: 'neutral' };
            }
        }
    ]
};

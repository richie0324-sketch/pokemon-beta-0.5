
import { GameEvent } from '../../../types';
import { POKEDEX_REGISTRY } from '../../pokedexData';
import { createPokemonInstance } from '../../../services/pokemonGenService';

export const glitchedAtmEvent: GameEvent = {
    id: 'glitched_atm',
    title: 'Malfunctioning ATM',
    description: 'An ATM is sparking. The screen flashes: "SOLVE FOR X: 2x + 500 = 2500". Dispensing cash if correct.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.08,
    effects: {},
    choices: [
        {
            label: 'x = 1000',
            onSelect: (actions) => {
                actions.player.addMoney(2500);
                actions.ui.playSound('correct');
                return { description: 'BEEP BOOP. WITHDRAWAL SUCCESSFUL. You found $2500!', type: 'positive' };
            }
        },
        {
            label: 'x = 2000',
            onSelect: (actions) => {
                actions.player.damageActivePct(0.3);
                actions.ui.playSound('damage');
                return { description: 'ERROR! The ATM explodes! Your Pokemon took damage.', type: 'negative' };
            }
        },
        {
            label: 'HIT THE MACHINE',
            riskText: 'Triggers Battle',
            onSelect: (actions) => {
                // Porygon (137)
                const entry = POKEDEX_REGISTRY.find(p => p.speciesId === 137);
                if (entry) {
                    const enemy = createPokemonInstance(entry, false, 20);
                    actions.battle.startWild(enemy);
                    return;
                }
                return { description: 'It stopped buzzing.', type: 'neutral' };
            }
        }
    ]
};

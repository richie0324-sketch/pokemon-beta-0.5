
import { GameEvent } from '../../../types';
import { POKEDEX_REGISTRY } from '../../pokedexData';

export const linkTradeEvent: GameEvent = {
    id: 'link_trade',
    title: 'Link Cable Resonance',
    description: 'A rift in the data stream has opened! One of your Pokemon is reacting to the energy. It wants to evolve through the link.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.12,
    kind: 'trade_evolution',
    effects: {},
    choices: [
        {
            label: 'CONNECT CABLE',
            onSelect: (actions, event) => {
                const { tradeId, targetSpeciesId } = event.data || {};
                
                const targetPokemon = actions.player.getAllCaught().find(p => p.id === tradeId);
                const nextEntry = POKEDEX_REGISTRY.find(e => e.speciesId === targetSpeciesId);

                if (targetPokemon && nextEntry) {
                    actions.game.triggerEvolution(targetPokemon, nextEntry);
                    actions.ui.showToast(`${targetPokemon.name} is evolving through the link!`, "success");
                    actions.ui.closeEvent();
                    return;
                }
                
                return { description: "The connection failed...", type: 'negative' };
            }
        },
        {
            label: 'CANCEL',
            onSelect: (actions) => {
                return { description: 'The rift fades away.', type: 'neutral' };
            }
        }
    ]
};


import { GameEvent, PokemonType } from '../../../types';
import { POKEDEX_REGISTRY } from '../../pokedexData';
import { createPokemonInstance } from '../../../services/pokemonGenService';

export const fossilExcavationEvent: GameEvent = {
    id: 'fossil_excavation',
    title: 'Archaeological Dig',
    description: 'A Hiker is digging frantically. "Help me out! I assume you have a Pokemon that can dig?"',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.08,
    effects: {},
    choices: [
        {
            label: 'HELP DIG',
            riskText: 'Req: Ground/Rock Type',
            onSelect: (actions) => {
                const team = actions.player.getAllCaught();
                const hasDigger = team.some(p => p.type === PokemonType.GROUND || p.type === PokemonType.ROCK);

                if (hasDigger) {
                    actions.player.addMoney(2000);
                    actions.ui.playSound('correct');
                    return { description: 'Success! Your Pokemon unearthed a Star Piece. The Hiker paid you $2000 for your help!', type: 'positive' };
                } else {
                    actions.ui.playSound('incorrect');
                    return { description: 'You tried to dig with your bare hands... and failed. You need a Ground or Rock type Pokemon.', type: 'negative' };
                }
            }
        },
        {
            label: 'INSPECT ROCKS',
            riskText: 'May Awaken Ancient',
            onSelect: (actions) => {
                // Aerodactyl (142), Omanyte (138), Kabuto (140)
                const fossils = [142, 138, 140];
                const targetId = fossils[Math.floor(Math.random() * fossils.length)];
                const entry = POKEDEX_REGISTRY.find(p => p.speciesId === targetId);

                if (entry) {
                    const enemy = createPokemonInstance(entry, false, 30);
                    actions.battle.startWild(enemy);
                    return;
                }
                return { description: 'Just a normal rock.', type: 'neutral' };
            }
        },
        {
            label: 'WALK AWAY',
            onSelect: () => ({ description: 'You leave the Hiker to his work.', type: 'neutral' })
        }
    ]
};

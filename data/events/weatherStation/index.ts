
import { GameEvent, PokemonType } from '../../../types';

export const weatherStationEvent: GameEvent = {
    id: 'weather_station',
    title: 'Weather Control Station',
    description: 'You discover an abandoned weather research station. The console is still active. Warning: Changing the weather will drastically alter local wildlife!',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.08,
    kind: 'weather_control',
    effects: {},
    choices: [
        {
            label: '🔴 RED BUTTON (HEAT)',
            onSelect: (actions) => {
                actions.game.setEncounterModifier({
                    type: 'FORCE_TYPE',
                    types: [PokemonType.FIRE, PokemonType.GROUND],
                    label: 'HARSH SUN',
                    remaining: 3
                });
                return { description: 'DROUGHT DETECTED! Intense sunlight will attract FIRE and GROUND types for 3 turns.', type: 'neutral' };
            }
        },
        {
            label: '🔵 BLUE BUTTON (STORM)',
            onSelect: (actions) => {
                actions.game.setEncounterModifier({
                    type: 'FORCE_TYPE',
                    types: [PokemonType.WATER, PokemonType.ELECTRIC],
                    label: 'THUNDERSTORM',
                    remaining: 3
                });
                return { description: 'HEAVY RAIN! The storm will bring out WATER and ELECTRIC types for 3 turns.', type: 'neutral' };
            }
        },
        {
            label: '🟡 YELLOW BUTTON (SAND)',
            onSelect: (actions) => {
                actions.game.setEncounterModifier({
                    type: 'FORCE_TYPE',
                    types: [PokemonType.ROCK, PokemonType.GROUND],
                    label: 'SANDSTORM',
                    remaining: 3
                });
                return { description: 'SANDSTORM! High winds will attract ROCK and GROUND types for 3 turns.', type: 'neutral' };
            }
        },
        {
            label: '⚪ WHITE BUTTON (SNOW)',
            onSelect: (actions) => {
                actions.game.setEncounterModifier({
                    type: 'FORCE_TYPE',
                    types: [PokemonType.ICE],
                    label: 'BLIZZARD',
                    remaining: 3
                });
                return { description: 'ARCTIC CHILL! A blizzard will bring out ICE types for 3 turns.', type: 'neutral' };
            }
        },
        {
            label: '🟢 GREEN BUTTON (LIFE)',
            onSelect: (actions) => {
                actions.game.setEncounterModifier({
                    type: 'FORCE_TYPE',
                    types: [PokemonType.GRASS, PokemonType.BUG],
                    label: 'JUNGLE',
                    remaining: 3
                });
                return { description: 'OVERGROWTH! The forest is alive with GRASS and BUG types for 3 turns.', type: 'neutral' };
            }
        },
        {
            label: '🟣 PURPLE BUTTON (MIST)',
            onSelect: (actions) => {
                actions.game.setEncounterModifier({
                    type: 'FORCE_TYPE',
                    types: [PokemonType.PSYCHIC, PokemonType.GHOST, PokemonType.DARK],
                    label: 'FOG',
                    remaining: 3
                });
                return { description: 'NIGHTFALL... PSYCHIC and GHOST types are appearing in the fog.', type: 'neutral' };
            }
        }
    ]
};

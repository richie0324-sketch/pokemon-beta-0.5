
import { GameEvent } from '../../../types';
import { useGameStore } from '../../../store/useGameStore';

// HO-OH EVENT
export const hoOhEvent: GameEvent = {
    id: 'johto_hooh',
    title: 'The Rainbow Peak',
    description: 'You reach Ecruteak City and gaze up at the Bell Tower. The autumn leaves swirl around you. A monk approaches: "The Rainbow Wing glows... The Guardian of the Skies waits at the summit."',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1, // Increased for easier testing (was 0.04)
    condition: () => useGameStore.getState().selectedTopic === 'probability', // Gen 2 Only
    kind: 'quest_trigger',
    effects: {},
    choices: [
        {
            label: 'ASCEND TOWER',
            riskText: 'Quest: Climb 5 Floors',
            onSelect: (actions) => {
                // Ho-Oh is ID 250
                // We use SCORCHING_SUN to represent the tower's heat, but the trial itself is about risk
                actions.game.startQuest('SCORCHING_SUN', 250, "Ho-Oh", 'CLEAR_DUNGEON', 5);
                actions.ui.playSound('correct');
                return { 
                    description: 'You begin the ascent. The air shimmers with heat. Prove your resolve to the Monks of the Tower!', 
                    type: 'positive' 
                };
            }
        },
        {
            label: 'WALK AWAY',
            onSelect: () => ({ description: 'The tower is too high. Maybe another time.', type: 'neutral' })
        }
    ]
};

// LUGIA EVENT
export const lugiaEvent: GameEvent = {
    id: 'johto_lugia',
    title: 'The Abyssal Whirlpool',
    description: 'You are navigating the Whirl Islands. A massive whirlpool blocks your path, but your Silver Wing begins to shine. A deep, sorrowful cry echoes from the underwater caves.',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.1, // Increased for easier testing (was 0.04)
    condition: () => useGameStore.getState().selectedTopic === 'probability', // Gen 2 Only
    kind: 'quest_trigger',
    effects: {},
    choices: [
        {
            label: 'DIVE DEEP',
            riskText: 'Quest: Navigate 5 Depths',
            onSelect: (actions) => {
                // Lugia is ID 249
                // MISTY_RAIN represents the fog and confusion
                actions.game.startQuest('MISTY_RAIN', 249, "Lugia", 'CLEAR_DUNGEON', 5);
                actions.ui.playSound('correct');
                return { 
                    description: 'You dive into the dark waters. The currents are treacherous. You must calculate the safest path through the whirlpools!', 
                    type: 'positive' 
                };
            }
        },
        {
            label: 'RETREAT',
            onSelect: () => ({ description: 'The ocean currents are too dangerous.', type: 'neutral' })
        }
    ]
};

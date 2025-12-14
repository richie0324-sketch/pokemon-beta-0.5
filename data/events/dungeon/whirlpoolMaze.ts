
import { GameEvent } from '../../../types';
import { useGameStore } from '../../../store/useGameStore';
import { randInt } from '../../../services/mathUtils';

// Helper to generate probability options
const generateOptions = () => {
    // Generate 3 probabilities
    const opts = [
        { label: "Left Channel", val: randInt(10, 40), text: "" },
        { label: "Center Channel", val: randInt(45, 65), text: "" },
        { label: "Right Channel", val: randInt(70, 95), text: "" }
    ];
    
    // Shuffle values visually
    opts.forEach(o => {
        // Randomly format as %, decimal, or fraction
        const type = Math.random();
        if (type < 0.33) o.text = `${o.val}%`;
        else if (type < 0.66) o.text = `0.${o.val}`;
        else {
            // Approximation for fraction look
            const num = Math.floor(o.val / 10);
            o.text = `${num}/10`;
        }
    });
    
    // Shuffle position
    return opts.sort(() => Math.random() - 0.5);
};

export const whirlpoolMazeEvent: GameEvent = {
    id: 'whirlpool_step',
    title: 'Whirlpool Maze',
    description: 'Currents swirl violently ahead. Your Pokégear calculates the survival probability of three paths. Choose the safest one!',
    trigger: 'RANDOM_ANYTIME',
    chance: 0,
    kind: 'dungeon_step',
    effects: {},
    data: { options: [] }, // Will be populated dynamically
    choices: [
        {
            label: 'PATH A',
            onSelect: (actions, event) => {
                // Logic handled in view, but fallback here
                return { description: 'Calculating...', type: 'neutral' };
            }
        }
    ]
};

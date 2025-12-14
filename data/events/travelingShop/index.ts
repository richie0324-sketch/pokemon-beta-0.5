
import { GameEvent } from '../../../types';

// The Shop is unique because it transitions the modal state rather than just showing a text result.
// We handle this by returning a specific property or using the UI action.

export const travelingShopEvent: GameEvent = {
    id: 'traveling_shop',
    title: 'The Wandering Merchant',
    description: 'A jolly merchant flags you down. "Hello! I have rare items from across the regions. Care to take a look?"',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.15,
    kind: 'shop',
    effects: {},
    data: { stock: [] },
    choices: [
        {
            label: 'BROWSE WARES',
            onSelect: (actions) => {
                // Special case: The Modal component listens for this return to switch view
                // OR we can define it in the types.
                // For now, let's use the convention that specific outcome type 'shop_open' triggers the UI.
                // Note: The EventModal handles the return value specially.
                return { description: 'Welcome!', type: 'positive' }; 
            }
        },
        {
            label: 'NO THANKS',
            onSelect: (actions) => {
                return { description: 'Safe travels, young trainer!', type: 'neutral' };
            }
        }
    ]
};

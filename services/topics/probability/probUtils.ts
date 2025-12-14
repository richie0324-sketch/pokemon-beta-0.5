
import { randInt, pick, simplifyFraction } from "../../mathUtils";

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const COIN_SIDES = ["Heads", "Tails"];
export const DICE_FACES = [1, 2, 3, 4, 5, 6];

// Helper to shuffle array (Fisher-Yates)
export const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// Generates a random bag of colored balls
export const generateBag = (minTotal = 5, maxTotal = 15) => {
    const colors = ["Red", "Blue", "Green", "Yellow"];
    const bag: Record<string, number> = {};
    let total = 0;
    
    // Ensure at least 2 colors have items
    const activeColors = shuffle(colors).slice(0, randInt(2, 3));
    
    activeColors.forEach(c => {
        const count = randInt(1, 5);
        bag[c] = count;
        total += count;
    });

    // Pad to minTotal
    while(total < minTotal) {
        const c = pick(activeColors);
        bag[c]++;
        total++;
    }

    return { bag, total, activeColors };
};

// Formatting helper
export const fmtProb = (n: number, d: number): string => simplifyFraction(n, d);


import { MathQuestion, Difficulty } from "../../../types";
import { randInt, pick, generateOptions, simplifyFraction } from "../../mathUtils";
import { fmtProb, generateBag } from "./probUtils";

export const generateHardProbability = (difficulty: Difficulty): MathQuestion => {
    const isChallenge = difficulty === 'Challenge';
    const type = randInt(1, isChallenge ? 20 : 30);

    if (isChallenge) {
        if (type === 1) {
            const red = randInt(2, 4);
            const ratio = randInt(4, 6); 
            const total = red * ratio;
            return {
                question: `P(Red) = 1/${ratio}. There are ${red} Red balls. Total balls?`,
                options: [total.toString(), (total + red).toString(), (red * 2).toString(), ratio.toString()],
                correctIndex: 0,
                explanation: `1/${ratio} = ${red}/Total → Total = ${total}.`,
                topic: "Probability (Reverse)", difficulty: "Challenge"
            };
        }
        if (type === 2) {
            const favorable = randInt(3, 6);
            const prob = 1/4;
            const total = favorable * 4;
            return {
                question: `P(Win) = 1/4. There are ${favorable} winning tickets. Total tickets?`,
                options: [total.toString(), (total / 2).toString(), (favorable + 4).toString(), "4"],
                correctIndex: 0,
                explanation: `1/4 = ${favorable}/Total → Total = ${total}.`,
                topic: "Probability (Reverse)", difficulty: "Challenge"
            };
        }
        if (type === 3) {
            return {
                question: "P(Win) = 0.2. Play 100 times. Expected wins?",
                options: ["20", "50", "80", "10"],
                correctIndex: 0,
                explanation: "Expected = 0.2 × 100 = 20.",
                topic: "Probability (Expected)", difficulty: "Challenge"
            };
        }
        if (type === 4) {
            return {
                question: "P(6) = 1/6. Roll 60 times. Expected 6s?",
                options: ["10", "6", "60", "1"],
                correctIndex: 0,
                explanation: "Expected = 60 × 1/6 = 10.",
                topic: "Probability (Expected)", difficulty: "Challenge"
            };
        }
        if (type === 5) {
            return {
                question: "Bag: 2 Red, 3 Blue. Pick Red, KEEP it, pick again. P(both Red)?",
                options: ["1/10", "4/25", "2/5", "1/5"],
                correctIndex: 0,
                explanation: "2/5 × 1/4 = 2/20 = 1/10.",
                topic: "Probability (Dependent)", difficulty: "Challenge"
            };
        }
        if (type === 6) {
            return {
                question: "Bag: 3 Red, 2 Blue. Pick Blue, KEEP it, pick again. P(both Blue)?",
                options: ["1/10", "4/25", "2/5", "1/5"],
                correctIndex: 0,
                explanation: "2/5 × 1/4 = 2/20 = 1/10.",
                topic: "Probability (Dependent)", difficulty: "Challenge"
            };
        }
        if (type === 7) {
            return {
                question: "Game A: Win if Heads. Game B: Win if die > 3. Which is better?",
                options: ["Both equal (P = 1/2)", "Game A", "Game B", "Cannot compare"],
                correctIndex: 0,
                explanation: "P(Heads) = 1/2. P(die > 3) = 3/6 = 1/2.",
                topic: "Probability (Fairness)", difficulty: "Challenge"
            };
        }
        if (type === 8) {
            return {
                question: "Bag A: 4R 2B. Bag B: 3R 3B. Bag C: 2R 4B. Which is fairest?",
                options: ["Bag B (equal chance)", "Bag A", "Bag C", "All the same"],
                correctIndex: 0,
                explanation: "Bag B: 3R and 3B, so P(R) = P(B) = 1/2.",
                topic: "Probability (Fairness)", difficulty: "Challenge"
            };
        }
        if (type === 9) {
            return {
                question: "Roll 600 dice. About how many 6s?",
                options: ["100", "600", "60", "6"],
                correctIndex: 0,
                explanation: "600 × 1/6 = 100.",
                topic: "Probability (Expected)", difficulty: "Challenge"
            };
        }
        if (type === 10) {
            return {
                question: "Flip 1000 coins. About how many Heads?",
                options: ["500", "1000", "250", "100"],
                correctIndex: 0,
                explanation: "1000 × 1/2 = 500.",
                topic: "Probability (Expected)", difficulty: "Challenge"
            };
        }
        if (type === 11) {
            return {
                question: "P(A) > P(B). P(A) = 0.4, total = 10. Min items for A?",
                options: ["5", "4", "3", "6"],
                correctIndex: 0,
                explanation: "For P(A) > 0.4, need > 4 items. Min = 5.",
                topic: "Probability (Reasoning)", difficulty: "Challenge"
            };
        }
        if (type === 12) {
            return {
                question: "Bag: 4 Red, 1 Blue. P(Red then Blue) without replacement?",
                options: ["4/20 or 1/5", "4/25", "1/4", "5/20"],
                correctIndex: 0,
                explanation: "4/5 × 1/4 = 4/20 = 1/5.",
                topic: "Probability (Dependent)", difficulty: "Challenge"
            };
        }
        if (type === 13) {
            return {
                question: "P(A) = 0.25. In 80 trials, expected A?",
                options: ["20", "25", "40", "80"],
                correctIndex: 0,
                explanation: "80 × 0.25 = 20.",
                topic: "Probability (Expected)", difficulty: "Challenge"
            };
        }
        if (type === 14) {
            return {
                question: "Which sample space is for 'Pick a coin (5c, 10c) then flip it'?",
                options: ["{5c-H, 5c-T, 10c-H, 10c-T}", "{5c, 10c}", "{H, T}", "{5c, 10c, H, T}"],
                correctIndex: 0,
                explanation: "List all combinations of coin type and flip.",
                topic: "Probability (Sample Space)", difficulty: "Challenge"
            };
        }
        if (type === 15) {
            return {
                question: "Game: Win if die shows prime (2,3,5). P(Win)?",
                options: ["1/2", "1/3", "2/3", "1/6"],
                correctIndex: 0,
                explanation: "Primes: {2, 3, 5} = 3/6 = 1/2.",
                topic: "Probability (Dice)", difficulty: "Challenge"
            };
        }
        if (type === 16) {
            return {
                question: "Spinner A: P(Red)=0.3. Spinner B: P(Red)=40%. Which has higher P(Red)?",
                options: ["Spinner B", "Spinner A", "Equal", "Cannot compare"],
                correctIndex: 0,
                explanation: "0.4 > 0.3.",
                topic: "Probability (Comparison)", difficulty: "Challenge"
            };
        }
        if (type === 17) {
            return {
                question: "After 50 trials, A: 20 times, B: 15 times, C: 15 times. Most likely?",
                options: ["A", "B", "C", "All equal"],
                correctIndex: 0,
                explanation: "A appeared most (20 times).",
                topic: "Probability (Experimental)", difficulty: "Challenge"
            };
        }
        if (type === 18) {
            return {
                question: "Bag: 5 balls. P(Red) = 3/5. How many Red?",
                options: ["3", "5", "2", "1"],
                correctIndex: 0,
                explanation: "3/5 of 5 = 3 Red balls.",
                topic: "Probability (Reverse)", difficulty: "Challenge"
            };
        }
        if (type === 19) {
            return {
                question: "Game: Roll die. Win if > 4. Fair compared to coin flip?",
                options: ["No, die game is less fair (P = 1/3 vs 1/2)", "Yes, both are 1/2", "Die game is fairer", "Cannot compare"],
                correctIndex: 0,
                explanation: "P(die > 4) = 2/6 = 1/3 ≠ 1/2.",
                topic: "Probability (Fairness)", difficulty: "Challenge"
            };
        }
        return {
            question: "P(A) = 0.1. In 200 trials, expected A?",
            options: ["20", "10", "100", "2"],
            correctIndex: 0,
            explanation: "200 × 0.1 = 20.",
            topic: "Probability (Expected)", difficulty: "Challenge"
        };
    } else {
        if (type === 1) {
            return {
                question: "Roll TWO dice. Sample space size?",
                options: ["36", "12", "6", "24"],
                correctIndex: 0,
                explanation: "6 × 6 = 36.",
                topic: "Probability (Sample Space)", difficulty: "Hard"
            };
        }
        if (type === 2) {
            return {
                question: "Which is LARGEST: 4/5, 70%, 0.75, 3/4?",
                options: ["4/5", "70%", "0.75", "3/4"],
                correctIndex: 0,
                explanation: "4/5 = 0.80 is largest.",
                topic: "Probability (Comparison)", difficulty: "Hard"
            };
        }
        if (type === 3) {
            return {
                question: "P(Heads) = 1/2, P(Die 6) = 1/6. P(Heads AND 6)?",
                options: ["1/12", "7/12", "1/3", "1/8"],
                correctIndex: 0,
                explanation: "Independent: 1/2 × 1/6 = 1/12.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 4) {
            return {
                question: "P(A) = 0.2, P(B) = 0.3. Mutually exclusive. P(A or B)?",
                options: ["0.5", "0.6", "0.06", "0.1"],
                correctIndex: 0,
                explanation: "Mutually exclusive: 0.2 + 0.3 = 0.5.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 5) {
            return {
                question: "Flip 2 coins. P(At least one Head)?",
                options: ["3/4", "1/2", "1/4", "1"],
                correctIndex: 0,
                explanation: "1 - P(TT) = 1 - 1/4 = 3/4.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 6) {
            return {
                question: "Die × Die. P(both show 6)?",
                options: ["1/36", "1/6", "2/36", "1/12"],
                correctIndex: 0,
                explanation: "1/6 × 1/6 = 1/36.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 7) {
            return {
                question: "Which statement is FALSE?",
                options: ["P(A) can be 1.5", "P(A) can be 0", "P(A) can be 1", "P(A) can be 0.5"],
                correctIndex: 0,
                explanation: "P must be between 0 and 1.",
                topic: "Probability (Theory)", difficulty: "Hard"
            };
        }
        if (type === 8) {
            return {
                question: "Coin × Coin × Coin. Sample space size?",
                options: ["8", "6", "3", "4"],
                correctIndex: 0,
                explanation: "2 × 2 × 2 = 8.",
                topic: "Probability (Sample Space)", difficulty: "Hard"
            };
        }
        if (type === 9) {
            return {
                question: "Which is SMALLEST: 0.4, 35%, 3/10, 1/4?",
                options: ["1/4", "0.4", "35%", "3/10"],
                correctIndex: 0,
                explanation: "1/4 = 0.25 is smallest.",
                topic: "Probability (Comparison)", difficulty: "Hard"
            };
        }
        if (type === 10) {
            return {
                question: "P(A) = 3/8. Simplify to decimal.",
                options: ["0.375", "0.38", "3.8", "0.3"],
                correctIndex: 0,
                explanation: "3 ÷ 8 = 0.375.",
                topic: "Probability (Conversion)", difficulty: "Hard"
            };
        }
        if (type === 11) {
            return {
                question: "Die × Coin. P(6 AND Heads)?",
                options: ["1/12", "1/6", "1/2", "7/12"],
                correctIndex: 0,
                explanation: "1/6 × 1/2 = 1/12.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 12) {
            return {
                question: "Flip 3 coins. P(all Heads)?",
                options: ["1/8", "1/4", "1/2", "3/8"],
                correctIndex: 0,
                explanation: "1/2 × 1/2 × 1/2 = 1/8.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 13) {
            return {
                question: "P(A) = 1/3, P(B) = 1/4. Independent. P(A AND B)?",
                options: ["1/12", "7/12", "1/7", "1/2"],
                correctIndex: 0,
                explanation: "1/3 × 1/4 = 1/12.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type === 14) {
            return {
                question: "Spinner: 8 sections, 3 Red, 5 Blue. P(Red OR Blue)?",
                options: ["1 (Certain)", "3/8", "5/8", "0"],
                correctIndex: 0,
                explanation: "All sections are Red or Blue.",
                topic: "Probability (Or)", difficulty: "Hard"
            };
        }
        if (type === 15) {
            return {
                question: "Die × Die. P(sum = 7)?",
                options: ["6/36 or 1/6", "7/36", "1/12", "2/36"],
                correctIndex: 0,
                explanation: "Pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6.",
                topic: "Probability (Compound)", difficulty: "Hard"
            };
        }
        if (type <= 30) {
            const variations = [
                { q: "Coin × Spinner (3 sections). Outcomes?", a: "6", d: ["3", "5", "2"] },
                { q: "Flip 2 coins. P(exactly one Head)?", a: "1/2", d: ["1/4", "3/4", "1"] },
                { q: "Order: 0.3, 1/4, 25%, 0.35 from smallest.", a: "1/4, 25%, 0.3, 0.35", d: ["0.3, 1/4, 25%, 0.35", "0.35, 0.3, 25%, 1/4", "25%, 1/4, 0.3, 0.35"] },
                { q: "P(A) = 0.4, P(B) = 0.4. Independent. P(both)?", a: "0.16", d: ["0.8", "0.4", "0.04"] },
                { q: "Die × Die. P(both even)?", a: "9/36 or 1/4", d: ["3/36", "18/36", "6/36"] },
                { q: "Spinner (4 equal) × Coin. Outcomes?", a: "8", d: ["4", "6", "2"] },
                { q: "P(A) = 2/5, P(not A)?", a: "3/5", d: ["2/5", "1/5", "4/5"] },
                { q: "Flip 4 coins. Sample space size?", a: "16", d: ["8", "4", "12"] },
                { q: "Die × Die. P(doubles)?", a: "6/36 or 1/6", d: ["1/36", "12/36", "2/36"] },
                { q: "Which equals 0.6: 3/5, 6/100, 60/10, 1/6?", a: "3/5", d: ["6/100", "60/10", "1/6"] },
                { q: "P(A or B) = 0.7, P(A) = 0.4, mutually exclusive. P(B)?", a: "0.3", d: ["0.7", "0.4", "1.1"] },
                { q: "Coin × Coin. P(at least one Tail)?", a: "3/4", d: ["1/4", "1/2", "1"] },
                { q: "Die. P(prime OR even)?", a: "5/6", d: ["1/2", "1", "4/6"] },
                { q: "P = 5/8 as percent?", a: "62.5%", d: ["58%", "50%", "80%"] },
                { q: "Die × Die. P(sum = 2)?", a: "1/36", d: ["2/36", "1/6", "1/12"] }
            ];
            const v = variations[(type - 16) % variations.length];
            return {
                question: v.q,
                options: [v.a, ...v.d],
                correctIndex: 0,
                explanation: `Answer: ${v.a}.`,
                topic: "Probability (Mixed)", difficulty: "Hard"
            };
        }
    }

    return {
        question: "Die × Coin × Coin. Sample space size?",
        options: ["24", "12", "6", "8"],
        correctIndex: 0,
        explanation: "6 × 2 × 2 = 24.",
        topic: "Probability (Sample Space)", difficulty: "Hard"
    };
};

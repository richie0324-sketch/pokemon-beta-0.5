
import { MathQuestion } from "../../../types";
import { randInt, pick, generateOptions, simplifyFraction } from "../../mathUtils";
import { generateBag, fmtProb } from "./probUtils";

export const generateMediumProbability = (): MathQuestion => {
    const type = randInt(1, 60);

    if (type === 1) {
        const p = randInt(20, 80);
        return {
            question: `P(rain) = ${p}%. What is P(no rain)?`,
            options: [`${100-p}%`, `${p}%`, "50%", "10%"],
            correctIndex: 0,
            explanation: `P(not rain) = 100% - ${p}% = ${100-p}%.`,
            topic: "Probability (Complements)", difficulty: "Medium"
        };
    }
    if (type === 2) {
        return {
            question: "If P(A) = 3/5, what is P(not A)?",
            options: ["2/5", "3/5", "1/5", "4/5"],
            correctIndex: 0,
            explanation: "P(not A) = 1 - 3/5 = 2/5.",
            topic: "Probability (Complements)", difficulty: "Medium"
        };
    }
    if (type === 3) {
        return {
            question: "P(Win) + P(Lose) + P(Draw) must equal:",
            options: ["1", "100", "0", "0.5"],
            correctIndex: 0,
            explanation: "Sum of all probabilities = 1.",
            topic: "Probability (Theory)", difficulty: "Medium"
        };
    }
    if (type === 4) {
        return {
            question: "P(win) = 0.6. What is P(lose)?",
            options: ["0.4", "0.6", "0.3", "1.0"],
            correctIndex: 0,
            explanation: "P(lose) = 1 - 0.6 = 0.4.",
            topic: "Probability (Complements)", difficulty: "Medium"
        };
    }
    if (type === 5) {
        return {
            question: "Bag: 3 Red, 4 Blue, 3 Green. P(Red OR Blue)?",
            options: ["7/10", "3/10", "4/10", "1/2"],
            correctIndex: 0,
            explanation: "3 + 4 = 7 out of 10.",
            topic: "Probability (Or)", difficulty: "Medium"
        };
    }
    if (type === 6) {
        return {
            question: "P(rolling Even) on a die?",
            options: ["1/2", "1/3", "1/6", "2/3"],
            correctIndex: 0,
            explanation: "Even: {2, 4, 6} = 3/6 = 1/2.",
            topic: "Probability (Dice)", difficulty: "Medium"
        };
    }
    if (type === 7) {
        return {
            question: "P(rolling > 4) on a die?",
            options: ["2/6 or 1/3", "4/6", "1/6", "5/6"],
            correctIndex: 0,
            explanation: "> 4: {5, 6} = 2 outcomes.",
            topic: "Probability (Dice)", difficulty: "Medium"
        };
    }
    if (type === 8) {
        return {
            question: "Which is MORE likely: P = 1/3 or P = 1/4?",
            options: ["P = 1/3", "P = 1/4", "Equal", "Cannot compare"],
            correctIndex: 0,
            explanation: "1/3 ≈ 0.33 > 1/4 = 0.25.",
            topic: "Probability (Comparison)", difficulty: "Medium"
        };
    }
    if (type === 9) {
        return {
            question: "Flip a coin and roll a die. Are they independent?",
            options: ["Yes, independent", "No, dependent", "Only if Heads", "Mutually exclusive"],
            correctIndex: 0,
            explanation: "Separate objects = independent events.",
            topic: "Probability (Theory)", difficulty: "Medium"
        };
    }
    if (type === 10) {
        const success = randInt(4, 8);
        return {
            question: `You scored ${success} goals in 20 shots. Estimate P(Goal).`,
            options: [fmtProb(success, 20), fmtProb(20-success, 20), "1/2", fmtProb(20, success)],
            correctIndex: 0,
            explanation: `P ≈ ${success}/20.`,
            topic: "Probability (Experimental)", difficulty: "Medium"
        };
    }
    if (type === 11) {
        return {
            question: "Spinner (Red, Blue) × Coin. Total outcomes?",
            options: ["4", "2", "3", "6"],
            correctIndex: 0,
            explanation: "2 × 2 = 4 outcomes.",
            topic: "Probability (Compound)", difficulty: "Medium"
        };
    }
    if (type === 12) {
        return {
            question: "Pick Red, put back, pick again. P(Red) changes?",
            options: ["No, stays the same", "Yes, decreases", "Yes, increases", "Cannot tell"],
            correctIndex: 0,
            explanation: "With replacement, P stays the same.",
            topic: "Probability (Independence)", difficulty: "Medium"
        };
    }
    if (type === 13) {
        return {
            question: "Which is a 'Random Experiment'?",
            options: ["Rolling a die", "Counting fingers", "Measuring a ruler", "Reading page 1"],
            correctIndex: 0,
            explanation: "Random experiment has uncertain outcome.",
            topic: "Probability (Theory)", difficulty: "Medium"
        };
    }
    if (type === 14) {
        return {
            question: "P(rolling Odd) on a die?",
            options: ["1/2", "1/3", "1/6", "2/3"],
            correctIndex: 0,
            explanation: "Odd: {1, 3, 5} = 3/6 = 1/2.",
            topic: "Probability (Dice)", difficulty: "Medium"
        };
    }
    if (type === 15) {
        return {
            question: "Spinner: 8 sections, 3 Blue. P(NOT Blue)?",
            options: ["5/8", "3/8", "1/2", "1"],
            correctIndex: 0,
            explanation: "8 - 3 = 5 not Blue.",
            topic: "Probability (Complements)", difficulty: "Medium"
        };
    }
    if (type === 16) {
        return {
            question: "Flip 2 coins. How many have at least one Head?",
            options: ["3", "1", "2", "4"],
            correctIndex: 0,
            explanation: "HH, HT, TH have at least one H.",
            topic: "Probability (Counting)", difficulty: "Medium"
        };
    }
    if (type === 17) {
        return {
            question: "Is 'Rolling a 3' a simple or compound event?",
            options: ["Simple (one outcome)", "Compound", "Neither", "Both"],
            correctIndex: 0,
            explanation: "Simple = exactly one outcome.",
            topic: "Probability (Theory)", difficulty: "Medium"
        };
    }
    if (type === 18) {
        return {
            question: "Is 'Rolling even' simple or compound?",
            options: ["Compound (multiple outcomes)", "Simple", "Neither", "Impossible"],
            correctIndex: 0,
            explanation: "Even = {2, 4, 6} = multiple outcomes.",
            topic: "Probability (Theory)", difficulty: "Medium"
        };
    }
    if (type === 19) {
        const occur = randInt(15, 35);
        return {
            question: `In 50 trials, A happened ${occur} times. P(A) as percent?`,
            options: [`${occur * 2}%`, `${100 - occur * 2}%`, "50%", `${occur}%`],
            correctIndex: 0,
            explanation: `${occur}/50 = ${occur * 2}%.`,
            topic: "Probability (Experimental)", difficulty: "Medium"
        };
    }
    if (type === 20) {
        return {
            question: "Die × Coin. Sample space size?",
            options: ["12", "6", "8", "2"],
            correctIndex: 0,
            explanation: "6 × 2 = 12.",
            topic: "Probability (Compound)", difficulty: "Medium"
        };
    }
    if (type === 21) {
        return {
            question: "25% equals which fraction?",
            options: ["1/4", "1/2", "1/5", "1/3"],
            correctIndex: 0,
            explanation: "25% = 25/100 = 1/4.",
            topic: "Probability (Conversion)", difficulty: "Medium"
        };
    }
    if (type === 22) {
        return {
            question: "0.5 equals which percentage?",
            options: ["50%", "5%", "0.5%", "500%"],
            correctIndex: 0,
            explanation: "0.5 × 100 = 50%.",
            topic: "Probability (Conversion)", difficulty: "Medium"
        };
    }
    if (type === 23) {
        return {
            question: "P(A) = 2/5. Express as decimal.",
            options: ["0.4", "0.2", "0.5", "2.5"],
            correctIndex: 0,
            explanation: "2 ÷ 5 = 0.4.",
            topic: "Probability (Conversion)", difficulty: "Medium"
        };
    }
    if (type === 24) {
        return {
            question: "Die × Die. Sample space size?",
            options: ["36", "12", "6", "24"],
            correctIndex: 0,
            explanation: "6 × 6 = 36.",
            topic: "Probability (Compound)", difficulty: "Medium"
        };
    }
    if (type === 25) {
        return {
            question: "P(A) + P(not A) = ?",
            options: ["1", "0", "2", "0.5"],
            correctIndex: 0,
            explanation: "Event + Complement = 1.",
            topic: "Probability (Complements)", difficulty: "Medium"
        };
    }
    if (type === 26) {
        return {
            question: "P(rolling ≤ 3) on a die?",
            options: ["1/2", "1/3", "2/3", "1/6"],
            correctIndex: 0,
            explanation: "≤ 3: {1, 2, 3} = 3/6 = 1/2.",
            topic: "Probability (Dice)", difficulty: "Medium"
        };
    }
    if (type === 27) {
        return {
            question: "Bag: 5 Red, 5 Blue. P(Red OR Blue)?",
            options: ["1 (Certain)", "1/2", "5/10", "0"],
            correctIndex: 0,
            explanation: "All balls are Red or Blue.",
            topic: "Probability (Or)", difficulty: "Medium"
        };
    }
    if (type === 28) {
        return {
            question: "Flip 3 coins. Sample space size?",
            options: ["8", "6", "3", "4"],
            correctIndex: 0,
            explanation: "2 × 2 × 2 = 8.",
            topic: "Probability (Compound)", difficulty: "Medium"
        };
    }
    if (type === 29) {
        return {
            question: "20% equals which decimal?",
            options: ["0.2", "2.0", "0.02", "20"],
            correctIndex: 0,
            explanation: "20 ÷ 100 = 0.2.",
            topic: "Probability (Conversion)", difficulty: "Medium"
        };
    }
    if (type === 30) {
        return {
            question: "Bag: 4 Red, 6 Blue. P(not Red)?",
            options: ["6/10", "4/10", "1/2", "1"],
            correctIndex: 0,
            explanation: "Not Red = Blue = 6/10.",
            topic: "Probability (Complements)", difficulty: "Medium"
        };
    }
    if (type <= 60) {
        const variations = [
            { q: "P(A) = 0.3. P(not A)?", a: "0.7", d: ["0.3", "1.3", "0"] },
            { q: "P(A) = 1/6. P(not A)?", a: "5/6", d: ["1/6", "6/6", "1/5"] },
            { q: "Bag: 2 Red, 3 Blue, 5 Green. P(Red or Green)?", a: "7/10", d: ["2/10", "5/10", "3/10"] },
            { q: "P(rolling prime) on a die?", a: "1/2", d: ["1/3", "2/3", "1/6"] },
            { q: "Coin × Coin × Coin. Sample space size?", a: "8", d: ["6", "3", "4"] },
            { q: "Spinner: 10 sections, 4 Red. P(Red)?", a: "4/10 or 2/5", d: ["6/10", "1/10", "1/2"] },
            { q: "60% as a fraction?", a: "3/5", d: ["6/10", "2/3", "1/2"] },
            { q: "P = 0.75 as fraction?", a: "3/4", d: ["7/10", "1/2", "2/3"] },
            { q: "P(rolling ≥ 5)?", a: "2/6 or 1/3", d: ["4/6", "5/6", "1/6"] },
            { q: "Spinner (A, B, C) × Coin. Outcomes?", a: "6", d: ["3", "5", "2"] },
            { q: "P(A) = 40%. P(not A)?", a: "60%", d: ["40%", "100%", "0%"] },
            { q: "Bag: all 8 Red. P(Blue)?", a: "0", d: ["1", "8", "1/8"] },
            { q: "Which is larger: 2/5 or 3/10?", a: "2/5", d: ["3/10", "Equal", "Cannot compare"] },
            { q: "Die × Spinner (2 sections). Outcomes?", a: "12", d: ["6", "8", "2"] },
            { q: "A landed 12 times in 40 trials. P(A)?", a: "12/40 or 3/10", d: ["40/12", "1/12", "1/2"] },
            { q: "P(rolling 1 or 2)?", a: "2/6 or 1/3", d: ["1/6", "4/6", "5/6"] },
            { q: "Bag: 6 Red, 4 Blue. P(Red)?", a: "6/10 or 3/5", d: ["4/10", "1/10", "1/2"] },
            { q: "P = 1/8 as decimal?", a: "0.125", d: ["0.8", "0.18", "8"] },
            { q: "Roll two dice. P(both show 1)?", a: "1/36", d: ["1/6", "2/36", "1/12"] },
            { q: "Spinner: 5 equal sections. P(any one)?", a: "1/5 or 20%", d: ["5%", "1/10", "50%"] },
            { q: "P(A) = 7/10. Express as %.", a: "70%", d: ["7%", "10%", "17%"] },
            { q: "Flip 2 coins. P(both Tails)?", a: "1/4", d: ["1/2", "3/4", "1"] },
            { q: "What does 'equally likely' mean?", a: "Same probability", d: ["Certain", "Impossible", "Different probabilities"] },
            { q: "Bag: 3 each of R, B, G. P(R)?", a: "1/3", d: ["3/9", "1/9", "1/2"] },
            { q: "P(rolling not 6)?", a: "5/6", d: ["1/6", "4/6", "1/2"] },
            { q: "50% as decimal?", a: "0.5", d: ["5", "0.05", "50"] },
            { q: "P(A) = 0.9. P(not A)?", a: "0.1", d: ["0.9", "1", "0"] },
            { q: "Spinner landed Green 25 times in 100. Estimate P(Green).", a: "25% or 1/4", d: ["75%", "25", "1/2"] },
            { q: "3/4 as percentage?", a: "75%", d: ["34%", "25%", "50%"] },
            { q: "Die × Die × Coin. Outcomes?", a: "72", d: ["36", "12", "24"] }
        ];
        const v = variations[(type - 31) % variations.length];
        return {
            question: v.q,
            options: [v.a, ...v.d],
            correctIndex: 0,
            explanation: `Answer: ${v.a}.`,
            topic: "Probability (Mixed)", difficulty: "Medium"
        };
    }

    return {
        question: "1/5 as a percentage?",
        options: ["20%", "5%", "15%", "50%"],
        correctIndex: 0,
        explanation: "1/5 = 0.2 = 20%.",
        topic: "Probability (Conversion)", difficulty: "Medium"
    };
};

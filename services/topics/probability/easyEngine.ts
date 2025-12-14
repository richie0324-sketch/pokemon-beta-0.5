
import { MathQuestion } from "../../../types";
import { randInt, pick, generateOptions } from "../../mathUtils";
import { MONTHS, DAYS, generateBag, fmtProb } from "./probUtils";

export const generateEasyProbability = (): MathQuestion => {
    const type = randInt(1, 100);

    if (type === 1) {
        return {
            question: "Which word best describes an event with a 0% chance?",
            options: ["Impossible", "Unlikely", "Likely", "Certain"],
            correctIndex: 0,
            explanation: "0% means the event cannot happen.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 2) {
        return {
            question: "If an event is 'Certain', what is its probability?",
            options: ["1 (or 100%)", "0 (or 0%)", "0.5 (or 50%)", "0.9"],
            correctIndex: 0,
            explanation: "A certain event always happens, so P = 1.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 3) {
        return {
            question: "Which word describes a probability of 10%?",
            options: ["Unlikely", "Likely", "Impossible", "Certain"],
            correctIndex: 0,
            explanation: "10% is close to 0, so Unlikely.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 4) {
        return {
            question: "Which word describes a probability of 90%?",
            options: ["Likely", "Unlikely", "Even Chance", "Impossible"],
            correctIndex: 0,
            explanation: "90% is close to 100%, so Likely.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 5) {
        return {
            question: "Which event has an 'Even Chance' (50-50)?",
            options: ["Flipping Heads on a fair coin", "Rolling a 6 on a die", "Winning the lottery", "The sun rising in the west"],
            correctIndex: 0,
            explanation: "A coin has 2 sides. P(Heads) = 1/2 = 50%.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 6) {
        return {
            question: "A box has Apple, Banana, Cherry, Date. What is P(Apple)?",
            options: ["1/4", "1/2", "1/3", "1"],
            correctIndex: 0,
            explanation: "1 item out of 4. P = 1/4.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 7) {
        const range = randInt(5, 8);
        return {
            question: `Pick a number from 1 to ${range}. What is P(picking 1)?`,
            options: [`1/${range}`, "1/2", `${range}`, "1"],
            correctIndex: 0,
            explanation: `Each number has equal chance. P = 1/${range}.`,
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 8) {
        return {
            question: "A bag has 5 Red and 2 Blue balls. Which colour is more likely?",
            options: ["Red", "Blue", "Equal chance", "Cannot tell"],
            correctIndex: 0,
            explanation: "Red has more balls (5 > 2).",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 9) {
        return {
            question: "What is the Sample Space for flipping a coin?",
            options: ["{Heads, Tails}", "{Heads}", "{1, 2, 3}", "{Yes, No, Maybe}"],
            correctIndex: 0,
            explanation: "Sample space lists ALL possible outcomes.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 10) {
        return {
            question: "A box has only Red balls. What is P(Blue)?",
            options: ["0 (Impossible)", "1 (Certain)", "1/2", "Cannot tell"],
            correctIndex: 0,
            explanation: "No Blue balls exist, so P(Blue) = 0.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 11) {
        const target = randInt(1, 6);
        return {
            question: `Roll a standard die. What is P(${target})?`,
            options: ["1/6", "1/2", "5/6", "1"],
            correctIndex: 0,
            explanation: "Each face has equal chance. P = 1/6.",
            topic: "Probability (Dice)", difficulty: "Easy"
        };
    }
    if (type === 12) {
        return {
            question: "Which is Impossible on a 6-sided die?",
            options: ["Rolling a 7", "Rolling a 1", "Rolling an even", "Rolling a 6"],
            correctIndex: 0,
            explanation: "Die only shows 1, 2, 3, 4, 5, 6.",
            topic: "Probability (Dice)", difficulty: "Easy"
        };
    }
    if (type === 13) {
        return {
            question: "Flip a fair coin. What is P(Heads)?",
            options: ["50%", "25%", "75%", "100%"],
            correctIndex: 0,
            explanation: "Heads is 1 of 2 outcomes. 1/2 = 50%.",
            topic: "Probability (Coins)", difficulty: "Easy"
        };
    }
    if (type === 14) {
        return {
            question: "Roll a die. Which event is Certain?",
            options: ["Rolling less than 7", "Rolling a 6", "Rolling a 0", "Rolling a 3"],
            correctIndex: 0,
            explanation: "All faces (1-6) are less than 7.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 15) {
        return {
            question: "Flip 2 coins. How many outcomes total?",
            options: ["4", "2", "3", "1"],
            correctIndex: 0,
            explanation: "2 × 2 = 4 outcomes: HH, HT, TH, TT.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 16) {
        return {
            question: "Flip 3 coins. How many outcomes total?",
            options: ["8", "6", "3", "4"],
            correctIndex: 0,
            explanation: "2 × 2 × 2 = 8 outcomes.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 17) {
        const wins = randInt(2, 4);
        const total = randInt(6, 8);
        return {
            question: `A spinner has ${total} equal sections. ${wins} are Red. What is P(Red)?`,
            options: [fmtProb(wins, total), fmtProb(total-wins, total), "1/2", fmtProb(total, wins)],
            correctIndex: 0,
            explanation: `P = ${wins}/${total}.`,
            topic: "Probability (Calc)", difficulty: "Easy"
        };
    }
    if (type === 18) {
        const n = randInt(2, 5);
        return {
            question: `A raffle has 100 tickets. You buy ${n}. What is P(win)?`,
            options: [`${n}/100`, `1/${n}`, "1/100", `${100-n}/100`],
            correctIndex: 0,
            explanation: `P = Your tickets / Total = ${n}/100.`,
            topic: "Probability (Calc)", difficulty: "Easy"
        };
    }
    if (type === 19) {
        const d = pick(DAYS);
        return {
            question: `Pick a day of the week randomly. What is P(${d})?`,
            options: ["1/7", "1/30", "1/12", "1/365"],
            correctIndex: 0,
            explanation: "7 days in a week.",
            topic: "Probability (Real World)", difficulty: "Easy"
        };
    }
    if (type === 20) {
        return {
            question: "5% chance of rain. Is rain likely?",
            options: ["No, Unlikely", "Yes, Likely", "Certain", "Impossible"],
            correctIndex: 0,
            explanation: "5% is very low.",
            topic: "Probability (Real World)", difficulty: "Easy"
        };
    }
    if (type === 21) {
        return {
            question: "Which number CANNOT be a probability?",
            options: ["1.5", "0.5", "0", "1"],
            correctIndex: 0,
            explanation: "Probabilities are between 0 and 1.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 22) {
        return {
            question: "A bag has 2 Red, 5 Blue, 3 Green. Which is LEAST likely?",
            options: ["Red", "Blue", "Green", "All equal"],
            correctIndex: 0,
            explanation: "Red has fewest (2).",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 23) {
        return {
            question: "Pick a number from 1 to 10. What is certain?",
            options: ["Result is a whole number", "Result is 5", "Result is even", "Result is odd"],
            correctIndex: 0,
            explanation: "All numbers 1-10 are whole numbers.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 24) {
        return {
            question: "What is the Sample Space for rolling a die?",
            options: ["{1, 2, 3, 4, 5, 6}", "{1, 2, 3}", "{Even, Odd}", "{1, 6}"],
            correctIndex: 0,
            explanation: "All possible outcomes: 1 through 6.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 25) {
        return {
            question: "A team won 3 out of 10 games. What fraction is this?",
            options: ["3/10", "10/3", "7/10", "3/7"],
            correctIndex: 0,
            explanation: "Wins / Total = 3/10.",
            topic: "Probability (Real World)", difficulty: "Easy"
        };
    }
    if (type === 26) {
        return {
            question: "A bag has 4 Red and 4 Blue. Are they equally likely?",
            options: ["Yes, both P = 1/2", "No, Red is more likely", "No, Blue is more likely", "Cannot tell"],
            correctIndex: 0,
            explanation: "Same count means equal probability.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 27) {
        return {
            question: "Ice cream: Chocolate, Vanilla, Strawberry. P(Chocolate)?",
            options: ["1/3", "1/2", "2/3", "1"],
            correctIndex: 0,
            explanation: "1 out of 3 flavours.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 28) {
        return {
            question: "Pick a letter from 'MATHS'. What is P(M)?",
            options: ["1/5", "1/4", "1/3", "1/2"],
            correctIndex: 0,
            explanation: "5 letters, each equally likely.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 29) {
        return {
            question: "What is an 'outcome' in probability?",
            options: ["A single result like 'Heads'", "The whole experiment", "The probability value", "The sample space"],
            correctIndex: 0,
            explanation: "An outcome is one possible result.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 30) {
        return {
            question: "Which is MORE likely?",
            options: ["P = 3/4", "P = 1/4", "P = 1/2", "P = 1/5"],
            correctIndex: 0,
            explanation: "3/4 = 0.75 is the largest.",
            topic: "Probability (Comparison)", difficulty: "Easy"
        };
    }
    if (type === 31) {
        return {
            question: "A spinner landed Red 8 times, Blue 2 times. Which was most common?",
            options: ["Red", "Blue", "Equal", "Cannot tell"],
            correctIndex: 0,
            explanation: "Red appeared 8 times, Blue only 2.",
            topic: "Probability (Frequency)", difficulty: "Easy"
        };
    }
    if (type === 32) {
        return {
            question: "Which is an 'event' (not the sample space)?",
            options: ["Rolling an even number", "{1, 2, 3, 4, 5, 6}", "The die itself", "Rolling once"],
            correctIndex: 0,
            explanation: "An event is a subset of outcomes.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 33) {
        return {
            question: "Cards A, B, C, D. What is P(A)?",
            options: ["1/4", "1/2", "3/4", "1"],
            correctIndex: 0,
            explanation: "1 card out of 4.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 34) {
        return {
            question: "How many months have 31 days?",
            options: ["7", "12", "4", "6"],
            correctIndex: 0,
            explanation: "Jan, Mar, May, Jul, Aug, Oct, Dec = 7.",
            topic: "Probability (Real World)", difficulty: "Easy"
        };
    }
    if (type === 35) {
        return {
            question: "Roll a die. Which is Impossible?",
            options: ["Rolling 0", "Rolling 1", "Rolling 3", "Rolling 6"],
            correctIndex: 0,
            explanation: "0 is not on a standard die.",
            topic: "Probability (Dice)", difficulty: "Easy"
        };
    }
    if (type === 36) {
        return {
            question: "A bag has 1 Red, 2 Blue, 3 Green. Which is most likely?",
            options: ["Green", "Blue", "Red", "All equal"],
            correctIndex: 0,
            explanation: "Green has the most (3).",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 37) {
        return {
            question: "Which word means '50% chance'?",
            options: ["Even chance", "Certain", "Impossible", "Unlikely"],
            correctIndex: 0,
            explanation: "50% is an even chance.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 38) {
        return {
            question: "P(A) = 0. What does this mean?",
            options: ["A is impossible", "A is certain", "A is likely", "A is unlikely"],
            correctIndex: 0,
            explanation: "P = 0 means it cannot happen.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 39) {
        return {
            question: "P(A) = 1. What does this mean?",
            options: ["A is certain", "A is impossible", "A is unlikely", "A is likely"],
            correctIndex: 0,
            explanation: "P = 1 means it always happens.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 40) {
        return {
            question: "Bag: 3 Red, 7 Blue. What is P(Red)?",
            options: ["3/10", "7/10", "1/2", "3/7"],
            correctIndex: 0,
            explanation: "3 out of 10 balls are Red.",
            topic: "Probability (Calc)", difficulty: "Easy"
        };
    }
    if (type === 41) {
        return {
            question: "Pick a number from {2, 4, 6, 8}. What is P(even)?",
            options: ["1 (Certain)", "0", "1/2", "1/4"],
            correctIndex: 0,
            explanation: "All numbers in the set are even.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 42) {
        return {
            question: "Pick a letter from 'BOOK'. What is P(O)?",
            options: ["2/4 or 1/2", "1/4", "3/4", "1"],
            correctIndex: 0,
            explanation: "2 O's out of 4 letters.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 43) {
        return {
            question: "Bag: 5 balls, all Green. What is P(Green)?",
            options: ["1 (Certain)", "0", "5", "1/5"],
            correctIndex: 0,
            explanation: "All balls are Green, so P = 1.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 44) {
        return {
            question: "Flip a coin. What is P(Tails)?",
            options: ["1/2", "1/4", "1", "0"],
            correctIndex: 0,
            explanation: "Tails is 1 of 2 outcomes.",
            topic: "Probability (Coins)", difficulty: "Easy"
        };
    }
    if (type === 45) {
        return {
            question: "Roll a die. What is P(less than 5)?",
            options: ["4/6", "5/6", "1/6", "2/6"],
            correctIndex: 0,
            explanation: "Numbers < 5: {1, 2, 3, 4} = 4 outcomes.",
            topic: "Probability (Dice)", difficulty: "Easy"
        };
    }
    if (type === 46) {
        return {
            question: "A spinner has 8 sections: 3 Red, 5 Blue. P(Blue)?",
            options: ["5/8", "3/8", "1/2", "1/8"],
            correctIndex: 0,
            explanation: "5 Blue out of 8.",
            topic: "Probability (Calc)", difficulty: "Easy"
        };
    }
    if (type === 47) {
        return {
            question: "Which probability shows 'very likely'?",
            options: ["0.95", "0.05", "0.5", "0"],
            correctIndex: 0,
            explanation: "0.95 is close to 1, so very likely.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 48) {
        return {
            question: "Pick a vowel from {A, E, I, O, U}. What is P(A)?",
            options: ["1/5", "1/2", "2/5", "1"],
            correctIndex: 0,
            explanation: "1 vowel out of 5.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 49) {
        return {
            question: "A bag has 6 Red and 0 Blue. P(Blue)?",
            options: ["0", "1", "6", "1/6"],
            correctIndex: 0,
            explanation: "No Blue balls exist.",
            topic: "Probability (Logic)", difficulty: "Easy"
        };
    }
    if (type === 50) {
        return {
            question: "Roll a die. What is P(odd)?",
            options: ["3/6 or 1/2", "2/6", "4/6", "1/6"],
            correctIndex: 0,
            explanation: "Odd: {1, 3, 5} = 3 outcomes.",
            topic: "Probability (Dice)", difficulty: "Easy"
        };
    }
    if (type === 51) {
        return {
            question: "Which is a valid probability?",
            options: ["0.7", "1.2", "-0.3", "2"],
            correctIndex: 0,
            explanation: "Must be between 0 and 1.",
            topic: "Probability (Basics)", difficulty: "Easy"
        };
    }
    if (type === 52) {
        return {
            question: "A netball team won 6 of 12 games. What fraction?",
            options: ["6/12 or 1/2", "12/6", "6", "1/6"],
            correctIndex: 0,
            explanation: "Wins / Total = 6/12 = 1/2.",
            topic: "Probability (Real World)", difficulty: "Easy"
        };
    }
    if (type === 53) {
        return {
            question: "Spin a spinner with 10 equal sections. P(any one section)?",
            options: ["1/10", "1/5", "1/2", "10"],
            correctIndex: 0,
            explanation: "1 section out of 10.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 54) {
        return {
            question: "Pick a suit from a deck: Hearts, Diamonds, Clubs, Spades. P(Hearts)?",
            options: ["1/4", "1/2", "1/13", "1/52"],
            correctIndex: 0,
            explanation: "4 suits, each equally likely.",
            topic: "Probability (Simple)", difficulty: "Easy"
        };
    }
    if (type === 55) {
        return {
            question: "Which event is LESS likely?",
            options: ["P = 1/10", "P = 1/5", "P = 1/2", "P = 3/4"],
            correctIndex: 0,
            explanation: "1/10 = 0.1 is the smallest.",
            topic: "Probability (Comparison)", difficulty: "Easy"
        };
    }
    if (type <= 100) {
        const variations = [
            { q: "Bag: 4 Red, 2 Blue, 4 Green. P(Red)?", a: "4/10", d: ["2/10", "1/2", "4/6"] },
            { q: "Bag: 2 Red, 2 Blue. P(Red)?", a: "1/2", d: ["1/4", "2/4", "1"] },
            { q: "Roll a die. P(greater than 2)?", a: "4/6", d: ["2/6", "5/6", "1/6"] },
            { q: "Roll a die. P(at most 4)?", a: "4/6", d: ["2/6", "1/6", "5/6"] },
            { q: "Pick from {1, 2, 3}. P(2)?", a: "1/3", d: ["1/2", "2/3", "1"] },
            { q: "Flip a coin twice. P(both Heads)?", a: "1/4", d: ["1/2", "1", "2/4"] },
            { q: "Which is an unlikely probability?", a: "0.05", d: ["0.5", "0.9", "1"] },
            { q: "Which is a likely probability?", a: "0.85", d: ["0.1", "0.5", "0"] },
            { q: "Pick a month. P(starts with J)?", a: "3/12 or 1/4", d: ["1/12", "2/12", "4/12"] },
            { q: "A cricket team lost 4 of 10 games. P(loss)?", a: "4/10", d: ["6/10", "1/10", "10/4"] },
            { q: "Bag: all 5 balls are Blue. P(Red)?", a: "0", d: ["1", "1/5", "5"] },
            { q: "Pick from {A, B, C, D, E}. P(A)?", a: "1/5", d: ["1/4", "1/2", "2/5"] },
            { q: "Spinner: 6 sections, 2 Red. P(Red)?", a: "2/6 or 1/3", d: ["4/6", "1/6", "1/2"] },
            { q: "Roll a die. P(1 or 6)?", a: "2/6 or 1/3", d: ["1/6", "5/6", "1/2"] },
            { q: "Bag: 3 Red, 3 Blue, 3 Green. P(Red)?", a: "3/9 or 1/3", d: ["1/9", "6/9", "1/2"] },
            { q: "Pick a day. P(weekend)?", a: "2/7", d: ["5/7", "1/7", "1/2"] },
            { q: "Bag: 10 balls, 1 is Gold. P(Gold)?", a: "1/10", d: ["9/10", "1/2", "10"] },
            { q: "Roll a die. P(even or odd)?", a: "1 (Certain)", d: ["0", "1/2", "1/3"] },
            { q: "Spinner: 5 sections, 0 Red. P(Red)?", a: "0 (Impossible)", d: ["1/5", "1", "5"] },
            { q: "Bag: 7 Red, 3 Blue. Total balls?", a: "10", d: ["7", "3", "4"] },
            { q: "A jar has 8 lollies. P(picking any one)?", a: "1/8", d: ["8", "1/2", "1"] },
            { q: "Pick a letter from 'SCHOOL'. P(O)?", a: "2/6 or 1/3", d: ["1/6", "3/6", "1/2"] },
            { q: "Roll a die. P(5 or 6)?", a: "2/6 or 1/3", d: ["1/6", "4/6", "5/6"] },
            { q: "Bag: 2 Red, 8 Blue. Which more likely?", a: "Blue", d: ["Red", "Equal", "Cannot tell"] },
            { q: "A footy team won 7 of 10. What is P(win)?", a: "7/10", d: ["3/10", "1/10", "10/7"] },
            { q: "Pick from {2, 4, 6}. P(even)?", a: "1 (Certain)", d: ["0", "1/3", "2/3"] },
            { q: "Roll a die. P(prime)?", a: "3/6 or 1/2", d: ["2/6", "4/6", "1/6"] },
            { q: "Bag: 5 Red, 0 Blue. P(Red)?", a: "1 (Certain)", d: ["0", "5", "1/5"] },
            { q: "Which word means P = 0?", a: "Impossible", d: ["Certain", "Likely", "Unlikely"] },
            { q: "Flip a coin. Sample space size?", a: "2", d: ["1", "4", "3"] },
            { q: "Pick a number 1-5. P(3)?", a: "1/5", d: ["3/5", "1/3", "1/2"] },
            { q: "Spinner: 4 equal sections. P(any one)?", a: "1/4", d: ["4", "1/2", "1"] },
            { q: "A bag has only Green balls. P(Green)?", a: "1 (Certain)", d: ["0", "1/2", "Cannot tell"] },
            { q: "Roll a die. P(at least 1)?", a: "1 (Certain)", d: ["0", "1/6", "5/6"] },
            { q: "Pick a vowel from 'APPLE'. P(A)?", a: "2/5", d: ["1/5", "3/5", "1/2"] },
            { q: "Which is NOT a probability?", a: "-0.2", d: ["0.2", "0", "1"] },
            { q: "Bag: 3 Red, 6 Blue. P(Red)?", a: "3/9 or 1/3", d: ["6/9", "1/9", "1/2"] },
            { q: "Pick from {A, B, C}. P(not A)?", a: "2/3", d: ["1/3", "1/2", "1"] },
            { q: "Roll a die. P(not 6)?", a: "5/6", d: ["1/6", "4/6", "1/2"] },
            { q: "Bag: 4 Red, 4 Blue. P(Red)?", a: "4/8 or 1/2", d: ["4", "1/4", "8"] },
            { q: "A spinner landed Blue 7/10 times. P(Blue) estimate?", a: "7/10", d: ["3/10", "1/10", "1/2"] },
            { q: "Pick a coin: 5c, 10c, 20c, 50c, $1, $2. P(50c)?", a: "1/6", d: ["50", "1/2", "5/6"] },
            { q: "Roll a die. P(less than 7)?", a: "1 (Certain)", d: ["6/6", "0", "5/6"] },
            { q: "Pick a number 1-10. P(less than 11)?", a: "1 (Certain)", d: ["10/11", "0", "9/10"] },
            { q: "Which is more likely: P = 2/3 or P = 1/2?", a: "P = 2/3", d: ["P = 1/2", "Equal", "Cannot tell"] }
        ];
        const v = variations[(type - 56) % variations.length];
        const options = [v.a, ...v.d];
        return {
            question: v.q,
            options: options,
            correctIndex: 0,
            explanation: `The answer is ${v.a}.`,
            topic: "Probability (Mixed)", difficulty: "Easy"
        };
    }

    return {
        question: "Which number is a valid probability?",
        options: ["0.5", "1.5", "-0.5", "2"],
        correctIndex: 0,
        explanation: "Probabilities must be between 0 and 1.",
        topic: "Probability (Basics)", difficulty: "Easy"
    };
};

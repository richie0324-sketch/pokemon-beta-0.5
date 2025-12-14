
import { Difficulty, MathQuestion } from "../../../types";
import { generateEasyProbability } from "./easyEngine";
import { generateMediumProbability } from "./mediumEngine";
import { generateHardProbability } from "./hardEngine";

export const generateProbabilityQuestion = (difficulty: Difficulty): MathQuestion => {
    let q: MathQuestion;

    switch (difficulty) {
        case 'Easy': 
            q = generateEasyProbability(); 
            break;
        case 'Medium': 
            q = generateMediumProbability(); 
            break;
        case 'Hard': 
            q = generateHardProbability('Hard'); 
            break;
        case 'Challenge': 
            q = generateHardProbability('Challenge'); 
            break;
        default: 
            q = generateEasyProbability();
    }

    // --- SAFETY & SHUFFLING ---
    // (Similar logic to Linear Engine to ensure distractor arrays are shuffled and index is correct)

    // 1. Identify correct answer (Handle cases where engines return custom objects)
    let correctText = "";
    if ((q as any).correct) {
        correctText = (q as any).correct;
    } else if (q.correctIndex >= 0 && q.correctIndex < q.options.length) {
        correctText = q.options[q.correctIndex];
    } else {
        correctText = q.options[0];
    }

    // 2. Dedupe
    const uniqueOptions = Array.from(new Set(q.options));
    
    // 3. Shuffle
    for (let i = uniqueOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueOptions[i], uniqueOptions[j]] = [uniqueOptions[j], uniqueOptions[i]];
    }

    // 4. Reassign
    q.options = uniqueOptions;
    q.correctIndex = uniqueOptions.indexOf(correctText);

    // 5. Final Fallback
    if (q.correctIndex === -1) {
        q.options[0] = correctText;
        q.correctIndex = 0;
    }

    return q;
};

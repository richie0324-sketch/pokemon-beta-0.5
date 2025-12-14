
import { MathQuestion, Difficulty } from "../../../types";
import { generateCoordinateQuestion } from "./coordinateEngine";
import { generateAlgebraQuestion } from "./algebraEngine";
import { generateSlopeQuestion } from "./slopeEngine";
import { generateChallengeQuestion } from "./challengeEngine";

const WEIGHTS: Record<Difficulty, number[]> = {
    'Easy':      [0.4, 0.4, 0.2],
    'Medium':    [0.2, 0.4, 0.4],
    'Hard':      [0.1, 0.2, 0.7],
    'Challenge': [0.0, 0.1, 0.4]
};

export const generateLinearQuestion = (difficulty: Difficulty): MathQuestion => {
    const r = Math.random();
    const w = WEIGHTS[difficulty];
    
    let q: MathQuestion;

    if (difficulty === 'Challenge') {
        if (r < 0.5) {
            q = generateChallengeQuestion();
        } else if (r < w[1] + 0.5) {
            q = generateAlgebraQuestion(difficulty);
        } else {
            q = generateSlopeQuestion(difficulty);
        }
    } else {
        if (r < w[0]) {
            q = generateCoordinateQuestion(difficulty);
        } else if (r < w[0] + w[1]) {
            q = generateAlgebraQuestion(difficulty);
        } else {
            q = generateSlopeQuestion(difficulty);
        }
    }

    let correctText = "";
    if (q.correctIndex >= 0 && q.correctIndex < q.options.length) {
        correctText = q.options[q.correctIndex];
    } else {
        correctText = q.options[0];
    }

    const uniqueOptions = Array.from(new Set(q.options.filter(opt => typeof opt === 'string')));
    
    for (let i = uniqueOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueOptions[i], uniqueOptions[j]] = [uniqueOptions[j], uniqueOptions[i]];
    }
    
    q.options = uniqueOptions;
    q.correctIndex = uniqueOptions.indexOf(correctText);

    if (q.correctIndex === -1) {
        console.warn("Correct answer lost during shuffle. Forcing option 0.");
        q.options[0] = correctText;
        q.correctIndex = 0;
    }
    
    return q;
};


import { Difficulty, MathQuestion } from "../../../types";
import { randInt, pick, randExclude, simplifyFraction, formatAsFractionString } from "../../mathUtils";
import { fmtLine, randPoint, calcSlope, fmtPoint, Point } from "./linearUtils";

export const generateSlopeQuestion = (difficulty: Difficulty): MathQuestion => {
    
    if (difficulty === 'Easy') {
        const type = randInt(1, 70); // Increased from 40 to 70

        // --- NEW SUPER-EASY QUESTIONS ---
        if (type <= 5) {
            return {
                question: "What does the 'gradient' of a line measure?",
                options: ["Its steepness", "Its length", "Its starting point", "Its color"],
                correctIndex: 0,
                explanation: "The gradient is a number that tells us how steep a line is.",
                topic: "Linear (Gradient)", difficulty
            };
        }
        if (type <= 10) {
            return {
                question: "A line that goes UP from left to right has a ___ gradient.",
                options: ["Positive", "Negative", "Zero", "No"],
                correctIndex: 0,
                explanation: "An upward slope from left to right indicates a positive gradient.",
                topic: "Linear (Gradient)", difficulty
            };
        }
        if (type <= 15) {
            return {
                question: "A flat, horizontal line has a gradient of...",
                options: ["0", "1", "10", "Undefined"],
                correctIndex: 0,
                explanation: "A horizontal line has no 'rise', so its gradient (Rise/Run) is 0.",
                topic: "Linear (Gradient)", difficulty
            };
        }
        if (type <= 20) {
            return {
                question: "In the equation y = mx + c, which letter represents the gradient?",
                options: ["m", "y", "x", "c"],
                correctIndex: 0,
                explanation: "'m' is the standard variable used to represent the gradient in a linear equation.",
                topic: "Linear (Gradient)", difficulty
            };
        }
        if (type <= 25) {
            return {
                question: "In the equation y = mx + c, which letter represents the y-intercept?",
                options: ["c", "y", "x", "m"],
                correctIndex: 0,
                explanation: "'c' is the standard variable for the y-intercept, which is where the line crosses the y-axis.",
                topic: "Linear (Gradient)", difficulty
            };
        }
        if (type <= 30) {
            return {
                question: "In Australia, another common word for 'gradient' is...",
                options: ["Slope", "Intercept", "Axis", "Line"],
                correctIndex: 0,
                explanation: "The terms 'gradient' and 'slope' are often used interchangeably to describe the steepness of a line.",
                topic: "Linear (Gradient)", difficulty
            };
        }

        // --- EXISTING EASY QUESTIONS (renumbered) ---
        if (type <= 36) { // was 6
            const m = randInt(2, 5);
            const c = randInt(1, 9);
            const eq = `y = ${m}x + ${c}`;
            return {
                question: `Identify the gradient in: ${eq}`,
                options: [m.toString(), c.toString(), (m + c).toString(), "x"],
                correctIndex: 0,
                explanation: "The gradient is the number in front of x.",
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 42) { // was 12
            const m = randInt(2, 5);
            const c = randInt(1, 9);
            const eq = `y = ${m}x + ${c}`;
            return {
                question: `Identify the y-intercept in: ${eq}`,
                options: [c.toString(), m.toString(), (m + c).toString(), "0"],
                correctIndex: 0,
                explanation: "The y-intercept is the number without x.",
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 47) { // was 17
            const m = randInt(2, 6);
            const c = randInt(1, 8);
            return {
                question: `Is the gradient of y = ${m}x + ${c} positive, negative, or zero?`,
                options: ["Positive", "Negative", "Zero", "Cannot tell"],
                correctIndex: 0,
                explanation: `The gradient is ${m}, which is greater than 0, so positive.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 52) { // was 22
            const c = randInt(1, 10);
            return {
                question: `Is the gradient of y = ${c} positive, negative, or zero?`,
                options: ["Zero", "Positive", "Negative", "Cannot tell"],
                correctIndex: 0,
                explanation: "There is no x term, so the gradient is 0.",
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 58) { // was 28
            const m = randInt(2, 6);
            const c = randInt(1, 8);
            return {
                question: `Does y = ${m}x + ${c} go up or down as x increases?`,
                options: ["Goes up", "Goes down", "Stays flat", "Cannot tell"],
                correctIndex: 0,
                explanation: `Positive gradient (${m}) means the line goes up.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 64) { // was 34
            const m = randInt(1, 5);
            const c = randInt(1, 8);
            return {
                question: `What does the gradient tell us about y = ${m}x + ${c}?`,
                options: ["y increases as x increases", "y decreases as x increases", "y stays the same", "Cannot tell"],
                correctIndex: 0,
                explanation: `Positive gradient (${m}) means y goes up when x goes up.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        const m = randInt(2, 5);
        const c = randInt(1, 8);
        return {
            question: `What is the gradient of y = ${m}x + ${c}?`,
            options: [m.toString(), c.toString(), (m + c).toString(), "1"],
            correctIndex: 0,
            explanation: `In y = mx + c, the gradient is m = ${m}.`,
            topic: "Linear (Gradient)", difficulty
        };
    }

    if (difficulty === 'Medium') {
        const type = randInt(1, 63); // Increased from 60

        if (type <= 5) {
            const m = -randInt(2, 6);
            const c = randInt(1, 10);
            return {
                question: `Is the gradient of y = ${m}x + ${c} positive, negative, or zero?`,
                options: ["Negative", "Positive", "Zero", "No gradient"],
                correctIndex: 0,
                explanation: `The gradient is ${m}, which is less than 0, so negative.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 10) {
            const m = -randInt(2, 5);
            const c = randInt(5, 15);
            return {
                question: `Does y = ${m}x + ${c} go up or down as x increases?`,
                options: ["Goes down", "Goes up", "Stays flat", "Cannot tell"],
                correctIndex: 0,
                explanation: `Negative gradient (${m}) means the line goes down.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 15) {
            const m = randExclude(-6, 6, [0, 1]);
            const c = randExclude(-6, 6, [0]);
            const cSign = c > 0 ? '+' : '-';
            const eq = `y = ${m}x ${cSign} ${Math.abs(c)}`;
            return {
                question: `Identify the gradient in: ${eq}`,
                options: [m.toString(), c.toString(), (-m).toString(), Math.abs(c).toString()],
                correctIndex: 0,
                explanation: "The gradient is the coefficient of x.",
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 20) {
            const rise = randInt(2, 8);
            const run = randInt(2, 4);
            const gradient = rise / run;
            const gradientStr = Number.isInteger(gradient) ? gradient.toString() : simplifyFraction(rise, run);
            return {
                question: `Rise = ${rise}, Run = ${run}. What is the gradient?`,
                options: [gradientStr, simplifyFraction(run, rise), (rise * run).toString(), (rise + run).toString()],
                correctIndex: 0,
                explanation: `Gradient = rise ÷ run = ${rise} ÷ ${run} = ${gradientStr}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 25) {
            const rise = -randInt(2, 6);
            const run = randInt(2, 4);
            const gradient = rise / run;
            const gradientStr = Number.isInteger(gradient) ? gradient.toString() : simplifyFraction(rise, run);
            return {
                question: `Rise = ${rise}, Run = ${run}. What is the gradient?`,
                options: [gradientStr, simplifyFraction(-rise, run), Math.abs(gradient).toString(), "0"],
                correctIndex: 0,
                explanation: `Gradient = ${rise} ÷ ${run} = ${gradientStr}. Negative rise means negative gradient.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 30) {
            const p1 = randPoint(-5, 5);
            const run = pick([1, 2, -1, -2]);
            const mVal = randExclude(-3, 3, [0]);
            const rise = run * mVal;
            const p2 = { x: p1.x + run, y: p1.y + rise };
            return {
                question: `Gradient between ${fmtPoint(p1)} and ${fmtPoint(p2)}?`,
                options: [mVal.toString(), (-mVal).toString(), (mVal + 1).toString(), "0"],
                correctIndex: 0,
                explanation: `Gradient = (${p2.y}-${p1.y}) ÷ (${p2.x}-${p1.x}) = ${rise} ÷ ${run} = ${mVal}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 35) {
            const m1 = randInt(2, 4);
            const m2 = randInt(5, 8);
            const steeper = m2 > m1 ? 1 : 0;
            const lines = [`y = ${m1}x + 3`, `y = ${m2}x + 1`];
            return {
                question: `Which is STEEPER: ${lines[0]} or ${lines[1]}?`,
                options: [lines[steeper], lines[1 - steeper], "Same steepness", "Cannot compare"],
                correctIndex: 0,
                explanation: `Larger gradient = steeper. ${m2} > ${m1}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 40) {
            const rate = randInt(2, 8);
            const context = pick([
                `increases by ${rate} per hour`,
                `grows by $${rate} per week`,
                `rises by ${rate} metres per minute`
            ]);
            return {
                question: `A quantity ${context}. What is the gradient?`,
                options: [rate.toString(), (-rate).toString(), (rate * 2).toString(), "0"],
                correctIndex: 0,
                explanation: `Rate of change = gradient = ${rate}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 45) {
            const rate = randInt(2, 8);
            const context = pick([
                `decreases by ${rate} per hour`,
                `loses $${rate} per week`,
                `drops ${rate} metres per minute`
            ]);
            return {
                question: `A quantity ${context}. What is the gradient?`,
                options: [(-rate).toString(), rate.toString(), (rate * 2).toString(), "0"],
                correctIndex: 0,
                explanation: `Decreasing = negative gradient = -${rate}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 50) {
            const m1 = -randInt(2, 4);
            const m2 = -randInt(5, 8);
            const steeper = Math.abs(m2) > Math.abs(m1) ? 1 : 0;
            const lines = [`y = ${m1}x + 5`, `y = ${m2}x + 2`];
            return {
                question: `Which falling line is STEEPER?`,
                options: [lines[steeper], lines[1 - steeper], "Same", "Cannot compare"],
                correctIndex: 0,
                explanation: `Larger |gradient| = steeper. |${m2}| > |${m1}|.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 55) {
            const p1: Point = { x: randInt(0, 3), y: randInt(0, 5) };
            const p2: Point = { x: randInt(4, 7), y: randInt(6, 12) };
            const p3: Point = { x: randInt(8, 10), y: randInt(0, 4) };
            const m12 = calcSlope(p1, p2).val;
            const m23 = calcSlope(p2, p3).val;
            const m13 = calcSlope(p1, p3).val;
            const gradients = [m12, m23, m13];
            const maxGradient = Math.max(...gradients);
            const pairs = [`${fmtPoint(p1)} to ${fmtPoint(p2)}`, `${fmtPoint(p2)} to ${fmtPoint(p3)}`, `${fmtPoint(p1)} to ${fmtPoint(p3)}`];
            const maxIdx = gradients.indexOf(maxGradient);
            return {
                question: `Which pair gives LARGEST gradient?`,
                options: [pairs[maxIdx], pairs[(maxIdx + 1) % 3], pairs[(maxIdx + 2) % 3], "All equal"],
                correctIndex: 0,
                explanation: `Calculate each. Largest is ${maxGradient.toFixed(2)}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }
        
        // --- NEW MEDIUM ---
        if(type <= 58) {
            const m = -randInt(2, 5);
            const c = randInt(1, 10);
            return {
                question: `What is the gradient of the line y = ${c} ${m}x?`,
                options: [m.toString(), c.toString(), (c+m).toString(), "1"],
                correctIndex: 0,
                explanation: `The gradient 'm' is the number multiplied by x, regardless of its position in the equation.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if(type <= 61) {
            const m = randInt(2, 5);
            const p = randPoint(-5, 5);
            const c = p.y - m * p.x;
            return {
                question: `A line has a gradient of ${m} and passes through ${fmtPoint(p)}. What is its y-intercept?`,
                options: [c.toString(), p.y.toString(), m.toString(), (p.y - m).toString()],
                correctIndex: 0,
                explanation: `Use c = y - mx. So, c = ${p.y} - ${m} * ${p.x} = ${c}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 63) {
            const p1 = randPoint(-5, 5);
            const p2 = randPoint(-5, 5);
            while(p1.x === p2.x) { p2.x = randInt(-5, 5); }
            const gradient = calcSlope(p1, p2).val;
            const answer = gradient > 0 ? "Rises" : (gradient < 0 ? "Falls" : "Is Horizontal");
            return {
                question: `Does the line passing through ${fmtPoint(p1)} and ${fmtPoint(p2)} rise or fall?`,
                options: [answer, answer === "Rises" ? "Falls" : "Rises", "Is Horizontal", "Is Vertical"],
                correctIndex: 0,
                explanation: `The gradient is ${gradient.toFixed(2)}. A ${gradient > 0 ? 'positive' : 'negative'} gradient means the line ${answer.toLowerCase()}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        const dy1 = randInt(2, 4);
        const dx1 = randInt(1, 2);
        const dy2 = randInt(5, 8);
        const dx2 = randInt(2, 3);
        const r1 = dy1 / dx1;
        const r2 = dy2 / dx2;
        const faster = r1 > r2 ? 0 : 1;
        const rates = [`change in y=${dy1}, change in x=${dx1}`, `change in y=${dy2}, change in x=${dx2}`];
        return {
            question: `Which has FASTER rate: ${rates[0]} or ${rates[1]}?`,
            options: [rates[faster], rates[1 - faster], "Equal", "Cannot compare"],
            correctIndex: 0,
            explanation: `Rate 1: ${r1.toFixed(2)}, Rate 2: ${r2.toFixed(2)}.`,
            topic: "Linear (Gradient)", difficulty
        };
    }

    if (difficulty === 'Hard') {
        const type = randInt(1, 29); // Increased from 25

        if (type <= 5) {
            const p1 = randPoint(-5, 5);
            const p2 = randPoint(-5, 5);
            while (p2.x === p1.x) { p2.x = randInt(-5, 5); }
            const gradient = calcSlope(p1, p2);
            const gradientStr = simplifyFraction(gradient.num, gradient.den);
            return {
                question: `Gradient between ${fmtPoint(p1)} and ${fmtPoint(p2)}?`,
                options: [gradientStr, simplifyFraction(gradient.den, gradient.num), simplifyFraction(-gradient.num, gradient.den), simplifyFraction(gradient.num, -gradient.den)],
                correctIndex: 0,
                explanation: `Gradient = ${gradient.num}/${gradient.den} = ${gradientStr}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 9) {
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            return {
                question: `Which line is PARALLEL to y = ${m}x + ${c}?`,
                options: [fmtLine(m, c - 3), fmtLine(-m, c), fmtLine(m + 1, c), `y = x + ${c}`],
                correctIndex: 0,
                explanation: "Parallel lines have equal gradients.",
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 13) {
            const m = randInt(2, 5);
            const perpGradient = simplifyFraction(-1, m);
            return {
                question: `Gradient PERPENDICULAR to m = ${m}?`,
                options: [perpGradient, simplifyFraction(1, m), (-m).toString(), m.toString()],
                correctIndex: 0,
                explanation: `Perpendicular gradient = -1/m = ${perpGradient}.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 17) {
            const m1 = randInt(2, 4);
            const m2 = m1;
            const m3 = m1 + randInt(1, 3);
            const c1 = randInt(1, 5);
            const c2 = randInt(6, 10);
            const c3 = randInt(1, 5);
            const lines = [fmtLine(m1, c1), fmtLine(m2, c2), fmtLine(m3, c3)];
            return {
                question: `Which two are PARALLEL? ${lines.join(", ")}`,
                options: [`${lines[0]} and ${lines[1]}`, `${lines[0]} and ${lines[2]}`, `${lines[1]} and ${lines[2]}`, "None"],
                correctIndex: 0,
                explanation: `Same gradient (${m1}) = parallel.`,
                topic: "Linear (Gradient)", difficulty
            };
        }
        
        // --- NEW HARD ---
        if(type <= 20) {
            const p1 = randPoint(-4, 4);
            const p2 = { x: p1.x + randExclude(-3, 3, [0]), y: p1.y + randExclude(-3, 3, [0]) };
            const { val, num, den } = calcSlope(p1, p2);
            const c = p1.y - val * p1.x;
            const eq = fmtLine(val, c);
            return {
                question: `Find the equation of the line that passes through ${fmtPoint(p1)} and ${fmtPoint(p2)}.`,
                options: [eq, fmtLine(val, c + 1), fmtLine(-val, c), fmtLine(den/num, c)],
                correctIndex: 0,
                explanation: `First, find the gradient m = ${simplifyFraction(num, den)}. Then find c using c = y - mx.`,
                topic: "Linear (Gradient)", difficulty
            };
        }
        
        if (type <= 23) {
            const m = randInt(2, 5);
            const c1 = randInt(1, 10);
            const p = randPoint(-5, 5);
            const c2 = p.y - m * p.x;
            const eq = fmtLine(m, c2);
            return {
                question: `Find the equation of a line PARALLEL to ${fmtLine(m, c1)} that passes through ${fmtPoint(p)}.`,
                options: [eq, fmtLine(m, c1), fmtLine(-m, c2), fmtLine(m+1, c2)],
                correctIndex: 0,
                explanation: `Parallel lines have the same gradient (${m}). Use the new point to find the new y-intercept c.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if(type <= 26) {
            const m = randInt(2, 4);
            const m_perp = -1/m;
            const p = randPoint(-5, 5);
            const c = p.y - m_perp * p.x;
            const eq = fmtLine(m_perp, c);
            return {
                question: `Find the equation of a line PERPENDICULAR to ${fmtLine(m, 1)} that passes through ${fmtPoint(p)}.`,
                options: [eq, fmtLine(m, c), fmtLine(1/m, c), fmtLine(m_perp, 1)],
                correctIndex: 0,
                explanation: `The perpendicular gradient is the negative reciprocal (-1/m). Then find the new y-intercept.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 29) {
            const m = randInt(2, 5);
            const c = m * randInt(1, 4); // ensure integer intercept
            const x_intercept = -c / m;
            return {
                question: `What is the x-intercept of the line ${fmtLine(m, c)}?`,
                options: [`(${x_intercept}, 0)`, `(0, ${c})`, `(${m}, 0)`, `(0, 0)`],
                correctIndex: 0,
                explanation: `The x-intercept is where y=0. Solve 0 = ${m}x + ${c} for x.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        if (type <= 21) {
            const m1 = -randInt(3, 8);
            const m2 = -randInt(3, 8);
            const m3 = -randInt(3, 8);
            const c1 = randInt(50, 100);
            const c2 = randInt(50, 100);
            const c3 = randInt(50, 100);
            const lines = [fmtLine(m1, c1), fmtLine(m2, c2), fmtLine(m3, c3)];
            const minM = Math.min(m1, m2, m3);
            const fastIdx = [m1, m2, m3].indexOf(minM);
            return {
                question: `Which FALLS fastest? ${lines.join(", ")}`,
                options: [lines[fastIdx], lines[(fastIdx + 1) % 3], lines[(fastIdx + 2) % 3], "All equal"],
                correctIndex: 0,
                explanation: `Most negative gradient (${minM}) = fastest fall.`,
                topic: "Linear (Gradient)", difficulty
            };
        }

        const m1 = randInt(2, 6);
        const m2 = randInt(2, 6);
        const m3 = randInt(2, 6);
        const c1 = randInt(1, 10);
        const c2 = randInt(1, 10);
        const c3 = randInt(1, 10);
        const lines = [fmtLine(m1, c1), fmtLine(m2, c2), fmtLine(m3, c3)];
        const maxM = Math.max(m1, m2, m3);
        const steepIdx = [m1, m2, m3].indexOf(maxM);
        return {
            question: `Which is STEEPEST? ${lines.join(", ")}`,
            options: [lines[steepIdx], lines[(steepIdx + 1) % 3], lines[(steepIdx + 2) % 3], "All equal"],
            correctIndex: 0,
            explanation: `Largest |gradient| (${maxM}) = steepest.`,
            topic: "Linear (Gradient)", difficulty
        };
    }

    const p1 = randPoint(-4, 4);
    const p2 = randPoint(-4, 4);
    while (p2.x === p1.x) { p2.x = randInt(-4, 4); }
    const gradient = calcSlope(p1, p2);
    const gradientStr = simplifyFraction(gradient.num, gradient.den);
    const newX = randInt(p2.x + 1, p2.x + 5);
    const newY = p1.y + gradient.val * (newX - p1.x);
    const newYStr = formatAsFractionString(newY);
    return {
        question: `Given ${fmtPoint(p1)} and ${fmtPoint(p2)}, find y when x = ${newX}.`,
        options: [newYStr, (newY + 2).toString(), (newY - 2).toString(), gradient.num.toString()],
        correctIndex: 0,
        explanation: `Gradient = ${gradientStr}. y = ${p1.y} + ${gradientStr} × (${newX} - ${p1.x}) = ${newYStr}.`,
        topic: "Linear (Gradient)", difficulty
    };
};

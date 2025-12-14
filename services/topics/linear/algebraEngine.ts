
import { Difficulty, MathQuestion } from "../../../types";
import { randInt, pick, randExclude, simplifyFraction } from "../../mathUtils";
import { fmtLine } from "./linearUtils";

export const generateAlgebraQuestion = (difficulty: Difficulty): MathQuestion => {
    
    if (difficulty === 'Easy') {
        const type = randInt(1, 75); // Increased from 50 to 75

        // --- NEW SUPER-EASY QUESTIONS ---
        if (type <= 5) {
            const m = randExclude(2, 9, [0]);
            return {
                question: `In the term '${m}x', what is the coefficient?`,
                options: [m.toString(), "x", `${m}x`, "0"],
                correctIndex: 0,
                explanation: "The coefficient is the number multiplied by the variable.",
                topic: "Linear (Algebra)", difficulty
            };
        }
        if (type <= 10) {
            const m = randInt(2, 8);
            const c = randInt(1, 10);
            const y = m * 1 + c;
            return {
                question: `If y = ${m}x + ${c}, what is y when x = 1?`,
                options: [y.toString(), m.toString(), c.toString(), (m+c+1).toString()],
                correctIndex: 0,
                explanation: `Substitute x=1 into the equation: y = ${m}(1) + ${c} = ${y}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }
        if (type <= 15) {
            const m = randInt(2, 5);
            const c = randInt(1, 9);
            return {
                question: `Which of these is a linear equation?`,
                options: [`y = ${m}x + ${c}`, `y = x^2 + ${c}`, `y = ${m}/x`, `xy = ${c}`],
                correctIndex: 0,
                explanation: "A linear equation has the variable 'x' to the power of 1, not squared or in the denominator.",
                topic: "Linear (Algebra)", difficulty
            };
        }
        if (type <= 20) {
            const m = randInt(2, 9);
            const c = randInt(1, 20);
            return {
                question: `In the general form y = mx + c, what does 'c' represent?`,
                options: ["The y-intercept", "The gradient", "The x-coordinate", "The variable"],
                correctIndex: 0,
                explanation: "'c' is the constant term, which represents the y-intercept, where the line crosses the y-axis.",
                topic: "Linear (Algebra)", difficulty
            };
        }
        if (type <= 25) {
            const a = randInt(2, 5);
            const b = randInt(2, 5);
            return {
                question: `Simplify: ${a}x + ${b}x`,
                options: [`${a + b}x`, `${a * b}x`, `${a+b}x^2`, `${a}x`],
                correctIndex: 0,
                explanation: `Since both terms have 'x', you can add the coefficients: ${a} + ${b} = ${a + b}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        // --- EXISTING EASY QUESTIONS (renumbered) ---
        if (type <= 31) { // was 6
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            const x = randInt(1, 5);
            const y = m * x + c;
            return {
                question: `If y = ${m}x + ${c}, what is y when x = ${x}?`,
                options: [y.toString(), (m * x).toString(), c.toString(), (y + 1).toString()],
                correctIndex: 0,
                explanation: `y = ${m} × ${x} + ${c} = ${m * x} + ${c} = ${y}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 36) { // was 11
            const m = randInt(2, 4);
            const c = randInt(1, 10);
            const y = m * 0 + c;
            return {
                question: `If y = ${m}x + ${c}, what is y when x = 0?`,
                options: [y.toString(), m.toString(), "0", (m + c).toString()],
                correctIndex: 0,
                explanation: `When x = 0, y = ${m} × 0 + ${c} = ${c}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 41) { // was 16
            const a = randInt(2, 5);
            const b = randInt(2, 6);
            const correct = `${a}x + ${a * b}`;
            return {
                question: `Expand: ${a}(x + ${b})`,
                options: [correct, `${a}x + ${b}`, `${a + b}x`, `x + ${a * b}`],
                correctIndex: 0,
                explanation: `${a} × x = ${a}x, ${a} × ${b} = ${a * b}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 46) { // was 21
            const a = randInt(2, 5);
            const b = randInt(2, 6);
            const correct = `${a}x - ${a * b}`;
            return {
                question: `Expand: ${a}(x - ${b})`,
                options: [correct, `${a}x - ${b}`, `${a - b}x`, `x - ${a * b}`],
                correctIndex: 0,
                explanation: `${a} × x = ${a}x, ${a} × (-${b}) = -${a * b}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 52) { // was 27
            const a = randInt(2, 8);
            const b = randInt(2, 8);
            return {
                question: `Simplify: ${a}x + ${b}x`,
                options: [`${a + b}x`, `${a * b}x`, `${a + b}`, `${a}x`],
                correctIndex: 0,
                explanation: `${a} + ${b} = ${a + b}. Answer: ${a + b}x.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 58) { // was 33
            const a = randInt(5, 10);
            const b = randInt(2, 4);
            return {
                question: `Simplify: ${a}x - ${b}x`,
                options: [`${a - b}x`, `${a + b}x`, `${a - b}`, `${b}x`],
                correctIndex: 0,
                explanation: `${a} - ${b} = ${a - b}. Answer: ${a - b}x.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 63) { // was 38
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            return {
                question: `In y = ${m}x + ${c}, what is the coefficient of x?`,
                options: [m.toString(), c.toString(), (m + c).toString(), "x"],
                correctIndex: 0,
                explanation: `The coefficient of x is the number in front of x: ${m}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 68) { // was 43
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            return {
                question: `In y = ${m}x + ${c}, what is the constant term?`,
                options: [c.toString(), m.toString(), (m + c).toString(), "0"],
                correctIndex: 0,
                explanation: `The constant term is the number without x: ${c}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 72) { // was 47
            const m = randInt(2, 4);
            const c = randInt(1, 8);
            const x = randInt(2, 5);
            const y = m * x + c;
            return {
                question: `Calculate ${m} × ${x} + ${c}`,
                options: [y.toString(), (m * x).toString(), (m + x + c).toString(), c.toString()],
                correctIndex: 0,
                explanation: `${m} × ${x} + ${c} = ${m * x} + ${c} = ${y}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        const a = randInt(2, 5);
        const b = randInt(2, 5);
        const c = randInt(2, 5);
        return {
            question: `Simplify: ${a}x + ${b}x + ${c}x`,
            options: [`${a + b + c}x`, `${a * b * c}x`, `${a + b + c}`, `${a}x`],
            correctIndex: 0,
            explanation: `${a} + ${b} + ${c} = ${a + b + c}. Answer: ${a + b + c}x.`,
            topic: "Linear (Algebra)", difficulty
        };
    }

    if (difficulty === 'Medium') {
        const type = randInt(1, 59); // Increased from 55

        if (type <= 5) {
            const m = -randInt(2, 4);
            const c = randInt(5, 15);
            const x = randInt(1, 4);
            const y = m * x + c;
            return {
                question: `If y = ${m}x + ${c}, what is y when x = ${x}?`,
                options: [y.toString(), (c - m * x).toString(), c.toString(), (m * x).toString()],
                correctIndex: 0,
                explanation: `y = ${m} × ${x} + ${c} = ${m * x} + ${c} = ${y}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 10) {
            const k = randInt(2, 4);
            const coef = randInt(2, 3);
            const b = randInt(1, 5);
            const correct = `${k * coef}x + ${k * b}`;
            return {
                question: `Expand: ${k}(${coef}x + ${b})`,
                options: [correct, `${coef}x + ${k * b}`, `${k * coef}x + ${b}`, `${k + coef}x + ${b}`],
                correctIndex: 0,
                explanation: `${k} × ${coef}x = ${k * coef}x, ${k} × ${b} = ${k * b}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 15) {
            const k = randInt(2, 4);
            const coef = randInt(2, 3);
            const b = randInt(1, 5);
            const correct = `${k * coef}x - ${k * b}`;
            return {
                question: `Expand: ${k}(${coef}x - ${b})`,
                options: [correct, `${coef}x - ${k * b}`, `${k * coef}x - ${b}`, `${k - coef}x - ${b}`],
                correctIndex: 0,
                explanation: `${k} × ${coef}x = ${k * coef}x, ${k} × (-${b}) = -${k * b}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 20) {
            const a = randInt(2, 5);
            const b = randInt(1, 5);
            const c = randInt(2, 5);
            const d = randInt(1, 5);
            const xT = a + c;
            const nT = b + d;
            return {
                question: `Simplify: ${a}x + ${b} + ${c}x + ${d}`,
                options: [`${xT}x + ${nT}`, `${a * c}x + ${b * d}`, `${xT + nT}x`, `${a}x + ${c}x`],
                correctIndex: 0,
                explanation: `x terms: ${a} + ${c} = ${xT}x. Numbers: ${b} + ${d} = ${nT}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 25) {
            const a = randInt(3, 7);
            const b = randInt(2, 5);
            const c = randInt(2, 4);
            const d = randInt(1, 3);
            const xT = a - c;
            const nT = b + d;
            return {
                question: `Simplify: ${a}x + ${b} - ${c}x + ${d}`,
                options: [`${xT}x + ${nT}`, `${a + c}x + ${nT}`, `${xT}x + ${b - d}`, `${a * c}x`],
                correctIndex: 0,
                explanation: `x terms: ${a} - ${c} = ${xT}x. Numbers: ${b} + ${d} = ${nT}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 30) {
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            const ansX = randInt(2, 6);
            const y = m * ansX + c;
            return {
                question: `If y = ${m}x + ${c} and y = ${y}, what is x?`,
                options: [ansX.toString(), (ansX + 1).toString(), (y - c).toString(), Math.round(y / m).toString()],
                correctIndex: 0,
                explanation: `${y} = ${m}x + ${c} → x = (${y} - ${c}) ÷ ${m} = ${ansX}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 35) {
            const m1 = randInt(2, 5);
            const m2 = randInt(2, 5);
            const c1 = randInt(1, 10);
            const c2 = randInt(1, 10);
            const faster = m1 > m2 ? 0 : 1;
            const eqs = [`y = ${m1}x + ${c1}`, `y = ${m2}x + ${c2}`];
            return {
                question: `Which equation grows FASTER: ${eqs[0]} or ${eqs[1]}?`,
                options: [eqs[faster], eqs[1 - faster], "Same rate", "Cannot compare"],
                correctIndex: 0,
                explanation: `Larger gradient = faster growth. ${Math.max(m1, m2)} > ${Math.min(m1, m2)}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 40) {
            const m1 = randInt(2, 5);
            const m2 = randInt(2, 5);
            const c1 = randInt(1, 10);
            const c2 = randInt(15, 25);
            const higher = c1 > c2 ? 0 : 1;
            const eqs = [`y = ${m1}x + ${c1}`, `y = ${m2}x + ${c2}`];
            return {
                question: `Which equation has HIGHER starting value (y-intercept)?`,
                options: [eqs[higher], eqs[1 - higher], "Same", "Cannot compare"],
                correctIndex: 0,
                explanation: `y-intercept: ${Math.max(c1, c2)} > ${Math.min(c1, c2)}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 45) {
            const rate = randInt(2, 6);
            const initial = randInt(10, 40);
            return {
                question: `A mobile plan costs $${initial} to join plus $${rate} per GB. Cost for g GB?`,
                options: [`${rate}g + ${initial}`, `${initial}g + ${rate}`, `${rate + initial}g`, `${rate * initial}`],
                correctIndex: 0,
                explanation: `Cost = rate × GB + initial = ${rate}g + ${initial}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 50) {
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            const x1 = randInt(1, 3);
            const x2 = x1 + randInt(1, 2);
            const dy = m * (x2 - x1);
            return {
                question: `For y = ${m}x + ${c}: When x goes from ${x1} to ${x2}, how much does y change?`,
                options: [dy.toString(), m.toString(), (x2 - x1).toString(), (m + c).toString()],
                correctIndex: 0,
                explanation: `Change in y = gradient × change in x = ${m} × ${x2 - x1} = ${dy}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        // --- NEW MEDIUM ---
        if(type <= 53) {
            const m = randInt(2, 5);
            const c = randInt(1, 20);
            const plus = Math.random() > 0.5;
            const eq = plus ? `y = ${m}x + ${c}` : `y = ${m}x - ${c}`;
            const subject = plus ? `x = (y - ${c}) / ${m}` : `x = (y + ${c}) / ${m}`;
            return {
                question: `Make x the subject of ${eq}.`,
                options: [subject, `x = (y + ${c}) / ${m}`, `x = y - ${c}`, `x = y/${m} - ${c}`],
                correctIndex: 0,
                explanation: `Rearrange the equation to isolate x. Start by moving ${c}, then divide by ${m}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if(type <= 55) {
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            const res = m * randInt(2,6) + c;
            const x = (res - c) / m;
            return {
                question: `Solve for x: ${m}x + ${c} = ${res}`,
                options: [x.toString(), (x+1).toString(), (res).toString(), (res-c).toString()],
                correctIndex: 0,
                explanation: `First subtract ${c} from both sides, then divide by ${m}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }
        
        if (type <= 57) {
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            const x = -randInt(1, 5);
            const y = m * x + c;
            return {
                question: `If y = ${m}x + ${c}, what is y when x = ${x}?`,
                options: [y.toString(), (y+1).toString(), (y-c).toString(), (y+c).toString()],
                correctIndex: 0,
                explanation: `y = ${m} * (${x}) + ${c} = ${m*x} + ${c} = ${y}.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if(type <= 59) {
            const start = randInt(80, 100);
            const drain = randInt(10, 20);
            const hours = randInt(3, 5);
            const final = start - drain * hours;
            return {
                question: `A phone battery is at ${start}% and drains ${drain}% per hour. What percentage is left after ${hours} hours?`,
                options: [`${final}%`, `${start - drain}%`, `${final+drain}%`, "0%"],
                correctIndex: 0,
                explanation: `Charge = ${start} - (${drain} * ${hours}) = ${final}%.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        const rate = -randInt(2, 6);
        const context = pick([
            `decreases by ${-rate} per hour`,
            `loses $${-rate} per day`,
            `drops ${-rate} metres per minute`
        ]);
        return {
            question: `A quantity ${context}. What is the gradient?`,
            options: [rate.toString(), (-rate).toString(), "0", (rate * 2).toString()],
            correctIndex: 0,
            explanation: `Decreasing means negative gradient: ${rate}.`,
            topic: "Linear (Algebra)", difficulty
        };
    }

    if (difficulty === 'Hard') {
        const type = randInt(1, 28); // Increased from 25

        if (type <= 5) {
            const rate = randInt(5, 12);
            const initial = randInt(20, 60);
            const scenarios = [
                { desc: `An Uber ride: $${initial} flag fall + $${rate}/km`, ans: `y = ${rate}x + ${initial}` },
                { desc: `Mobile data: $${initial}/month + $${rate}/GB over limit`, ans: `y = ${rate}x + ${initial}` },
                { desc: `Gym membership: $${initial} joining fee + $${rate}/week`, ans: `y = ${rate}x + ${initial}` }
            ];
            const s = pick(scenarios);
            return {
                question: `${s.desc}. Which equation models cost y for x units?`,
                options: [s.ans, `y = ${initial}x + ${rate}`, `y = ${rate + initial}x`, `y = ${rate}x - ${initial}`],
                correctIndex: 0,
                explanation: `Cost = rate × units + initial.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 10) {
            const m1 = randInt(2, 5);
            const m2 = randInt(2, 5);
            const m3 = randInt(2, 5);
            const c1 = randInt(1, 10);
            const c2 = randInt(1, 10);
            const c3 = randInt(1, 10);
            const eqs = [`y = ${m1}x + ${c1}`, `y = ${m2}x + ${c2}`, `y = ${m3}x + ${c3}`];
            const maxM = Math.max(m1, m2, m3);
            const fastIdx = [m1, m2, m3].indexOf(maxM);
            return {
                question: `Which increases FASTEST? ${eqs.join(", ")}`,
                options: [eqs[fastIdx], eqs[(fastIdx + 1) % 3], eqs[(fastIdx + 2) % 3], "All equal"],
                correctIndex: 0,
                explanation: `Largest gradient (${maxM}) = fastest increase.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 15) {
            const m1 = -randInt(2, 5);
            const m2 = -randInt(2, 5);
            const m3 = -randInt(2, 5);
            const c1 = randInt(50, 100);
            const c2 = randInt(50, 100);
            const c3 = randInt(50, 100);
            const eqs = [`y = ${m1}x + ${c1}`, `y = ${m2}x + ${c2}`, `y = ${m3}x + ${c3}`];
            const minM = Math.min(m1, m2, m3);
            const fastIdx = [m1, m2, m3].indexOf(minM);
            return {
                question: `Which DECREASES fastest? ${eqs.join(", ")}`,
                options: [eqs[fastIdx], eqs[(fastIdx + 1) % 3], eqs[(fastIdx + 2) % 3], "All equal"],
                correctIndex: 0,
                explanation: `Most negative gradient (${minM}) = fastest decrease.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if (type <= 20) {
            const cost1 = randInt(5, 10);
            const fixed1 = randInt(20, 40);
            const cost2 = randInt(5, 10);
            const fixed2 = randInt(20, 40);
            const units = randInt(5, 12);
            const t1 = fixed1 + cost1 * units;
            const t2 = fixed2 + cost2 * units;
            const cheaper = t1 < t2 ? 0 : 1;
            return {
                question: `For ${units} units: Plan A ($${fixed1} + $${cost1}/unit) vs Plan B ($${fixed2} + $${cost2}/unit)?`,
                options: [`Plan ${"AB"[cheaper]} ($${Math.min(t1, t2)})`, `Plan ${"AB"[1 - cheaper]} ($${Math.max(t1, t2)})`, "Same cost", "Need more info"],
                correctIndex: 0,
                explanation: `A: $${t1}, B: $${t2}. Lower is cheaper.`,
                topic: "Linear (Algebra)", difficulty
            };
        }
        
        // --- NEW HARD ---
        if(type <= 23) {
            const m1 = randInt(1, 4);
            const m2 = -randInt(1, 4);
            const c1 = randInt(-5, 5);
            const c2 = randInt(5, 15);
            const x = (c2 - c1) / (m1 - m2); // Guranteed integer
            const y = m1 * x + c1;
            return {
                question: `Find the point of intersection for ${fmtLine(m1, c1)} and ${fmtLine(m2, c2)}.`,
                options: [`(${x}, ${y})`, `(${x+1}, ${y})`, `(${y}, ${x})`, `(0, 0)`],
                correctIndex: 0,
                explanation: `Set equations equal: ${m1}x + ${c1} = ${m2}x + ${c2}. Solve for x, then substitute to find y.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        if(type <= 26) {
            const m = randInt(2, 5);
            const a = m * randInt(1,3);
            const b = randInt(1,3);
            const d = a * randInt(1,4);
            const c = d * b;
            const grad = -a / b;
            return {
                question: `What is the gradient of the line ${a}x + ${b}y = ${c}?`,
                options: [grad.toString(), (-a).toString(), simplifyFraction(b, a), a.toString()],
                correctIndex: 0,
                explanation: `Rearrange to y = mx + c form: ${b}y = -${a}x + ${c}, so y = ${simplifyFraction(-a, b)}x + ${c/b}. The gradient is m.`,
                topic: "Linear (Algebra)", difficulty
            };
        }
        
        if (type <= 28) {
            const m1 = randInt(8, 12);
            const c1 = randInt(10, 25);
            const m2 = m1 - randInt(2,4); // m2 is smaller
            const c2 = c1 + randInt(5, 15); // c2 is larger
            const x = (c2 - c1) / (m1 - m2);
            return {
                question: `Plan A costs $${c1} + $${m1}/hr. Plan B costs $${c2} + $${m2}/hr. At how many hours do they cost the same?`,
                options: [x.toString(), (x*2).toString(), (x+1).toString(), (m1-m2).toString()],
                correctIndex: 0,
                explanation: `Set costs equal: ${c1} + ${m1}x = ${c2} + ${m2}x. Solve for x.`,
                topic: "Linear (Algebra)", difficulty
            };
        }

        const hpLoss = randInt(5, 12);
        const startHp = randInt(80, 120);
        const turns = randInt(4, 7);
        const finalHp = startHp - hpLoss * turns;
        return {
            question: `Pokemon: ${startHp} HP, loses ${hpLoss}/turn. HP after ${turns} turns?`,
            options: [finalHp.toString(), (startHp + hpLoss * turns).toString(), (hpLoss * turns).toString(), (startHp - hpLoss).toString()],
            correctIndex: 0,
            explanation: `HP = ${startHp} - ${hpLoss} × ${turns} = ${finalHp}.`,
            topic: "Linear (Algebra)", difficulty
        };
    }

    const score = randInt(50, 80);
    const gain = randInt(5, 10);
    const weeks = randInt(3, 6);
    const final = score + gain * weeks;
    return {
        question: `Start: ${score} points. Gain ${gain}/week. Score after ${weeks} weeks?`,
        options: [final.toString(), (score - gain * weeks).toString(), (gain * weeks).toString(), (score + gain).toString()],
        correctIndex: 0,
        explanation: `Score = ${score} + ${gain} × ${weeks} = ${final}.`,
        topic: "Linear (Algebra)", difficulty
    };
};

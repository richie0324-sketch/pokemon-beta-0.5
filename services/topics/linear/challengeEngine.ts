
import { MathQuestion } from "../../../types";
import { randInt, pick, simplifyFraction, formatAsFractionString } from "../../mathUtils";
import { fmtLine, fmtPoint, randPoint, calcSlope, Point } from "./linearUtils";

export const generateChallengeQuestion = (): MathQuestion => {
    const type = randInt(1, 30);

    if (type <= 2) {
        const p1 = randPoint(-4, 4);
        const p2 = randPoint(-4, 4);
        while (p2.x === p1.x) { p2.x = randInt(-4, 4); }
        const gradient = calcSlope(p1, p2);
        const gradientVal = gradient.val;
        const newX = randInt(p2.x + 1, p2.x + 4);
        const newY = p1.y + gradientVal * (newX - p1.x);
        const newYStr = formatAsFractionString(newY);
        return {
            question: `Points ${fmtPoint(p1)} and ${fmtPoint(p2)} define a line. What is y when x = ${newX}?`,
            options: [
                newYStr, 
                formatAsFractionString(newY + 3), 
                formatAsFractionString(newY - 3), 
                formatAsFractionString(gradientVal)
            ],
            correctIndex: 0,
            explanation: `Step 1: Find gradient = ${simplifyFraction(gradient.num, gradient.den)}. Step 2: Use y = y₁ + m(x - x₁).`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 4) {
        const rate = randInt(3, 12);
        const initial = randInt(10, 50);
        const scenarios = [
            { desc: `A mobile plan costs $${initial} to sign up, then $${rate} per month`, m: rate, c: initial },
            { desc: `A car hire costs $${initial} plus $${rate} per day`, m: rate, c: initial },
            { desc: `A footy club charges $${initial} registration plus $${rate} per game`, m: rate, c: initial }
        ];
        const s = pick(scenarios);
        return {
            question: `${s.desc}. Identify the GRADIENT and Y-INTERCEPT.`,
            options: [`Gradient = ${s.m}, Intercept = ${s.c}`, `Gradient = ${s.c}, Intercept = ${s.m}`, `Gradient = ${s.m + s.c}, Intercept = 0`, `Gradient = ${s.m}, Intercept = 0`],
            correctIndex: 0,
            explanation: `The rate per unit (${s.m}) is the gradient. The starting cost (${s.c}) is the y-intercept.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 6) {
        const m1 = randInt(2, 5);
        const m2 = randInt(2, 5);
        const c1 = randInt(10, 30);
        const c2 = randInt(10, 30);
        const dy1 = m1 * 5;
        const match1 = `change in y/change in x = ${dy1}/5`;
        const eq1 = `y = ${m1}x + ${c1}`;
        const eq2 = `y = ${m2}x + ${c2}`;
        return {
            question: `Match: ${match1} corresponds to which equation?`,
            options: [eq1, eq2, `y = ${dy1}x + 5`, `y = 5x + ${dy1}`],
            correctIndex: 0,
            explanation: `${match1} simplifies to gradient = ${m1}, matching ${eq1}.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 8) {
        const m = randInt(2, 4);
        const c = randInt(1, 10);
        const x1 = randInt(1, 3);
        const x2 = randInt(4, 6);
        const x3 = randInt(7, 9);
        const y1 = m * x1 + c;
        const y2 = m * x2 + c + randInt(-1, 1);
        const y3 = m * x3 + c;
        const points: Point[] = [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }];
        const errors = points.map(p => Math.abs(p.y - (m * p.x + c)));
        const allSmall = errors.every(e => e <= 1);
        return {
            question: `Are ${points.map(fmtPoint).join(", ")} approximately COLLINEAR on y = ${m}x + ${c}?`,
            options: [allSmall ? "Yes, all are close" : "No, at least one is far", allSmall ? "No, at least one is far" : "Yes, all are close", "Cannot determine", "Only the first point"],
            correctIndex: 0,
            explanation: `Check each point: substitute x and compare y. Error ≤ 1 means "close".`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 10) {
        const m1 = randInt(3, 8);
        const m2 = randInt(3, 8);
        const c1 = randInt(10, 30);
        const c2 = randInt(10, 30);
        const faster = m1 > m2 ? 0 : 1;
        const models = [
            `Model A: starts at ${c1}, grows by ${m1} per unit`,
            `Model B: starts at ${c2}, grows by ${m2} per unit`
        ];
        return {
            question: `${models[0]}. ${models[1]}. Which grows FASTER?`,
            options: [`Model ${"AB"[faster]}`, `Model ${"AB"[1 - faster]}`, "They grow equally", "Cannot compare"],
            correctIndex: 0,
            explanation: `Compare growth rates (gradients): ${Math.max(m1, m2)} > ${Math.min(m1, m2)}.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 12) {
        const hpLoss = randInt(5, 15);
        const startHp = randInt(80, 150);
        const turns = randInt(4, 8);
        const finalHp = startHp - hpLoss * turns;
        return {
            question: `A Pokemon has ${startHp} HP and loses ${hpLoss} HP per turn. After ${turns} turns, what is its HP?`,
            options: [finalHp.toString(), (startHp + hpLoss * turns).toString(), (hpLoss * turns).toString(), (startHp - hpLoss).toString()],
            correctIndex: 0,
            explanation: `HP = ${startHp} - ${hpLoss} × ${turns} = ${finalHp}. This models y = ${startHp} - ${hpLoss}x.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 14) {
        const cost1 = randInt(5, 10);
        const fixed1 = randInt(20, 50);
        const cost2 = randInt(5, 10);
        const fixed2 = randInt(20, 50);
        const units = randInt(5, 15);
        const total1 = fixed1 + cost1 * units;
        const total2 = fixed2 + cost2 * units;
        const cheaper = total1 < total2 ? 0 : 1;
        const plans = [`Plan A: $${fixed1} base + $${cost1}/unit`, `Plan B: $${fixed2} base + $${cost2}/unit`];
        return {
            question: `For ${units} units, which plan is CHEAPER? ${plans[0]} vs ${plans[1]}`,
            options: [`Plan ${"AB"[cheaper]} ($${Math.min(total1, total2)})`, `Plan ${"AB"[1 - cheaper]} ($${Math.max(total1, total2)})`, "They cost the same", "Cannot determine"],
            correctIndex: 0,
            explanation: `Plan A: $${total1}. Plan B: $${total2}. Lower is cheaper.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 16) {
        const m = randInt(2, 5);
        const c = randInt(5, 20);
        const x = randInt(3, 8);
        const yExpected = m * x + c;
        const points: Point[] = [
            { x, y: yExpected },
            { x, y: yExpected + randInt(2, 5) },
            { x, y: yExpected - randInt(2, 5) },
            { x, y: yExpected + randInt(6, 10) }
        ];
        const sorted = [...points].sort((a, bb) => Math.abs(a.y - yExpected) - Math.abs(bb.y - yExpected));
        return {
            question: `For y = ${m}x + ${c}, rank these points by CLOSENESS to the line at x = ${x}: ${points.map(fmtPoint).join(", ")}`,
            options: [
                sorted.map(fmtPoint).join(", "),
                [...sorted].reverse().map(fmtPoint).join(", "),
                [sorted[1], sorted[0], sorted[2], sorted[3]].map(fmtPoint).join(", "),
                [sorted[2], sorted[3], sorted[0], sorted[1]].map(fmtPoint).join(", ")
            ],
            correctIndex: 0,
            explanation: `At x = ${x}, line gives y = ${yExpected}. Sort by |point's y - ${yExpected}|.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 18) {
        const p1 = randPoint(-3, 3);
        const run = randInt(2, 4);
        const rise = randInt(2, 6);
        const p2 = { x: p1.x + run, y: p1.y + rise };
        const gradient = calcSlope(p1, p2);
        const gradientStr = simplifyFraction(gradient.num, gradient.den);
        const c = p1.y - gradient.val * p1.x;
        const cRounded = Number.isInteger(c) ? c : Math.round(c * 10) / 10;
        return {
            question: `Find the equation of the line through ${fmtPoint(p1)} and ${fmtPoint(p2)}.`,
            options: [`y = ${gradientStr}x + ${cRounded}`, `y = ${gradientStr}x - ${Math.abs(cRounded)}`, `y = ${-gradient.val}x + ${cRounded}`, `y = x + ${cRounded}`],
            correctIndex: 0,
            explanation: `Gradient = ${gradientStr}. Use point-gradient form: y - ${p1.y} = ${gradientStr}(x - ${p1.x}).`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 20) {
        const score1 = randInt(50, 80);
        const increase = randInt(5, 15);
        const weeks = randInt(3, 6);
        const finalScore = score1 + increase * weeks;
        return {
            question: `A student starts with ${score1} points and gains ${increase} points per week. Score after ${weeks} weeks?`,
            options: [finalScore.toString(), (score1 - increase * weeks).toString(), (increase * weeks).toString(), (score1 + increase).toString()],
            correctIndex: 0,
            explanation: `Score = ${score1} + ${increase} × ${weeks} = ${finalScore}.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 22) {
        const m = randInt(2, 4);
        const c = randInt(5, 15);
        const targetY = randInt(20, 50);
        const x = (targetY - c) / m;
        const xStr = formatAsFractionString(x);
        return {
            question: `For y = ${m}x + ${c}, at what x does y = ${targetY}?`,
            options: [
                xStr, 
                formatAsFractionString((targetY + c) / m), 
                formatAsFractionString(targetY / m), 
                (targetY - m).toString()
            ],
            correctIndex: 0,
            explanation: `${targetY} = ${m}x + ${c} → ${m}x = ${targetY - c} → x = ${xStr}.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 24) {
        const m1 = randInt(2, 5);
        const m2 = randInt(2, 5);
        const c1 = randInt(20, 40);
        const c2 = randInt(5, 15);
        const lines = [`y = ${m1}x + ${c1}`, `y = ${m2}x + ${c2}`];
        const higher = c1 > c2 ? 0 : 1;
        return {
            question: `Which line has a HIGHER y-value when x = 0? ${lines.join(" vs ")}`,
            options: [lines[higher], lines[1 - higher], "They are equal at x=0", "Cannot determine"],
            correctIndex: 0,
            explanation: `At x = 0, y = c (the intercept). ${Math.max(c1, c2)} > ${Math.min(c1, c2)}.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 26) {
        const fuel = randInt(40, 60);
        const consumption = randInt(5, 10);
        const hours = randInt(3, 6);
        const remaining = fuel - consumption * hours;
        return {
            question: `A car has ${fuel}L of fuel and uses ${consumption}L/hour. Fuel left after ${hours} hours?`,
            options: [remaining.toString(), (fuel + consumption * hours).toString(), (consumption * hours).toString(), (fuel / consumption).toString()],
            correctIndex: 0,
            explanation: `Fuel = ${fuel} - ${consumption} × ${hours} = ${remaining}L.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    if (type <= 28) {
        const p1: Point = { x: 0, y: randInt(5, 15) };
        const p2: Point = { x: randInt(4, 8), y: randInt(20, 40) };
        const gradient = calcSlope(p1, p2);
        const gradientStr = simplifyFraction(gradient.num, gradient.den);
        const midX = Math.floor((p1.x + p2.x) / 2);
        const midY = p1.y + gradient.val * midX;
        const midYStr = formatAsFractionString(midY);
        return {
            question: `Line passes through ${fmtPoint(p1)} and ${fmtPoint(p2)}. What is y at x = ${midX}?`,
            options: [
                midYStr, 
                formatAsFractionString(midY + 5), 
                formatAsFractionString(midY - 5), 
                formatAsFractionString(gradient.val)
            ],
            correctIndex: 0,
            explanation: `Gradient = ${gradientStr}. At x = ${midX}: y = ${p1.y} + ${gradientStr} × ${midX} = ${midYStr}.`,
            topic: "Linear (Challenge)", difficulty: "Challenge"
        };
    }

    const m = randInt(3, 7);
    const c = randInt(10, 30);
    const x1 = randInt(2, 5);
    const x2 = x1 + randInt(2, 4);
    const y1 = m * x1 + c;
    const y2 = m * x2 + c;
    const diff = y2 - y1;
    return {
        question: `For y = ${m}x + ${c}, how much does y CHANGE when x goes from ${x1} to ${x2}?`,
        options: [diff.toString(), (diff / 2).toString(), m.toString(), (y1 + y2).toString()],
        correctIndex: 0,
        explanation: `Change in y = gradient × change in x = ${m} × ${x2 - x1} = ${diff}.`,
        topic: "Linear (Challenge)", difficulty: "Challenge"
    };
};

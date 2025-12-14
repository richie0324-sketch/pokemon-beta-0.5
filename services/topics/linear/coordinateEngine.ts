
import { Difficulty, MathQuestion } from "../../../types";
import { randInt, pick, randExclude } from "../../mathUtils";
import { Point, fmtPoint, getQuadrant, randPoint, calcSlope } from "./linearUtils";

const sortPointsByX = (points: Point[]): Point[] => [...points].sort((a, b) => a.x - b.x);
const sortPointsByY = (points: Point[]): Point[] => [...points].sort((a, b) => a.y - b.y);
const distFromOrigin = (p: Point): number => Math.abs(p.x) + Math.abs(p.y);

export const generateCoordinateQuestion = (difficulty: Difficulty): MathQuestion => {

    if (difficulty === 'Easy') {
        const type = randInt(1, 70); // Increased from 40 to 70

        // --- NEW SUPER-EASY QUESTIONS ---
        if (type <= 5) {
            const x = randInt(-9, 9);
            const y = randInt(-9, 9);
            return {
                question: `In the coordinate pair (${x}, ${y}), what is the x-coordinate?`,
                options: [x.toString(), y.toString(), `(${x}, ${y})`, (x+y).toString()],
                correctIndex: 0,
                explanation: "The x-coordinate is always the first number in the pair.",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        if (type <= 10) {
            const x = randInt(-9, 9);
            const y = randInt(-9, 9);
            return {
                question: `In the coordinate pair (${x}, ${y}), what is the y-coordinate?`,
                options: [y.toString(), x.toString(), `(${x}, ${y})`, (y-x).toString()],
                correctIndex: 0,
                explanation: "The y-coordinate is always the second number in the pair.",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        if (type <= 15) {
            return {
                question: `Which axis is the HORIZONTAL axis on a Cartesian plane?`,
                options: ["The x-axis", "The y-axis", "The origin", "A quadrant"],
                correctIndex: 0,
                explanation: "The x-axis runs horizontally (left to right).",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        if (type <= 20) {
            return {
                question: `Which axis is the VERTICAL axis on a Cartesian plane?`,
                options: ["The y-axis", "The x-axis", "The origin", "The line y=x"],
                correctIndex: 0,
                explanation: "The y-axis runs vertically (up and down).",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        if (type <= 25) {
            const x = randInt(1, 5);
            const y = randInt(1, 5);
            return {
                question: `To plot (${x}, ${y}), you move ${x} units right from the origin, and then...?`,
                options: [`${y} units up`, `${y} units down`, `${x} units up`, `${y} units left`],
                correctIndex: 0,
                explanation: "The first number (x) is the horizontal move, the second number (y) is the vertical move.",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        if (type <= 30) {
             const x = randInt(-5, -1);
             const y = randInt(1, 5);
            return {
                question: `To plot (${x}, ${y}), you move ${-x} units left from the origin, and then...?`,
                options: [`${y} units up`, `${y} units down`, `${-x} units up`, `${y} units right`],
                correctIndex: 0,
                explanation: "A negative x means move left. A positive y means move up.",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        
        // --- EXISTING EASY QUESTIONS (renumbered) ---
        if (type <= 34) { // was 4
            return {
                question: "What are the coordinates of the origin?",
                options: ["(0, 0)", "(1, 1)", "(0, 1)", "(1, 0)"],
                correctIndex: 0,
                explanation: "The origin is where the x and y axes meet, at (0, 0).",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 38) { // was 8
            const val = randExclude(-8, 8, [0]);
            const d1 = randExclude(-8, 8, [0, val]);
            return {
                question: "Which point lies on the x-axis?",
                options: [`(${val}, 0)`, `(0, ${val})`, `(${d1}, ${d1})`, `(${val}, ${val})`],
                correctIndex: 0,
                explanation: "Points on the x-axis always have y = 0.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 42) { // was 12
            const val = randExclude(-8, 8, [0]);
            const d1 = randExclude(-8, 8, [0, val]);
            return {
                question: "Which point lies on the y-axis?",
                options: [`(0, ${val})`, `(${val}, 0)`, `(${d1}, ${d1})`, `(${val}, ${val})`],
                correctIndex: 0,
                explanation: "Points on the y-axis always have x = 0.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 46) { // was 16
            const p = { x: randInt(1, 8), y: randInt(1, 8) };
            return {
                question: `In which quadrant is ${fmtPoint(p)} located?`,
                options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
                correctIndex: 0,
                explanation: "Positive x and positive y means Quadrant I (top right).",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 50) { // was 20
            const p = { x: randInt(-8, -1), y: randInt(1, 8) };
            return {
                question: `In which quadrant is ${fmtPoint(p)} located?`,
                options: ["Quadrant II", "Quadrant I", "Quadrant III", "Quadrant IV"],
                correctIndex: 0,
                explanation: "Negative x and positive y means Quadrant II (top left).",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 54) { // was 24
            const p = { x: randInt(-8, -1), y: randInt(-8, -1) };
            return {
                question: `In which quadrant is ${fmtPoint(p)} located?`,
                options: ["Quadrant III", "Quadrant I", "Quadrant II", "Quadrant IV"],
                correctIndex: 0,
                explanation: "Negative x and negative y means Quadrant III (bottom left).",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 58) { // was 28
            const p = { x: randInt(1, 8), y: randInt(-8, -1) };
            return {
                question: `In which quadrant is ${fmtPoint(p)} located?`,
                options: ["Quadrant IV", "Quadrant I", "Quadrant II", "Quadrant III"],
                correctIndex: 0,
                explanation: "Positive x and negative y means Quadrant IV (bottom right).",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 62) { // was 32
            const points = [
                { x: randInt(5, 8), y: randInt(-5, 5) },
                { x: randInt(-2, 3), y: randInt(-5, 5) },
                { x: randInt(-8, -5), y: randInt(-5, 5) },
                { x: randInt(-3, 2), y: randInt(-5, 5) }
            ];
            const sorted = sortPointsByX(points);
            const correct = sorted[sorted.length - 1];
            return {
                question: "Which point has the LARGEST x-coordinate?",
                options: [fmtPoint(correct), fmtPoint(sorted[0]), fmtPoint(sorted[1]), fmtPoint(sorted[2])],
                correctIndex: 0,
                explanation: "Compare the first number (x) in each point.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 66) { // was 36
            const points = [
                { x: randInt(-5, 5), y: randInt(-8, -5) },
                { x: randInt(-5, 5), y: randInt(-2, 3) },
                { x: randInt(-5, 5), y: randInt(5, 8) },
                { x: randInt(-5, 5), y: randInt(-3, 2) }
            ];
            const sorted = sortPointsByY(points);
            const correct = sorted[0];
            return {
                question: "Which point has the SMALLEST y-coordinate?",
                options: [fmtPoint(correct), fmtPoint(sorted[3]), fmtPoint(sorted[2]), fmtPoint(sorted[1])],
                correctIndex: 0,
                explanation: "Compare the second number (y). Most negative is smallest.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        const q = pick(["I", "II", "III", "IV"]);
        const p1 = q === "I" ? { x: randInt(1, 5), y: randInt(1, 5) } :
                   q === "II" ? { x: randInt(-5, -1), y: randInt(1, 5) } :
                   q === "III" ? { x: randInt(-5, -1), y: randInt(-5, -1) } :
                   { x: randInt(1, 5), y: randInt(-5, -1) };
        const p2 = q === "I" ? { x: randInt(1, 8), y: randInt(1, 8) } :
                   q === "II" ? { x: randInt(-8, -1), y: randInt(1, 8) } :
                   q === "III" ? { x: randInt(-8, -1), y: randInt(-8, -1) } :
                   { x: randInt(1, 8), y: randInt(-8, -1) };
        const d1 = { x: -p1.x, y: p1.y };
        const d2 = { x: p1.x, y: -p1.y };
        return {
            question: `Which TWO points are in the same quadrant?`,
            options: [`${fmtPoint(p1)} and ${fmtPoint(p2)}`, `${fmtPoint(p1)} and ${fmtPoint(d1)}`, `${fmtPoint(p2)} and ${fmtPoint(d2)}`, `${fmtPoint(d1)} and ${fmtPoint(d2)}`],
            correctIndex: 0,
            explanation: `Both points have the same signs for x and y.`,
            topic: "Linear (Coordinates)", difficulty
        };
    }

    if (difficulty === 'Medium') {
        const type = randInt(1, 38); // Increased from 35

        if (type <= 5) {
            const points = [
                { x: randInt(1, 3), y: randInt(1, 3) },
                { x: randInt(4, 6), y: randInt(4, 6) },
                { x: randInt(7, 9), y: randInt(7, 9) },
                { x: randInt(-2, 0), y: randInt(-2, 0) }
            ];
            const sorted = sortPointsByX(points);
            const order = sorted.map(fmtPoint).join(", ");
            const wrongOrder1 = [...sorted].reverse().map(fmtPoint).join(", ");
            const wrongOrder2 = sortPointsByY(points).map(fmtPoint).join(", ");
            const wrongOrder3 = [sorted[2], sorted[0], sorted[3], sorted[1]].map(fmtPoint).join(", ");
            return {
                question: "Arrange these points in order of INCREASING x-coordinate:",
                options: [order, wrongOrder1, wrongOrder2, wrongOrder3],
                correctIndex: 0,
                explanation: "Sort by the first number (x) from smallest to largest.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 10) {
            const points = [
                { x: randInt(-3, 3), y: randInt(5, 8) },
                { x: randInt(-3, 3), y: randInt(1, 4) },
                { x: randInt(-3, 3), y: randInt(-4, 0) },
                { x: randInt(-3, 3), y: randInt(-8, -5) }
            ];
            const sorted = sortPointsByY(points);
            const order = sorted.map(fmtPoint).join(", ");
            const wrongOrder1 = [...sorted].reverse().map(fmtPoint).join(", ");
            const wrongOrder2 = sortPointsByX(points).map(fmtPoint).join(", ");
            const wrongOrder3 = [sorted[2], sorted[0], sorted[3], sorted[1]].map(fmtPoint).join(", ");
            return {
                question: "Arrange these points in order of INCREASING y-coordinate:",
                options: [order, wrongOrder1, wrongOrder2, wrongOrder3],
                correctIndex: 0,
                explanation: "Sort by the second number (y) from smallest to largest.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 15) {
            const points = [
                { x: randInt(5, 8), y: randInt(5, 8) },
                { x: randInt(1, 3), y: randInt(1, 3) },
                { x: randInt(-3, -1), y: randInt(-3, -1) },
                { x: randInt(-1, 1), y: randInt(-1, 1) }
            ];
            const sorted = [...points].sort((a, b) => distFromOrigin(b) - distFromOrigin(a));
            const correct = sorted[0];
            return {
                question: "Which point is FARTHEST from the origin (0, 0)?",
                options: [fmtPoint(correct), fmtPoint(sorted[1]), fmtPoint(sorted[2]), fmtPoint(sorted[3])],
                correctIndex: 0,
                explanation: "Add |x| + |y| for each point. Largest sum is farthest.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 20) {
            const points = [
                { x: randInt(-1, 1), y: randInt(-1, 1) },
                { x: randInt(3, 5), y: randInt(3, 5) },
                { x: randInt(-5, -3), y: randInt(3, 5) },
                { x: randInt(3, 5), y: randInt(-5, -3) }
            ];
            const sorted = [...points].sort((a, b) => distFromOrigin(a) - distFromOrigin(b));
            const correct = sorted[0];
            return {
                question: "Which point is CLOSEST to the origin (0, 0)?",
                options: [fmtPoint(correct), fmtPoint(sorted[1]), fmtPoint(sorted[2]), fmtPoint(sorted[3])],
                correctIndex: 0,
                explanation: "Add |x| + |y| for each point. Smallest sum is closest.",
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 25) {
            const m = randInt(2, 4);
            const c = randInt(1, 8);
            const x = randInt(1, 5);
            const yCorrect = m * x + c;
            const points = [
                { x, y: yCorrect },
                { x, y: yCorrect + randInt(2, 4) },
                { x, y: yCorrect - randInt(2, 4) },
                { x, y: yCorrect + randInt(5, 8) }
            ];
            const cSign = c > 0 ? '+' : '-';
            return {
                question: `Which point lies ON the line y = ${m}x ${cSign} ${Math.abs(c)}?`,
                options: [fmtPoint(points[0]), fmtPoint(points[1]), fmtPoint(points[2]), fmtPoint(points[3])],
                correctIndex: 0,
                explanation: `At x = ${x}: y = ${m} × ${x} + ${c} = ${yCorrect}. So (${x}, ${yCorrect}) is on the line.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 30) {
            const points = [
                randPoint(-5, 5),
                randPoint(-5, 5),
                randPoint(-5, 5),
                randPoint(-5, 5)
            ];
            const sorted = [...points].sort((a, b) => distFromOrigin(b) - distFromOrigin(a));
            return {
                question: "Rank these points from FARTHEST to CLOSEST to the origin:",
                options: [
                    sorted.map(fmtPoint).join(", "),
                    [...sorted].reverse().map(fmtPoint).join(", "),
                    [sorted[1], sorted[0], sorted[2], sorted[3]].map(fmtPoint).join(", "),
                    [sorted[2], sorted[3], sorted[0], sorted[1]].map(fmtPoint).join(", ")
                ],
                correctIndex: 0,
                explanation: "Calculate |x| + |y| for each point and sort from largest to smallest.",
                topic: "Linear (Coordinates)", difficulty
            };
        }
        
        // --- NEW MEDIUM ---
        if(type <= 33) {
            const x1 = randInt(-4, 4) * 2; // Ensure sums are even
            const y1 = randInt(-4, 4) * 2;
            const x2 = randInt(-4, 4) * 2;
            const y2 = randInt(-4, 4) * 2;
            const p1 = { x: x1, y: y1 };
            const p2 = { x: x2, y: y2 };
            const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
            return {
                question: `What is the midpoint between ${fmtPoint(p1)} and ${fmtPoint(p2)}?`,
                options: [fmtPoint(mid), fmtPoint({x: mid.y, y: mid.x}), fmtPoint({x: x2-x1, y:y2-y1}), fmtPoint({x: (x1-x2)/2, y: (y1-y2)/2})],
                correctIndex: 0,
                explanation: `The midpoint is the average of the x's and y's: ((${x1}+${x2})/2, (${y1}+${y2})/2).`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 36) {
            const p = randPoint(-8, 8);
            const reflectX = Math.random() > 0.5;
            const correct = reflectX ? { x: p.x, y: -p.y } : { x: -p.x, y: p.y };
            return {
                question: `What are the coordinates of ${fmtPoint(p)} reflected across the ${reflectX ? 'x-axis' : 'y-axis'}?`,
                options: [fmtPoint(correct), fmtPoint({x: -p.x, y: -p.y}), fmtPoint({x: p.y, y: p.x}), fmtPoint(p)],
                correctIndex: 0,
                explanation: `Reflecting across the ${reflectX ? 'x-axis' : 'y-axis'} flips the sign of the ${reflectX ? 'y' : 'x'}-coordinate.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 38) {
            const isVertical = Math.random() > 0.5;
            const fixedCoord = randInt(-5, 5);
            const p1 = isVertical ? { x: fixedCoord, y: randInt(-8, -2) } : { x: randInt(-8, -2), y: fixedCoord };
            const p2 = isVertical ? { x: fixedCoord, y: randInt(2, 8) } : { x: randInt(2, 8), y: fixedCoord };
            const dist = Math.abs(isVertical ? p2.y - p1.y : p2.x - p1.x);
            return {
                question: `What is the distance between ${fmtPoint(p1)} and ${fmtPoint(p2)}?`,
                options: [dist.toString(), (dist+2).toString(), (dist-1).toString(), "0"],
                correctIndex: 0,
                explanation: `Since the ${isVertical ? 'x' : 'y'}-coordinates are the same, the distance is the difference in the other coordinates.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        const points = [randPoint(-6, 6), randPoint(-6, 6), randPoint(-6, 6), randPoint(-6, 6)];
        const quadrants = points.map(getQuadrant);
        return {
            question: `How many of these points are in Quadrant I? ${points.map(fmtPoint).join(", ")}`,
            options: [
                quadrants.filter(q => q === "Quadrant I").length.toString(),
                (quadrants.filter(q => q === "Quadrant I").length + 1).toString(),
                Math.max(0, quadrants.filter(q => q === "Quadrant I").length - 1).toString(),
                "4"
            ],
            correctIndex: 0,
            explanation: "Quadrant I has positive x AND positive y.",
            topic: "Linear (Coordinates)", difficulty
        };
    }

    if (difficulty === 'Hard') {
        const type = randInt(1, 23); // Increased from 20

        if (type <= 5) {
            const m = randInt(2, 5);
            const c = randInt(1, 10);
            const x = randInt(1, 5);
            const yCorrect = m * x + c;
            const points = [
                { x, y: yCorrect },
                { x, y: yCorrect + randInt(1, 3) },
                { x, y: yCorrect - randInt(1, 3) },
                { x, y: yCorrect + randInt(4, 7) }
            ];
            const sorted = [...points].sort((a, b) => Math.abs(a.y - yCorrect) - Math.abs(b.y - yCorrect));
            const cSign = c > 0 ? '+' : '-';
            return {
                question: `For y = ${m}x ${cSign} ${Math.abs(c)}, which point is CLOSEST to the line at x = ${x}?`,
                options: [fmtPoint(sorted[0]), fmtPoint(sorted[1]), fmtPoint(sorted[2]), fmtPoint(sorted[3])],
                correctIndex: 0,
                explanation: `Calculate y = ${yCorrect} at x = ${x}. Find the point with smallest difference.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 10) {
            const m = randInt(2, 4);
            const c = randInt(1, 8);
            const testX = randInt(1, 5);
            const yLine = m * testX + c;
            const points = [
                { x: testX, y: yLine + randInt(1, 2) },
                { x: testX, y: yLine - randInt(1, 2) },
                { x: testX, y: yLine + randInt(4, 6) },
                { x: testX, y: yLine - randInt(4, 6) }
            ];
            const errors = points.map(p => Math.abs(p.y - yLine));
            const maxIdx = errors.indexOf(Math.max(...errors));
            const cSign = c > 0 ? '+' : '-';
            return {
                question: `For y = ${m}x ${cSign} ${Math.abs(c)} at x = ${testX}, which point is FARTHEST from the line?`,
                options: [fmtPoint(points[maxIdx]), fmtPoint(points[(maxIdx + 1) % 4]), fmtPoint(points[(maxIdx + 2) % 4]), fmtPoint(points[(maxIdx + 3) % 4])],
                correctIndex: 0,
                explanation: `Line gives y = ${yLine}. Find the point with largest difference.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if (type <= 15) {
            const m = randInt(2, 4);
            const c = randInt(1, 5);
            const x1 = randInt(1, 4);
            const x2 = randInt(5, 8);
            const y1 = m * x1 + c;
            const y2 = m * x2 + c;
            const cSign = c > 0 ? '+' : '-';
            return {
                question: `For y = ${m}x ${cSign} ${Math.abs(c)}, which x gives the LARGER y: x = ${x1} or x = ${x2}?`,
                options: [`x = ${x2}`, `x = ${x1}`, "Both give the same y", "Cannot determine"],
                correctIndex: 0,
                explanation: `Larger x gives larger y when gradient is positive. y(${x2}) = ${y2} > y(${x1}) = ${y1}.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }
        
        // --- NEW HARD ---
        if(type <= 18) {
            const p1 = randPoint(-5, 5);
            const dx = randExclude(-4, 4, [0]);
            const dy = randExclude(-4, 4, [0]);
            const p2 = { x: p1.x + dx, y: p1.y };
            const p3 = { x: p1.x, y: p1.y + dy };
            const p4 = { x: p2.x, y: p3.y }; // The correct fourth vertex
            return {
                question: `A rectangle has vertices at ${fmtPoint(p1)}, ${fmtPoint(p2)}, and ${fmtPoint(p3)}. What is the fourth vertex?`,
                options: [fmtPoint(p4), fmtPoint({x: p4.x+1, y: p4.y}), fmtPoint({x:p1.x-dx, y:p1.y-dy}), fmtPoint({x: 0, y: 0})],
                correctIndex: 0,
                explanation: `The fourth point must have the x-coordinate of one point and the y-coordinate of another to complete the rectangle.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if(type <= 21) {
            const m = randInt(-3, 3);
            const c = randInt(-5, 5);
            const p1 = {x: randInt(-5,0), y: 0};
            p1.y = m * p1.x + c;
            const p2 = {x: p1.x + randInt(1,3), y: 0};
            p2.y = m * p2.x + c;
            const p3 = {x: p2.x + randInt(1,3), y: 0};
            const isCollinear = Math.random() > 0.3;
            p3.y = isCollinear ? m * p3.x + c : m * p3.x + c + randExclude(-2, 2, [0]);
            const s12 = calcSlope(p1, p2).val;
            const s23 = calcSlope(p3, p2).val;
            const answer = Math.abs(s12 - s23) < 0.01;
            return {
                question: `Are the points ${fmtPoint(p1)}, ${fmtPoint(p2)}, and ${fmtPoint(p3)} collinear (on the same line)?`,
                options: [answer ? "Yes" : "No", answer ? "No" : "Yes", "Cannot be determined"],
                correctIndex: 0,
                explanation: `Points are collinear if the gradient between them is the same. Gradient from point 1 to 2 is ${s12.toFixed(2)}, and from 2 to 3 is ${s23.toFixed(2)}.`,
                topic: "Linear (Coordinates)", difficulty
            };
        }

        if(type <= 23) {
            const p1 = randPoint(-5, 5);
            const rise = randExclude(-4, 4, [0]);
            const run = randExclude(-4, 4, [0]);
            const p2 = { x: p1.x + run, y: p1.y + rise };
            return {
                question: `Start at ${fmtPoint(p1)}. Move with a Rise of ${rise} and a Run of ${run}. Where do you end up?`,
                options: [fmtPoint(p2), fmtPoint({x: p1.x-run, y: p1.y-rise}), fmtPoint({x: rise, y: run}), fmtPoint({x: p1.x+rise, y: p1.y+run})],
                correctIndex: 0,
                explanation: `New X = Old X + Run (${p1.x} + ${run}). New Y = Old Y + Rise (${p1.y} + ${rise}).`,
                topic: "Linear (Coordinates)", difficulty
            };
        }
        
        const m = randInt(2, 5) * (Math.random() > 0.5 ? 1 : -1);
        const c = randInt(1, 10);
        const points = [
            { x: randInt(1, 5), y: 0 },
            { x: randInt(1, 5), y: 0 },
            { x: randInt(1, 5), y: 0 },
            { x: randInt(1, 5), y: 0 }
        ];
        points.forEach(p => { p.y = m * p.x + c + randInt(-5, 5); });
        
        const errors = points.map(p => Math.abs(p.y - (m * p.x + c)));
        const maxIdx = errors.indexOf(Math.max(...errors));
        const cSign = c > 0 ? '+' : '-';
        
        return {
            question: `Which point is FARTHEST from y = ${m}x ${cSign} ${Math.abs(c)}?`,
            options: [fmtPoint(points[maxIdx]), fmtPoint(points[(maxIdx + 1) % 4]), fmtPoint(points[(maxIdx + 2) % 4]), fmtPoint(points[(maxIdx + 3) % 4])],
            correctIndex: 0,
            explanation: `Calculate expected y for each x, then find largest difference.`,
            topic: "Linear (Coordinates)", difficulty
        };
    }

    const m = randInt(1, 3);
    const c = randInt(1, 5);
    const x = randInt(1, 4);
    const yCorrect = m * x + c;
    const points = [
        { x, y: yCorrect },
        { x, y: yCorrect + 1 },
        { x, y: yCorrect - 2 },
        { x, y: yCorrect + 3 }
    ];
    const errors = points.map(p => Math.abs(p.y - yCorrect));
    const minIdx = errors.indexOf(Math.min(...errors));
    const cSign = c > 0 ? '+' : '-';
    return {
        question: `Which point is CLOSEST to the line y = ${m}x ${cSign} ${Math.abs(c)} when x = ${x}?`,
        options: [fmtPoint(points[minIdx]), fmtPoint(points[(minIdx + 1) % 4]), fmtPoint(points[(minIdx + 2) % 4]), fmtPoint(points[(minIdx + 3) % 4])],
        correctIndex: 0,
        explanation: `At x = ${x}, the line gives y = ${yCorrect}. The point closest to ${yCorrect} is the answer.`,
        topic: "Linear (Coordinates)", difficulty
    };
};

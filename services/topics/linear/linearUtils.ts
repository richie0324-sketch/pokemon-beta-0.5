
import { randInt, pick, simplifyFraction, gcd, formatAsFractionString } from "../../mathUtils";

export interface Point { x: number, y: number }
export interface Line { m: number, b: number } // y = mx + b

// Generate a random point within range
export const randPoint = (min = -9, max = 9): Point => ({
    x: randInt(min, max),
    y: randInt(min, max)
});

// Format point as "(x, y)"
export const fmtPoint = (p: Point): string => `(${p.x}, ${p.y})`;

// Format linear equation y = mx + b nicely
export const fmtLine = (m: number, b: number, variable = 'x'): string => {
    let mStr = '';
    
    // Format gradient using fractional string if needed
    const mFormatted = formatAsFractionString(m);

    if (m === 0) return `y = ${b}`;
    if (m === 1) mStr = variable;
    else if (m === -1) mStr = `-${variable}`;
    else mStr = `${mFormatted}${variable}`;

    if (b === 0) return `y = ${mStr}`;
    
    // We use standard " + " or " - " spacing so MathText regex can handle it
    const sign = b > 0 ? '+' : '-';
    // Format intercept as well (though usually integer in generator)
    const bAbs = Math.abs(b);
    const bFormatted = formatAsFractionString(bAbs);

    return `y = ${mStr} ${sign} ${bFormatted}`;
};

// Get Quadrant (1, 2, 3, 4 or Axis)
export const getQuadrant = (p: Point): string => {
    if (p.x === 0 && p.y === 0) return "Origin";
    if (p.x === 0) return "y-axis";
    if (p.y === 0) return "x-axis";
    if (p.x > 0 && p.y > 0) return "Quadrant I";
    if (p.x < 0 && p.y > 0) return "Quadrant II";
    if (p.x < 0 && p.y < 0) return "Quadrant III";
    return "Quadrant IV";
};

// Calculate slope between two points
export const calcSlope = (p1: Point, p2: Point): { num: number, den: number, val: number } => {
    const rise = p2.y - p1.y;
    const run = p2.x - p1.x;
    return {
        num: rise,
        den: run,
        val: run === 0 ? Infinity : rise / run
    };
};

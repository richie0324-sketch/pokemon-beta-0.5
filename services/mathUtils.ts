
// Shared Math Utilities

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const randExclude = (min: number, max: number, exclude: number[]): number => {
    let val;
    let safety = 0;
    do { 
        val = randInt(min, max); 
        safety++;
    } while (exclude.includes(val) && safety < 50);
    return val;
};

export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export const simplifyFraction = (num: number, den: number): string => {
    if (den === 0) return "undefined";
    if (num === 0) return "0";
    if (den < 0) { num = -num; den = -den; }
    if (num === den) return "1";
    if (num % den === 0) return (num / den).toString();
    const common = Math.abs(gcd(num, den));
    return `${num / common}/${den / common}`;
};

export const formatAsFractionString = (value: number): string => {
    if (Number.isInteger(value)) {
        return value.toString();
    }
    if (!isFinite(value)) {
        return "undefined";
    }

    const sign = value < 0 ? "-" : "";
    const absVal = Math.abs(value);
    
    // Check for common denominators up to 20 to handle recurring decimals (e.g., 0.6666 -> 2/3)
    for (let d = 2; d <= 20; d++) {
        const n = absVal * d;
        // Tolerance for floating point math
        if (Math.abs(n - Math.round(n)) < 0.0001) {
            const num = Math.round(n);
            // Re-simplify just in case (e.g. 4/6 -> 2/3)
            return `${sign}${simplifyFraction(num, d)}`;
        }
    }

    // Fallback: If no clean fraction found, format to max 2 decimals
    return parseFloat(value.toFixed(2)).toString();
};


// --- AUTOMATED DISTRACTOR ENGINE ---

export type AnswerType = 'integer' | 'fraction' | 'coordinate' | 'equation' | 'text' | 'slope_desc' | 'probability' | 'percentage';

export const generateDistractors = (correct: string, type: AnswerType): string[] => {
    const set = new Set<string>();
    set.add(correct); // Add correct first to check collisions

    let safeGuard = 0;
    while (set.size < 4 && safeGuard < 20) {
        safeGuard++;
        let d = "";

        switch (type) {
            case 'integer': {
                const val = parseInt(correct);
                const offset = randInt(1, Math.max(5, Math.abs(val * 0.5))) * (Math.random() > 0.5 ? 1 : -1);
                d = (val + offset).toString();
                break;
            }
            case 'probability': {
                // Handle 0-1 decimals or fractions
                if (correct.includes('/')) {
                    const [n, den] = correct.split('/').map(Number);
                    const newN = Math.max(1, Math.min(den - 1, n + (Math.random() > 0.5 ? 1 : -1) * randInt(1, 3)));
                    d = simplifyFraction(newN, den);
                    if (Math.random() > 0.8) d = simplifyFraction(den - n, den); // Complement
                } else if (!isNaN(Number(correct))) {
                    let val = parseFloat(correct);
                    // Ensure between 0 and 1
                    let offset = (Math.random() * 0.3) - 0.15;
                    let newVal = Math.max(0, Math.min(1, val + offset));
                    d = newVal.toFixed(2).replace(/\.00$/, '');
                } else {
                    d = pick(["0", "0.5", "1"]);
                }
                break;
            }
            case 'percentage': {
                const val = parseInt(correct.replace('%', ''));
                const choices = [
                    `${100 - val}%`, // Complement
                    `${Math.min(100, val + 10)}%`,
                    `${Math.max(0, val - 10)}%`,
                    `${Math.min(100, val + 25)}%`,
                    `${Math.max(0, val - 25)}%`,
                    `50%`
                ];
                d = pick(choices);
                break;
            }
            case 'fraction': {
                let n, den;
                if (correct.includes('/')) {
                    [n, den] = correct.split('/').map(Number);
                } else {
                    n = parseInt(correct); den = 1;
                }
                const choices = [
                    simplifyFraction(den - n, den), // Complement
                    simplifyFraction(den, n),       // Reciprocal Error
                    simplifyFraction(Math.abs(n - 1), den),
                    simplifyFraction(n, den + 1), 
                    simplifyFraction(n + den, den)  
                ];
                d = pick(choices);
                break;
            }
            case 'coordinate': {
                const match = correct.match(/-?\d+/g);
                if (match && match.length === 2) {
                    const [x, y] = match.map(Number);
                    const choices = [
                        `(${y}, ${x})`,       // Swap X/Y
                        `(${-x}, ${y})`,      // Sign Error X
                        `(${x}, ${-y})`,      // Sign Error Y
                        `(${-x}, ${-y})`,     // Double Sign Error
                        `(${x+1}, ${y})`,      
                        `(0, 0)`
                    ];
                    d = pick(choices);
                }
                break;
            }
            case 'equation': {
                const parts = correct.match(/y = (-?\d*)x ([+-] \d+)/);
                if (parts) {
                    d = pick([
                        correct.replace('+', 'TEMP').replace('-', '+').replace('TEMP', '-'), // Flip operator
                        correct.replace('y =', 'x ='), // Variable swap
                        `y = ${randInt(1,5)}x + ${randInt(1,5)}`,
                        `y = -${parts[1]}x ${parts[2]}` // Flip slope sign
                    ]);
                } else {
                    d = `y = ${randInt(2,5)}x + ${randInt(1,9)}`;
                }
                break;
            }
            case 'slope_desc': {
                const opts = ["Rising", "Falling", "Horizontal", "Vertical"];
                d = pick(opts);
                break;
            }
            case 'text':
            default:
                d = "Incorrect Option"; 
        }

        if (d && d !== "undefined" && !set.has(d)) {
            set.add(d);
        }
    }

    set.delete(correct);
    
    // Failsafe padding
    const defaults = ["0", "1", "0.5", "50%", "Impossible", "Certain"];
    let defIdx = 0;
    while (set.size < 3) {
        if (!set.has(defaults[defIdx]) && defaults[defIdx] !== correct) {
            set.add(defaults[defIdx]);
        }
        defIdx = (defIdx + 1) % defaults.length;
    }

    return Array.from(set);
};

// HELPER: Generates correct option + 3 distractors
export const generateOptions = (correct: string, type: AnswerType): string[] => {
    const distractors = generateDistractors(correct, type);
    return [correct, ...distractors];
};

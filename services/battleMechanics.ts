
import { Pokemon } from '../types';
import { getTypeEffectiveness, getBaseExpYield, getExpToNextLevel, MAX_LEVEL, getStatGrowth } from '../constants';
import { achievementService } from './achievementService';

/**
 * Calculates damage dealt from attacker to defender.
 * @param attacker The attacking Pokemon
 * @param defender The defending Pokemon
 * @param moveCoefficient Power coefficient of the move (e.g. 1.0, 1.2, 1.5)
 * @param isPlayerAttacking True if the player is attacking (for slight asymmetry/balancing if needed)
 * @param atkMultiplier Multiplier for attacker's attack stat (e.g. from items/buffs)
 * @param defMultiplier Multiplier for defender's defense stat (e.g. from items/buffs)
 */
export const calculateDamage = (
    attacker: Pokemon, 
    defender: Pokemon, 
    moveCoefficient: number,
    isPlayerAttacking: boolean,
    atkMultiplier: number = 1.0,
    defMultiplier: number = 1.0
): { damage: number, isCritical: boolean, effectiveness: number } => {
    
    // 1. Stats with Modifiers
    const A = Math.floor(attacker.attack * atkMultiplier);
    const D = Math.floor(defender.defense * defMultiplier);
    const level = attacker.level;

    // 2. Damage Calculation (New Balanced Formula)
    // Formula: ((Level/2 + 12) * Power * A/D) / 50 + 2
    // Power = 80 * MoveCoeff
    
    const levelFactor = (level / 2) + 12;
    const power = 80 * moveCoefficient;
    
    // Core Formula
    let rawDamage = ((levelFactor * power * (A / D)) / 50) + 2;

    // 3. Type Effectiveness
    const typeMult = getTypeEffectiveness(attacker.type, defender.type);

    // 4. Random Variance (0.85 to 1.0)
    const randomFactor = 0.85 + Math.random() * 0.15;

    // 5. Apply Multipliers
    rawDamage *= typeMult;
    rawDamage *= randomFactor;

    // Balance: Enemy attacks are slightly weaker to account for player needing to answer questions
    if (!isPlayerAttacking) {
        rawDamage *= 0.85;
    }

    const finalDamage = Math.max(1, Math.round(rawDamage));

    return {
        damage: finalDamage,
        isCritical: false, 
        effectiveness: typeMult
    };
};

/**
 * Calculates experience gained from defeating an enemy.
 */
export const calculateExpGain = (player: Pokemon, enemy: Pokemon): number => {
    if (player.level >= MAX_LEVEL) return 0; // Cap reached

    const baseExpFactor = getBaseExpYield(enemy.rarity);
    const diff = enemy.level - player.level;
    
    // Bonus for beating higher level enemies, penalty for lower
    const levelMultiplier = Math.max(0.5, Math.min(3.0, 1 + (0.2 * diff)));
    
    // 2.5x Multiplier Boost for faster progression
    return Math.round(baseExpFactor * enemy.level * levelMultiplier * 2.5);
};

/**
 * Checks if a Pokemon has enough EXP to level up and returns the new stats if so.
 * Returns null if no level up occurred.
 */
export const processLevelUp = (pokemon: Pokemon): Pokemon | null => {
    if (pokemon.level >= MAX_LEVEL) return null;
    if (pokemon.exp < pokemon.maxExp) return null;

    let p = { ...pokemon };
    let leveledUp = false;

    // Handle multiple level ups at once
    while (p.exp >= p.maxExp && p.level < MAX_LEVEL) {
        leveledUp = true;
        p.exp -= p.maxExp;
        p.level += 1;
        p.maxExp = getExpToNextLevel(p.level);
        
        // Trigger achievement event for each level gained
        achievementService.processEvent('POKEMON_LEVELED_UP', { pokemonId: p.id, newLevel: p.level });
        
        // Linear Growth Formula (Fixed +2 HP, +1 Atk, +1 Def)
        const growth = getStatGrowth(p.rarity);
        p.maxHp += growth.hp;
        p.attack += growth.atk;
        p.defense += growth.def;
        
        // Full heal on level up
        p.currHp = p.maxHp; 
    }

    // Discard overflow exp if max level
    if (p.level >= MAX_LEVEL) {
        p.exp = 0;
        p.maxExp = 0; 
    }

    return leveledUp ? p : null;
};


import { Item } from '../types';

export const ITEM_REGISTRY: Record<string, Item> = {
    // --- POKEBALLS ---
    'poke-ball': {
        id: 'poke-ball',
        name: 'Poke Ball',
        category: 'BALL',
        description: 'Standard device. Catch Rate: 1x. (Quantity: ∞)',
        price: 200,
        effectValue: 1.0, 
    },
    'great-ball': {
        id: 'great-ball',
        name: 'Great Ball',
        category: 'BALL',
        description: 'High-performance Ball. Catch Rate: 1.5x for the next throw.',
        price: 600,
        effectValue: 1.5,
    },
    'ultra-ball': {
        id: 'ultra-ball',
        name: 'Ultra Ball',
        category: 'BALL',
        description: 'Ultra-performance Ball. Catch Rate: 2.0x for the next throw.',
        price: 1200,
        effectValue: 2.0,
    },
    'master-ball': {
        id: 'master-ball',
        name: 'Master Ball',
        category: 'BALL',
        description: 'The ultimate Ball. Catch Rate: 100% Guaranteed.',
        price: 0, // Not for sale
        effectValue: 9999.0, // Guaranteed
    },

    // --- MEDICINE ---
    'potion': {
        id: 'potion',
        name: 'Potion',
        category: 'MEDICINE',
        description: 'Restores 20 HP to your active Pokemon.',
        price: 300,
        effectValue: 20,
    },
    'super-potion': {
        id: 'super-potion',
        name: 'Super Potion',
        category: 'MEDICINE',
        description: 'Restores 50 HP to your active Pokemon.',
        price: 700,
        effectValue: 50,
    },
    'hyper-potion': {
        id: 'hyper-potion',
        name: 'Hyper Potion',
        category: 'MEDICINE',
        description: 'Restores 200 HP to your active Pokemon.',
        price: 1200,
        effectValue: 200,
    },
    'max-potion': {
        id: 'max-potion',
        name: 'Max Potion',
        category: 'MEDICINE',
        description: 'Fully restores HP. Cannot be used on fainted Pokemon.',
        price: 2500,
        effectValue: 9999,
    },
    'revive': {
        id: 'revive',
        name: 'Revive',
        category: 'MEDICINE',
        description: 'Revives a fainted Pokemon with 50% HP.',
        price: 1500,
        effectValue: 0.5, 
    },
    'max-revive': {
        id: 'max-revive',
        name: 'Max Revive',
        category: 'MEDICINE',
        description: 'Revives a fainted Pokemon with 100% HP.',
        price: 4000,
        effectValue: 1.0, 
    },
    'rare-candy': {
        id: 'rare-candy',
        name: 'Rare Candy',
        category: 'MEDICINE',
        description: 'Instantly raises a Pokemon by 1 Level.',
        price: 4800, 
        effectValue: 1, 
    },

    // --- BATTLE ITEMS ---
    'escape-rope': {
        id: 'escape-rope',
        name: 'Escape Rope',
        category: 'BATTLE',
        description: 'Use to instantly escape from a wild battle.',
        price: 550,
    },
    'x-attack': {
        id: 'x-attack',
        name: 'X Attack',
        category: 'BATTLE',
        description: 'Doubles attack power for the remainder of the battle.',
        price: 500,
        effectValue: 2.0,
    },
    'x-defense': {
        id: 'x-defense',
        name: 'X Defense',
        category: 'BATTLE',
        description: 'Halves incoming damage for the remainder of the battle.',
        price: 500,
        effectValue: 0.5,
    },
    'admin-key': {
        id: 'admin-key',
        name: 'Admin Key',
        category: 'BATTLE',
        description: 'A glitched key that forces a "Victory" state instantly.',
        price: 0,
    },

    // --- KEY ITEMS ---
    'exp-share': {
        id: 'exp-share',
        name: 'Exp. Share',
        category: 'KEY',
        description: 'Give to a Pokemon in your party (not active) to share battle experience.',
        price: 0, // Not for sale
    },

    // --- EVOLUTION ITEMS ---
    'fire-stone': { id: 'fire-stone', name: 'Fire Stone', category: 'EVOLUTION', description: 'Triggers evolution for certain Fire-type Pokemon.', price: 2100 },
    'water-stone': { id: 'water-stone', name: 'Water Stone', category: 'EVOLUTION', description: 'Triggers evolution for certain Water-type Pokemon.', price: 2100 },
    'thunder-stone': { id: 'thunder-stone', name: 'Thunder Stone', category: 'EVOLUTION', description: 'Triggers evolution for certain Electric-type Pokemon.', price: 2100 },
    'leaf-stone': { id: 'leaf-stone', name: 'Leaf Stone', category: 'EVOLUTION', description: 'Triggers evolution for certain Grass-type Pokemon.', price: 2100 },
    'moon-stone': { id: 'moon-stone', name: 'Moon Stone', category: 'EVOLUTION', description: 'Triggers evolution for certain Fairy/Normal Pokemon.', price: 2100 },
    'sun-stone': { id: 'sun-stone', name: 'Sun Stone', category: 'EVOLUTION', description: 'Triggers evolution for certain Grass-type Pokemon.', price: 2100 },
    
    // Gen 2 Items
    'metal-coat': { id: 'metal-coat', name: 'Metal Coat', category: 'EVOLUTION', description: 'Triggers evolution for Onix and Scyther.', price: 2500 },
    'kings-rock': { id: 'kings-rock', name: "King's Rock", category: 'EVOLUTION', description: 'Triggers evolution for Poliwhirl and Slowpoke.', price: 2500 },
    'dragon-scale': { id: 'dragon-scale', name: 'Dragon Scale', category: 'EVOLUTION', description: 'Triggers evolution for Seadra.', price: 2500 },
    'up-grade': { id: 'up-grade', name: 'Up-Grade', category: 'EVOLUTION', description: 'Triggers evolution for Porygon.', price: 2500 },
};

// Evolution Mappings (Species ID -> Item ID -> Evolved Species ID)
// Unified map for ALL item-based evolutions (Stones + Special Items)
export const EVOLUTION_ITEM_MAP: Record<number, Record<string, number>> = {
    // Eevee
    133: { 
        'fire-stone': 136, 
        'water-stone': 134, 
        'thunder-stone': 135, 
        'sun-stone': 196, // Espeon
        'moon-stone': 197, // Umbreon
    },
    // Stones
    25: { 'thunder-stone': 26 }, // Pikachu -> Raichu
    35: { 'moon-stone': 36 }, // Clefairy -> Clefable
    39: { 'moon-stone': 40 }, // Jigglypuff -> Wigglytuff
    37: { 'fire-stone': 38 }, // Vulpix -> Ninetales
    58: { 'fire-stone': 59 }, // Growlithe -> Arcanine
    61: { 'water-stone': 62, 'kings-rock': 186 }, // Poliwhirl -> Poliwrath OR Politoed
    44: { 'leaf-stone': 45, 'sun-stone': 182 }, // Gloom -> Vileplume OR Bellossom
    102: { 'leaf-stone': 103 }, // Exeggcute -> Exeggutor
    120: { 'water-stone': 121 }, // Staryu -> Starmie
    90: { 'water-stone': 91 }, // Shellder -> Cloyster
    70: { 'leaf-stone': 71 }, // Weepinbell -> Victreebel
    30: { 'moon-stone': 31 }, // Nidorina -> Nidoqueen
    33: { 'moon-stone': 34 }, // Nidorino -> Nidoking
    191: { 'sun-stone': 192 }, // Sunkern -> Sunflora
    
    // Gen 2 Special Items
    95: { 'metal-coat': 208 }, // Onix -> Steelix
    123: { 'metal-coat': 212 }, // Scyther -> Scizor
    79: { 'kings-rock': 199 }, // Slowpoke -> Slowking (Note: Slowbro is Level up, user chooses path via item)
    117: { 'dragon-scale': 230 }, // Seadra -> Kingdra
    137: { 'up-grade': 233 }, // Porygon -> Porygon2
};

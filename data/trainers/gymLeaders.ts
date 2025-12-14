
import { Trainer, PokemonType } from '../../types';
import { SPRITE_BASE } from './constants';

// --- GENERATION 1 GYM LEADERS (KANTO) ---

export const brock: Trainer = {
    id: 'leader-brock', name: 'Brock', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/brock.png`, tier: 'Elite', teamSize: 2, baseMoney: 1500, badgeId: 'boulder',
    dialogue: { intro: "I believe in rock hard defense and determination!", win: "My defense was impenetrable!", lose: "Your will is harder than stone!" },
    preferredTypes: [PokemonType.ROCK, PokemonType.GROUND], rewardItems: [{ itemId: 'hard-stone', chance: 0.5 }]
};

export const misty: Trainer = {
    id: 'leader-misty', name: 'Misty', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/misty.png`, tier: 'Elite', teamSize: 2, baseMoney: 1800, badgeId: 'cascade',
    dialogue: { intro: "My policy is an all-out offensive with water types!", win: "You got washed away!", lose: "You are truly skilled!" },
    preferredTypes: [PokemonType.WATER, PokemonType.PSYCHIC], rewardItems: [{ itemId: 'mystic-water', chance: 0.5 }]
};

export const ltSurge: Trainer = {
    id: 'leader-surge', name: 'Lt. Surge', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/ltsurge.png`, tier: 'Elite', teamSize: 3, baseMoney: 2200, badgeId: 'thunder',
    dialogue: { intro: "I'll zap you into paralysis!", win: "At ease, soldier!", lose: "The war is over... for now." },
    preferredTypes: [PokemonType.ELECTRIC], rewardItems: [{ itemId: 'magnet', chance: 0.5 }]
};

export const erika: Trainer = {
    id: 'leader-erika', name: 'Erika', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/erika.png`, tier: 'Elite', teamSize: 3, baseMoney: 2600, badgeId: 'rainbow',
    dialogue: { intro: "My Pokémon are lovely, but deadly.", win: "Oh my, are you okay?", lose: "You are as strong as you are kind." },
    preferredTypes: [PokemonType.GRASS, PokemonType.POISON], rewardItems: [{ itemId: 'miracle-seed', chance: 0.5 }]
};

export const koga: Trainer = {
    id: 'leader-koga', name: 'Koga', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/koga.png`, tier: 'Elite', teamSize: 4, baseMoney: 3000, badgeId: 'soul',
    dialogue: { intro: "Despair creeps upon you like a shadow.", win: "Ninja techniques are superior.", lose: "You have seen through my illusions." },
    preferredTypes: [PokemonType.POISON, PokemonType.BUG], rewardItems: [{ itemId: 'poison-barb', chance: 0.5 }]
};

export const sabrina: Trainer = {
    id: 'leader-sabrina', name: 'Sabrina', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/sabrina.png`, tier: 'Master', teamSize: 4, baseMoney: 3500, badgeId: 'marsh',
    dialogue: { intro: "I had a vision of your arrival.", win: "I foresaw this outcome.", lose: "This future... was not predicted." },
    preferredTypes: [PokemonType.PSYCHIC, PokemonType.GHOST], rewardItems: [{ itemId: 'twisted-spoon', chance: 0.5 }]
};

export const blaine: Trainer = {
    id: 'leader-blaine', name: 'Blaine', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/blaine.png`, tier: 'Master', teamSize: 4, baseMoney: 4000, badgeId: 'volcano',
    dialogue: { intro: "My gym will incinerate all challengers!", win: "Burnt to a crisp!", lose: "You have extinguished my flame!" },
    preferredTypes: [PokemonType.FIRE], rewardItems: [{ itemId: 'charcoal', chance: 0.5 }]
};

export const giovanniGym: Trainer = {
    id: 'leader-giovanni', name: 'Giovanni', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/giovanni.png`, tier: 'Master', teamSize: 5, baseMoney: 5000, badgeId: 'earth',
    dialogue: { intro: "I will show you how I ruled the world.", win: "Pathetic.", lose: "A truly magnificent battle." },
    preferredTypes: [PokemonType.GROUND, PokemonType.ROCK], rewardItems: [{ itemId: 'soft-sand', chance: 0.5 }]
};

// --- GENERATION 2 GYM LEADERS (JOHTO) ---

export const falkner: Trainer = {
    id: 'leader-falkner', name: 'Falkner', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/falkner.png`, tier: 'Elite', teamSize: 2, baseMoney: 1500, badgeId: 'zephyr',
    dialogue: { intro: "The wind is with me!", win: "My birds soar highest!", lose: "My dad's bird Pokémon... lost?" },
    preferredTypes: [PokemonType.FLYING], rewardItems: [{ itemId: 'sharp-beak', chance: 0.5 }]
};

export const bugsy: Trainer = {
    id: 'leader-bugsy', name: 'Bugsy', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/bugsy.png`, tier: 'Elite', teamSize: 2, baseMoney: 1800, badgeId: 'hive',
    dialogue: { intro: "Bug Pokémon are deep and versatile!", win: "Did you learn something?", lose: "I need to study more..." },
    preferredTypes: [PokemonType.BUG], rewardItems: [{ itemId: 'silver-powder', chance: 0.5 }]
};

export const whitney: Trainer = {
    id: 'leader-whitney', name: 'Whitney', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/whitney.png`, tier: 'Elite', teamSize: 3, baseMoney: 2200, badgeId: 'plain',
    dialogue: { intro: "Everyone warns you about my Miltank!", win: "Rollout keeps rolling!", lose: "Waaaaah! You're mean!" },
    preferredTypes: [PokemonType.NORMAL], rewardItems: [{ itemId: 'moomoo-milk', chance: 1.0 }]
};

export const morty: Trainer = {
    id: 'leader-morty', name: 'Morty', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/morty.png`, tier: 'Elite', teamSize: 3, baseMoney: 2600, badgeId: 'fog',
    dialogue: { intro: "Do you believe in ghosts?", win: "You cannot touch the spirits.", lose: "I'm not yet worthy of the legend." },
    preferredTypes: [PokemonType.GHOST, PokemonType.POISON], rewardItems: [{ itemId: 'spell-tag', chance: 0.5 }]
};

export const chuck: Trainer = {
    id: 'leader-chuck', name: 'Chuck', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/chuck.png`, tier: 'Elite', teamSize: 4, baseMoney: 3000, badgeId: 'storm',
    dialogue: { intro: "Feel my roaring fists!", win: "Not enough training!", lose: "You have true strength." },
    preferredTypes: [PokemonType.FIGHTING], rewardItems: [{ itemId: 'black-belt', chance: 0.5 }]
};

export const jasmine: Trainer = {
    id: 'leader-jasmine', name: 'Jasmine', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/jasmine.png`, tier: 'Master', teamSize: 4, baseMoney: 3500, badgeId: 'mineral',
    dialogue: { intro: "The steel type is strong and cold.", win: "My defense is unbreakable.", lose: "You melted my defenses..." },
    preferredTypes: [PokemonType.STEEL, PokemonType.ELECTRIC], rewardItems: [{ itemId: 'metal-coat', chance: 0.5 }]
};

export const pryce: Trainer = {
    id: 'leader-pryce', name: 'Pryce', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/pryce.png`, tier: 'Master', teamSize: 4, baseMoney: 4000, badgeId: 'glacier',
    dialogue: { intro: "Winter is harsh, and so am I.", win: "Frozen solid.", lose: "Your fire melts the ice." },
    preferredTypes: [PokemonType.ICE, PokemonType.WATER], rewardItems: [{ itemId: 'never-melt-ice', chance: 0.5 }]
};

export const clair: Trainer = {
    id: 'leader-clair', name: 'Clair', title: 'Gym Leader',
    spriteUrl: `${SPRITE_BASE}/clair.png`, tier: 'Master', teamSize: 5, baseMoney: 5000, badgeId: 'rising',
    dialogue: { intro: "I am the world's best dragon master!", win: "As expected.", lose: "Impossible! I don't accept this!" },
    preferredTypes: [PokemonType.DRAGON, PokemonType.WATER], rewardItems: [{ itemId: 'dragon-scale', chance: 0.5 }]
};

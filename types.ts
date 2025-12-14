
export enum PokemonType {
  NORMAL = 'Normal',
  FIRE = 'Fire',
  WATER = 'Water',
  GRASS = 'Grass',
  ELECTRIC = 'Electric',
  ICE = 'Ice',
  FIGHTING = 'Fighting',
  POISON = 'Poison',
  GROUND = 'Ground',
  FLYING = 'Flying',
  PSYCHIC = 'Psychic',
  BUG = 'Bug',
  ROCK = 'Rock',
  GHOST = 'Ghost',
  DRAGON = 'Dragon',
  STEEL = 'Steel',
  DARK = 'Dark'
}

export type PokemonRarity = 'Common' | 'Rare' | 'Elite' | 'Ultra' | 'Legendary';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Challenge';

// --- NEW FIELD & QUEST TYPES ---
export type FieldTerrain = 'NORMAL' | 'SCORCHING_SUN' | 'THUNDER_STORM' | 'BLIZZARD' | 'VOLCANIC_ASH' | 'STATIC_FIELD' | 'MISTY_RAIN' | 'GLITCH_FIELD' | 'SANDSTORM' | 'JUNGLE';

export interface QuestState {
    active: boolean;
    bossSpeciesId: number;
    bossName: string;
    currentProgress: number;
    requiredProgress: number;
    objective: 'WIN_BATTLES' | 'CATCH_POKEMON' | 'CLEAR_DUNGEON'; // Added CLEAR_DUNGEON
    introText: string;
}

export interface PokemonStats {
    hp: number;
    atk: number;
    def: number;
}

export type EvolutionMethod = 'level' | 'item' | 'trade' | 'friendship';

export interface EvolutionRequirement {
  method: EvolutionMethod;
  level?: number;
  item?: string;
}

export interface PokedexEntry {
  speciesId: number;
  name: string;
  type: PokemonType;
  rarity: PokemonRarity;
  generation: 1 | 2;
  evolvesTo?: number; 
  evolutionReq?: EvolutionRequirement;
  isBasic: boolean;
  baseStats: PokemonStats;
}

export interface Pokemon {
  id: string;
  speciesId: number;
  name: string;
  type: PokemonType;
  rarity: PokemonRarity;
  
  // Stats
  maxHp: number;
  currHp: number;
  attack: number;
  defense: number; 
  
  // Individual Values (Potential)
  ivs: {
      hp: number;
      atk: number;
      def: number;
  };

  imageUrl: string;
  description: string; 
  isLegendary?: boolean;
  
  // Progression
  level: number;
  exp: number;      
  maxExp: number;   
  
  // Items
  isHoldingExpShare?: boolean;
}

// --- ITEM SYSTEM ---

export type ItemCategory = 'BALL' | 'MEDICINE' | 'BATTLE' | 'EVOLUTION' | 'KEY';

export interface Item {
    id: string;
    name: string;
    category: ItemCategory;
    description: string;
    price: number;
    effectValue?: number; // HP amount, Catch Rate Multiplier, etc.
    icon?: string; // Icon identifier
}

export interface InventorySlot {
    itemId: string;
    count: number;
}

// --- NPC & TRAINER SYSTEM ---

export type TrainerTier = 'Common' | 'Elite' | 'Master';

export interface Trainer {
    id: string;
    name: string;
    title: string; 
    spriteUrl: string; 
    tier: TrainerTier;
    dialogue: {
        intro: string;
        win: string;
        lose: string;
    };
    preferredTypes: PokemonType[];
    teamSize: number; // 1-6
    baseMoney: number;
    rewardItems?: { itemId: string, chance: number }[];
    badgeId?: string; // NEW: If present, defeating this trainer awards a badge
}

// --- RANDOM EVENT SYSTEM ---

export type EventTriggerType = 'ON_TURN_START' | 'ON_WIN' | 'ON_LOSE' | 'ON_LOW_HP' | 'RANDOM_ANYTIME';
export type RandomEventKind = 'trade_evolution' | 'legendary' | 'shop' | 'curio' | 'ultra_perfect' | 'trainer_common' | 'weather_control' | 'quest_trigger' | 'dungeon_step';

export interface EncounterModifier {
    type: 'FORCE_TYPE';
    types: PokemonType[];
    remaining: number;
    label: string;
}

export interface GameContext {
    playerPokemon: Pokemon;
    streak: number;
    money: number;
    turnCount: number;
    inventory: InventorySlot[];
}

// Unified interface for all game operations available to events
export interface GameActions {
    // Player State
    player: {
        pokemon: Pokemon | null;
        healActive: () => void;
        damageActivePct: (pct: number) => void;
        addMoney: (amount: number) => void;
        addItem: (id: string, count: number) => void;
        removeItem: (id: string, count: number) => void;
        hasItem: (id: string) => boolean;
        getInventory: () => InventorySlot[];
        getAllCaught: () => Pokemon[];
    };
    
    // Game State
    game: {
        setEncounterModifier: (mod: EncounterModifier | null) => void;
        addBuff: (id: string, duration: number) => void;
        setBackpackTab: (tab: 'ITEMS' | 'TEAM') => void;
        triggerEvolution: (pokemon: Pokemon, target: PokedexEntry) => void;
        
        // NEW: Quest System
        startQuest: (terrain: FieldTerrain, bossId: number, bossName: string, objective: QuestState['objective'], count: number) => void;
    };

    // Battle State
    battle: {
        startWild: (enemy: Pokemon) => void;
        startTrainer: (trainer: Trainer) => void;
        setModifiers: (mods: { atk?: number, def?: number }) => void;
    };

    // UI
    ui: {
        showToast: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
        playSound: (key: 'click' | 'correct' | 'incorrect' | 'attack' | 'damage' | 'throw' | 'catch' | 'run' | 'start') => void;
        closeEvent: () => void;
        openShop: () => void;
    };
}

export interface EventResult {
    description: string;
    type?: 'positive' | 'negative' | 'neutral';
}

export interface EventChoice {
    label: string;
    riskText?: string;
    reqItem?: string; 
    onSelect: (actions: GameActions, event: GameEvent) => EventResult | void; 
}

export interface ShopOffer {
    itemId: string;
    price: number;
    count: number;
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    image?: string; 
    trigger: EventTriggerType;
    chance: number; 
    kind?: RandomEventKind;
    
    condition?: (ctx: GameContext) => boolean;
    
    effects: {
        moneyChange?: number;
        healActive?: boolean; 
        damagePlayerPct?: number; 
        giveItem?: { itemId: string, count: number };
        buffAtk?: boolean;
        buffDef?: boolean;
    };
    
    // Context data (e.g. which pokemon is evolving, what is in the shop)
    data?: Record<string, any>;
    
    choices: EventChoice[];
}

// --- ACHIEVEMENT SYSTEM ---
export type AchievementTrigger = 
  | 'POKEMON_CAUGHT' // payload: { speciesId: number, rarity: PokemonRarity }
  | 'BATTLE_WON'     // payload: { isTrainer: boolean, streak: number, trainerId?: string }
  | 'ITEM_USED'      // payload: { itemId: string }
  | 'POKEMON_LEVELED_UP' // payload: { pokemonId: string, newLevel: number }
  | 'POKEMON_EVOLVED';   // payload: { prevSpeciesId: number, nextSpeciesId: number }

export interface AchievementReward {
    money?: number;
    itemId?: string;
    itemCount?: number;
    pokemon?: {
        speciesId: number;
        level: number;
    };
}

export interface PlayerStateForAchievements {
    caughtHistory: number[];
    money: number;
    defeatedTrainers: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  trigger: AchievementTrigger;
  condition: (payload: any, playerState: PlayerStateForAchievements) => boolean;
  reward?: AchievementReward;
  isHidden?: boolean; // For secret achievements
}
// -------------------

export interface MathQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty?: string;
}

export type MathTopic = 'linear' | 'probability';

export enum GameState {
  MENU_MAIN = 'MENU_MAIN',
  MENU_TOPIC_SELECT = 'MENU_TOPIC_SELECT',
  MENU_NAME_INPUT = 'MENU_NAME_INPUT',
  MENU_STARTER_SELECT = 'MENU_STARTER_SELECT',
  MENU_MULTIPLAYER = 'MENU_MULTIPLAYER', 
  MULTIPLAYER_BATTLE = 'MULTIPLAYER_BATTLE', // New State for P2P Battles
  
  WILD_ENCOUNTER = 'WILD_ENCOUNTER',
  TRAINER_INTRO = 'TRAINER_INTRO', // New: VS Screen
  
  BATTLE_COMBAT = 'BATTLE_COMBAT',
  CATCH_PHASE = 'CATCH_PHASE', 
  VICTORY_CAUGHT = 'VICTORY_CAUGHT',
  DEFEAT = 'DEFEAT',
  
  BACKPACK = 'BACKPACK', 
  POKEDEX = 'POKEDEX',   
  PC_STORAGE = 'PC_STORAGE', // New: PC
  ACHIEVEMENTS = 'ACHIEVEMENTS', // New: Achievements
  TRAINER_CARD = 'TRAINER_CARD', // NEW: Trainer Card
  
  PAUSED = 'PAUSED',
  EVOLUTION = 'EVOLUTION',

  EVENT_ACTIVE = 'EVENT_ACTIVE',
  RESCUE_CENTER = 'RESCUE_CENTER',
  WEATHER_LAB = 'WEATHER_LAB',
  UI_DEBUGGER = 'UI_DEBUGGER' // New Debugger State
}

export interface SaveData {
  playerName: string;
  playerAvatar?: string; // NEW: Stores the sprite URL
  trainerId: string; // NEW: Persistent ID
  badges: string[]; // NEW: Collected Badges
  selectedTopic: MathTopic;
  playerPokemon: Pokemon;
  caughtPokemon: Pokemon[]; // The Party (Max 6)
  storagePokemon: Pokemon[]; // New: The PC
  seenSpeciesIds?: number[];
  caughtHistory?: number[]; 
  inventory: InventorySlot[]; 
  money: number; 
  streak: number;
  targetStreak: number; 
  saveDate: number;
  defeatedTrainers?: string[]; // Track unique trainers beaten
  unlockedAchievements?: Record<string, number>; // New: Achievements
  
  // New Fields for Persistence
  activeBuffs?: Record<string, number>;
  activeQuest?: QuestState | null;
  activeField?: FieldTerrain;
}

// --- MULTIPLAYER PROTOCOL ---
export type PeerMessageType = 
    | 'HANDSHAKE' 
    | 'SYNC_TEAM'
    | 'CHALLENGE_REQUEST'
    | 'CHALLENGE_RESPONSE'
    | 'BATTLE_INIT'      // { seed: number, firstPlayerId: string }
    | 'BATTLE_MOVE'      // { type: 'ATTACK' | 'MISS' | 'SWITCH', damage?: number, switchId?: string, name?: string }
    | 'TURN_END'         // Transfer control
    | 'BATTLE_WIN'       // I won (you lost)
    | 'TRADE_OFFER';

export interface PeerMessage {
    type: PeerMessageType;
    payload: any;
}

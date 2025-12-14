# Pokemon Math Adventure

## Overview

Pokemon Math Adventure is an educational RPG game designed for Australian Year 8 students to practice mathematics concepts (Linear Equations and Probability) through Pokemon-style battles and monster catching mechanics. Players solve math problems to attack enemies, catch Pokemon, and progress through the game. The application is built as a single-page React application using Vite, TypeScript, and Zustand for state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and bundling
- **Styling**: Tailwind CSS via CDN with custom animations defined in index.html
- **State Management**: Zustand with three main stores:
  - `useGameStore` - Game state, navigation, settings, evolution queue
  - `usePlayerStore` - Player data, Pokemon party, inventory, money
  - `useBattleStore` - Battle state, enemy data, animations, modifiers

### Game State Machine
The game uses a `GameState` enum to manage screen transitions. States include menus, battles, catch phases, victory/defeat screens, and utility views (backpack, pokedex, PC box).

### Data Layer
- **Pokemon Data**: Split into generation files (`gen1.ts`, `gen2.ts`) containing species definitions
- **Pokedex Registry**: Centralized Pokemon database with evolution chains, base stats, and rarity
- **Item System**: Registry-based item definitions with categories (balls, medicine, evolution items)
- **Stats System**: Separate stat files per generation for base stat lookups

### Math Engine
- **Topic Registry Pattern**: Questions are generated through a dispatcher (`topicRegistry.ts`) that routes to topic-specific generators
- **Difficulty Scaling**: Question difficulty scales with Pokemon rarity (Common → Legendary = Easy → Challenge)
- **Local Generation**: All math questions are generated client-side without API calls

### Battle System
- **Turn-based Combat**: Player answers math questions to attack; correct answers deal damage based on difficulty coefficient
- **Type Effectiveness**: Full Pokemon type chart implementation for damage multipliers
- **Catch Mechanics**: HP-based catch rate system with different Pokeball effectiveness
- **Trainer Battles**: NPC trainers with preset teams, coin flip for turn order, timed responses

### Audio System
- **Web Audio API**: Synthesized chiptune-style music and sound effects
- **Dynamic BGM**: Background music changes based on game state (menu, battle, victory)

## External Dependencies

### NPM Packages
- `react` / `react-dom` - UI framework
- `zustand` - Lightweight state management
- `peerjs` - WebRTC peer-to-peer connections for multiplayer features
- `lucide-react` - Icon library

### External Resources
- **Pokemon Sprites**: PokeAPI official artwork CDN (`raw.githubusercontent.com/PokeAPI/sprites`)
- **Trainer Sprites**: Pokemon Showdown sprite repository
- **Fonts**: Google Fonts (Fredoka, Press Start 2P, Roboto Mono)
- **Tailwind CSS**: CDN-loaded utility CSS framework

### Browser APIs
- `localStorage` - Game save persistence
- `AudioContext` - Sound generation
- `WebRTC` (via PeerJS) - Multiplayer connectivity

### Optional Integration
- **Gemini API**: Environment variable `GEMINI_API_KEY` suggests potential AI integration, though `geminiService.ts` is currently empty

## Recent Changes (December 2025)

### Zustand 5.x Migration
- Migrated state selectors to use `useShallow` from `zustand/shallow` to prevent infinite render loops
- Updated components: `BattleScreen`, `MathBattle`, `VictoryScreen`, `PCBox`, `GameModals` (App.tsx)
- Pattern: Object selectors must use `useShallow()` wrapper; single-value selectors remain unchanged

### Vite Configuration
- Configured for Replit environment: port 5000, allowedHosts enabled for iframe preview
- TypeScript `isolatedModules` requires explicit `export type` for type-only re-exports

### Resource Cleanup
- Added cleanup function to `useGameAudio` hook for proper BGM resource cleanup on state transitions
- Timer cleanup already implemented in `useGameLogic` useEffect hooks

### Linear Question Engine Expansion (December 2025)
Major expansion of the Linear topic question generators to meet curriculum requirements:

**Question Type Coverage (200+ total types):**
- **coordinateEngine.ts**: 50+ Easy types (origin, axes, quadrants, same-quadrant, max/min coordinates, sorting, distance, closeness to line)
- **algebraEngine.ts**: 75+ types across difficulties
  - Easy (20+ types): Substitution, expand a(x±b), k(2x±b), simplify ax±bx, 4-term combine, coefficient/constant identification
  - Medium (10 types): Reverse solve, rate comparison, scenario modeling, change calculation
  - Hard (5 types): Scenario equations, fastest growth/decline, plan comparison
- **slopeEngine.ts**: 50+ types across difficulties
  - Easy (12+ types): Identify m/b, positive/negative/zero slope, rise/fall, rise/run, Δy/Δx
  - Medium (7 types): Two-point slope, steepness comparison, rate context
  - Hard (5 types): Parallel, perpendicular, fastest fall, multi-line comparison
- **challengeEngine.ts**: 15 comprehensive challenge types (two-point-to-y, scenario identification, matching, collinearity, model comparison, HP game model, plan comparison, ranking, find equation, reverse solve, y-intercept comparison, fuel consumption, midpoint)

**Difficulty Distribution:**
- Easy: ~50 types (coordinateEngine + algebraEngine Easy + slopeEngine Easy)
- Medium: ~30 types (algebraEngine Medium + slopeEngine Medium)
- Hard: ~15 types (slopeEngine Hard + algebraEngine Hard)
- Challenge: 15 types (challengeEngine)

### Toast Notification System (December 2025)
Replaced all browser `alert()` popups with in-game toast notifications:
- **Toast Store**: `store/useToastStore.ts` - Zustand store with timer cleanup guards to prevent stale closure issues
- **Toast Component**: `components/GameToast.tsx` - Animated notifications with success/warning/error/info variants
- **Integration**: Toast component added to App.tsx, renders at bottom-center of screen
- **Coverage**: All alerts replaced across DebugMenu, PCBox, PokemonDetailModal, BackpackView, MultiplayerMenu, useGameLogic

### Battle System Bug Fixes (December 2025)
- **Captured Pokemon HP**: Pokemon now join the party with 1/3 of max HP instead of being fainted
- **Master Ball Mechanics**: Fixed to properly grant experience points, increment streak counter, and call endBattle() for proper state cleanup
- **State Management**: Master Ball captures now follow the same victory flow as normal catches to ensure consistent UI state transitions

### Australian Curriculum Localisation (December 2025)
Complete terminology and content localisation for Australian Year 8 mathematics standards:

**Terminology Updates:**
- "slope" → "gradient" throughout all question engines
- "y = mx + b" → "y = mx + c" in all equations and explanations
- "Undefined slope" → "No gradient" for vertical lines
- Topic labels updated from "Linear (Slope)" to "Linear (Gradient)"

**Context Localisation:**
- Scenarios use Australian examples: mobile plans, car hire, footy club fees, Uber rides
- Units use Australian conventions: "metres" (not "meters")
- Currency assumed as AUD

**Files Updated:**
- `slopeEngine.ts` - All gradient terminology, Australian contexts
- `algebraEngine.ts` - Updated variable naming (b → c), localised scenarios
- `challengeEngine.ts` - Australian scenarios (footy clubs, mobile plans)

### Difficulty Rebalancing (December 2025)
Simplified Easy questions and moved harder items to Medium for Year 8 appropriateness:

**Easy Level Changes:**
- **slopeEngine**: Removed negative gradient identification from Easy; now uses only positive gradients. Easy focuses on basic gradient identification (y = mx + c), positive/negative/zero classification, and directional understanding
- **algebraEngine**: Simplified to basic substitution (positive coefficients only), single-variable expansion a(x ± b), combining like terms (2-3 terms), coefficient/constant identification
- **coordinateEngine**: Kept quadrant identification, axis points, largest/smallest coordinate questions; removed sorting 4+ points and distance calculations

**Moved from Easy to Medium:**
- Rise/run calculations with fractions
- Negative coefficient identification and operations
- Multi-term simplification (4+ terms)
- Point sorting by coordinate
- Distance from origin calculations
- Points on line verification

**Medium Level Additions:**
- Negative gradient identification and direction questions
- Rise/run with positive and negative rise values
- Two-point gradient calculations
- Multi-term expression simplification
- Steepness comparison between lines
- Rate of change context questions

### Probability Question Engine Expansion (December 2025)
Major expansion of Probability topic question generators to meet 100+ question types requirement:

**Question Type Coverage (160+ total types):**
- **easyEngine.ts**: 100 distinct question types covering:
  - Terminology (Impossible, Unlikely, Even Chance, Likely, Certain)
  - Simple selection (balls in bags, spinners, cards)
  - Coins and dice fundamentals
  - Basic fraction probability calculations
  - Real-world contexts (weather, sports, raffles)
  - Sample space identification
  - Frequency interpretation
  - Australian contexts (AFL, netball, cricket, footy)

- **mediumEngine.ts**: 60 question types covering:
  - Complement events P(not A) = 1 - P(A)
  - P(A or B) for mutually exclusive events
  - Experimental probability from trial data
  - Compound events (spinner × coin, die × coin)
  - Simple vs compound event classification
  - Independence concept introduction
  - Probability conversions (fraction ↔ decimal ↔ percentage)

- **hardEngine.ts**: 30 question types covering:
  - Two-step sample spaces (die × die, coin × coin × coin)
  - P(A and B) for independent events
  - "At least one" probability calculations
  - Probability comparison across formats
  - Mutually exclusive addition rule
  - Compound probability multiplication

- **Challenge section**: 20 question types covering:
  - Reverse calculation (find total from probability)
  - Expected frequency calculations
  - Dependent events without replacement
  - Fairness comparison between games
  - Multi-step reasoning problems

**Difficulty Distribution:**
- Easy: 100 types (terminology, simple calculations, basic concepts)
- Medium: 60 types (complements, compound events, conversions)
- Hard: 30 types (sample spaces, independence, multi-step)
- Challenge: 20 types (reverse, expected value, dependent events)

**Year 8 Appropriateness:**
- Easy: Uses only positive whole numbers, simple fractions, basic concepts
- Medium: Introduces complements, simple compound events, percentage conversions
- Hard: Multi-step reasoning without complex algebra
- Challenge: Real-world application problems at appropriate complexity

### Pokemon Encounter Rate Rebalancing (December 2025)
Adjusted encounter probabilities to ensure new players face mostly easy questions:

**Rarity by Player Level (pokemonGenService.ts):**
| Level | Common | Rare | Elite | Ultra | Legendary |
|-------|--------|------|-------|-------|-----------|
| 1-4   | 90%    | 10%  | 0%    | 0%    | 0%        |
| 5-9   | 75%    | 22%  | 3%    | 0%    | 0%        |
| 10-14 | 60%    | 32%  | 8%    | 0%    | 0%        |
| 15-19 | 45%    | 38%  | 14%   | 3%    | 0%        |
| 20-29 | 30%    | 36%  | 20%   | 14%   | 0%        |
| 30-39 | 22%    | 32%  | 26%   | 18%   | 2%        |
| 40+   | 18%    | 28%  | 28%   | 22%   | 4%        |

**Difficulty Progression:**
- **Levels 1-4**: ~90% Easy questions (Common dominates)
- **Levels 5-9**: ~75% Easy, ~15% Medium (Rare introduces Medium)
- **Levels 10-14**: ~60% Easy, ~25% Medium (Elite adds Hard)
- **Levels 15-19**: ~50% Easy, ~35% Medium (Ultra adds Challenge)
- **Levels 20-29**: No Legendary yet, focus on Ultra difficulty
- **Levels 30-39**: Legendary unlocks at 2% (strictly controlled)
- **Levels 40+**: Legendary at 4% (still rare)

**Design Rationale:**
- New players build confidence with mostly Easy questions
- Gradual difficulty increase as mastery develops
- Legendary Pokemon strictly controlled: only appears at Level 30+ with max 4% chance
- Requires significant gameplay investment to encounter Legendary Pokemon
- Matches educational scaffolding principles for Year 8 learners
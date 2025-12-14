
import { GameEvent } from '../types';

// Import events from categorized folders
import { weatherStationEvent } from './events/weatherStation';
import { minecraftSteveEvent } from './events/popCulture/minecraftSteve';
import { robloxNoobEvent } from './events/popCulture/robloxNoob';
import { fortniteStormEvent } from './events/popCulture/fortniteStorm';
import { ultraSignalEvent } from './events/distortions/ultraSignal';
import { travelingShopEvent } from './events/travelingShop';
import { linkTradeEvent } from './events/misc/linkTrade';
import { elementalShrineEvent } from './events/elementalShrine';
import { distortionEvent } from './events/distortions/distortionEvent';

// Exploration
import { strangeTreeEvent } from './events/exploration/strangeTree';
import { fossilExcavationEvent } from './events/exploration/fossilExcavation';
import { ancientTruckEvent } from './events/exploration/ancientTruck'; 

// Johto Legends
import { hoOhEvent, lugiaEvent } from './events/quest/johtoLegends';

import { magikarpSalesmanEvent } from './events/risk/magikarpSalesman';
import { madScientistEvent } from './events/risk/madScientist';
import { dayCareEvent } from './events/services/dayCare';
import { moveTutorEvent } from './events/services/moveTutor';
import { quizMasterEvent } from './events/math/quizMaster';
import { glitchedAtmEvent } from './events/math/glitchedATM';

/**
 * GLOBAL EVENT REGISTRY
 * Aggregates all individual event files.
 */
export const GLOBAL_EVENTS: GameEvent[] = [
    // Quest Triggers
    elementalShrineEvent,
    distortionEvent,
    hoOhEvent,
    lugiaEvent,
    
    // Special Mechanic Events
    weatherStationEvent,
    
    // Pop Culture Collabs
    minecraftSteveEvent,
    robloxNoobEvent,
    fortniteStormEvent,
    
    // Core Game Mechanics
    ultraSignalEvent,
    travelingShopEvent,
    linkTradeEvent,

    // Exploration
    strangeTreeEvent,
    fossilExcavationEvent,
    ancientTruckEvent,

    // Risk & Reward
    magikarpSalesmanEvent,
    madScientistEvent,

    // Services
    dayCareEvent,
    moveTutorEvent,

    // Math Challenges
    quizMasterEvent,
    glitchedAtmEvent
];

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { audioService } from '../../services/audioService';
import { GameState, PokemonType, GameEvent } from '../../types';
import { createPokemonInstance } from '../../services/pokemonGenService';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';
import { NPC_REGISTRY } from '../../data/trainerData';
import { GLOBAL_EVENTS } from '../../data/eventRegistry';
import { ITEM_REGISTRY } from '../../data/itemData';
import { ArrowLeft, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';

// Import all screens
import { MainMenu } from './MainMenu';
import { TopicSelect } from './TopicSelect';
import { NameInput } from './NameInput';
import { StarterSelect } from './StarterSelect';
import { EncounterScreen } from './EncounterScreen';
import { VictoryScreen } from './VictoryScreen';
import { DefeatScreen } from './DefeatScreen';
import { EvolutionScreen } from './EvolutionScreen';
import { TrainerIntro } from './TrainerIntro';
import { RescueCenter } from './RescueCenter';
import { MultiplayerMenu } from './MultiplayerMenu';
import { BattleScreen } from './BattleScreen';
import { WeatherLab } from './WeatherLab';
import MathBattle from '../MathBattle';

// Import Overlays/Modals
import BackpackView from '../BackpackView';
import PokedexView from '../PokedexView';
import { PCBox } from '../PCBox';

// Import New Event Views (Directly from source, bypassing debug duplicates)
import { ShopEventView } from '../events/travelingShop/ShopEventView';
import { ElementalShrineView } from '../events/elementalShrine/ElementalShrineView';
import { WeatherStationView } from '../events/weatherStation/WeatherStationView';
import { DistortionView } from '../events/distortions/DistortionView';
import { MinecraftSteveView } from '../events/popCulture/MinecraftSteveView';
import { RobloxNoobView } from '../events/popCulture/RobloxNoobView';
import { FortniteStormView } from '../events/popCulture/FortniteStormView';
import { UltraSignalView } from '../events/distortions/UltraSignalView';
import { LinkTradeView } from '../events/misc/LinkTradeView';

// --- MOCK DATA GENERATORS ---
const MOCK_CHARMANDER = createPokemonInstance(POKEDEX_REGISTRY.find(p => p.speciesId === 4)!, false, 5);
const MOCK_SQUIRTLE = createPokemonInstance(POKEDEX_REGISTRY.find(p => p.speciesId === 7)!, false, 5);
const MOCK_MEWTWO = createPokemonInstance(POKEDEX_REGISTRY.find(p => p.speciesId === 150)!, true, 50);
const MOCK_CHARIZARD = createPokemonInstance(POKEDEX_REGISTRY.find(p => p.speciesId === 6)!, false, 36);

// Helper to generate a full team
const getMockTeam = () => [
    { ...MOCK_CHARIZARD, currHp: 120, maxHp: 150 },
    { ...MOCK_SQUIRTLE, currHp: 0, maxHp: 45 }, // Fainted
    createPokemonInstance(POKEDEX_REGISTRY[24], false, 12), // Pikachu
    createPokemonInstance(POKEDEX_REGISTRY[149], false, 55), // Mewtwo
];

// Helper to generate inventory
const getMockInventory = () => [
    { itemId: 'poke-ball', count: 50 },
    { itemId: 'master-ball', count: 1 },
    { itemId: 'potion', count: 5 },
    { itemId: 'revive', count: 2 },
    { itemId: 'rare-candy', count: 99 },
    { itemId: 'fire-stone', count: 1 },
];

interface Scene {
    id: string;
    category: 'Core' | 'Battle' | 'Utility' | 'Event';
    label: string;
    component: React.ReactNode;
    setup: () => void;
}

export const UIDebugger: React.FC = () => {
    const { setGameState, resetGame, setUiDebuggerOpen } = useGameStore.getState();
    const [activeSceneId, setActiveSceneId] = useState('main_menu');
    const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [refreshKey, setRefreshKey] = useState(0); // Force re-render of scene

    // Helper to find event by ID
    const getEvent = (id: string) => GLOBAL_EVENTS.find(e => e.id === id)!;

    const SCENES: Scene[] = [
        // --- CORE FLOW ---
        {
            id: 'main_menu', category: 'Core', label: 'Main Menu',
            component: <MainMenu />,
            setup: () => { useGameStore.setState({ gameState: GameState.MENU_MAIN }); }
        },
        {
            id: 'topic_select', category: 'Core', label: 'Topic Select',
            component: <TopicSelect />,
            setup: () => { useGameStore.setState({ gameState: GameState.MENU_TOPIC_SELECT }); }
        },
        {
            id: 'name_input', category: 'Core', label: 'Name Input',
            component: <NameInput />,
            setup: () => { useGameStore.setState({ gameState: GameState.MENU_NAME_INPUT }); }
        },
        {
            id: 'starter_select', category: 'Core', label: 'Starter Select',
            component: <StarterSelect />,
            setup: () => { useGameStore.setState({ selectedTopic: 'linear', gameState: GameState.MENU_STARTER_SELECT }); }
        },
        {
            id: 'multiplayer', category: 'Core', label: 'Multiplayer Menu',
            component: <MultiplayerMenu />,
            setup: () => { 
                useGameStore.setState({ gameState: GameState.MENU_MULTIPLAYER, playerName: 'DEBUGGER' });
                usePlayerStore.setState({ playerPokemon: MOCK_CHARMANDER });
            }
        },

        // --- BATTLE SCENES ---
        {
            id: 'encounter_wild', category: 'Battle', label: 'Encounter (Wild)',
            component: <EncounterScreen />,
            setup: () => { 
                useBattleStore.setState({ enemyPokemon: MOCK_SQUIRTLE });
                useGameStore.setState({ gameState: GameState.WILD_ENCOUNTER }); 
            }
        },
        {
            id: 'encounter_legendary', category: 'Battle', label: 'Encounter (Legendary)',
            component: <EncounterScreen isLegendary={true} />,
            setup: () => { 
                useBattleStore.setState({ enemyPokemon: MOCK_MEWTWO });
                useGameStore.setState({ gameState: GameState.WILD_ENCOUNTER });
            }
        },
        {
            id: 'trainer_intro', category: 'Battle', label: 'Trainer Intro (Joey)',
            component: <TrainerIntro />,
            setup: () => {
                usePlayerStore.setState({ playerPokemon: MOCK_CHARMANDER });
                useBattleStore.setState({ currentTrainer: NPC_REGISTRY['youngster-joey'], isTrainerBattle: true });
                useGameStore.setState({ gameState: GameState.TRAINER_INTRO });
            }
        },
        {
            id: 'battle_screen', category: 'Battle', label: 'Battle Combat UI',
            component: <BattleScreen><MathBattle /></BattleScreen>,
            setup: () => {
                usePlayerStore.setState({ playerPokemon: MOCK_CHARMANDER });
                useBattleStore.setState({ 
                    enemyPokemon: MOCK_SQUIRTLE, 
                    isTrainerBattle: false,
                    battleMessage: null,
                    catchAnim: 'none',
                    attackAnim: 'none',
                    damageAnim: 'none',
                    streak: 5,
                    targetStreak: 10
                });
                useGameStore.setState({ gameState: GameState.BATTLE_COMBAT, activeField: 'NORMAL', encounterModifier: null });
            }
        },
        {
            id: 'victory_catch', category: 'Battle', label: 'Victory (Caught)',
            component: <VictoryScreen />,
            setup: () => {
                useBattleStore.setState({ 
                    enemyPokemon: MOCK_SQUIRTLE, 
                    lastRewards: null, 
                    streak: 5, 
                    isTrainerBattle: false 
                });
                useGameStore.setState({ gameState: GameState.VICTORY_CAUGHT });
            }
        },
        {
            id: 'victory_trainer', category: 'Battle', label: 'Victory (Trainer)',
            component: <VictoryScreen />,
            setup: () => {
                useBattleStore.setState({ 
                    enemyPokemon: MOCK_SQUIRTLE,
                    lastRewards: { money: 1000, items: [{ itemId: 'rare-candy', count: 1 }] },
                    streak: 10,
                    isTrainerBattle: true
                });
                useGameStore.setState({ gameState: GameState.VICTORY_CAUGHT });
            }
        },
        {
            id: 'defeat_switch', category: 'Battle', label: 'Defeat (Switch)',
            component: <DefeatScreen />,
            setup: () => {
                usePlayerStore.setState({ 
                    playerPokemon: { ...MOCK_CHARMANDER, currHp: 0 },
                    caughtPokemon: [{ ...MOCK_CHARMANDER, currHp: 0 }, MOCK_SQUIRTLE]
                });
                useGameStore.setState({ gameState: GameState.DEFEAT });
            }
        },
        {
            id: 'defeat_wipeout', category: 'Battle', label: 'Defeat (Wipeout)',
            component: <DefeatScreen />,
            setup: () => {
                usePlayerStore.setState({ 
                    playerPokemon: { ...MOCK_CHARMANDER, currHp: 0 },
                    caughtPokemon: [{ ...MOCK_CHARMANDER, currHp: 0 }]
                });
                useGameStore.setState({ gameState: GameState.DEFEAT });
            }
        },
        {
            id: 'evolution', category: 'Battle', label: 'Evolution',
            component: <EvolutionScreen prev={MOCK_CHARMANDER} next={MOCK_CHARIZARD} onComplete={() => {}} />,
            setup: () => {
                useGameStore.setState({ 
                    gameState: GameState.EVOLUTION,
                    evolutionData: { prev: MOCK_CHARMANDER, next: MOCK_CHARIZARD }
                });
            }
        },

        // --- UTILITY UI ---
        {
            id: 'backpack_items', category: 'Utility', label: 'Backpack (Items)',
            component: <BackpackView />,
            setup: () => {
                useGameStore.setState({ backpackTab: 'ITEMS', gameState: GameState.BACKPACK });
                usePlayerStore.setState({
                    playerPokemon: MOCK_CHARIZARD,
                    caughtPokemon: getMockTeam(),
                    inventory: getMockInventory(),
                    money: 5000
                });
            }
        },
        {
            id: 'backpack_team', category: 'Utility', label: 'Backpack (Team)',
            component: <BackpackView />,
            setup: () => {
                useGameStore.setState({ backpackTab: 'TEAM', gameState: GameState.BACKPACK });
                usePlayerStore.setState({
                    playerPokemon: MOCK_CHARIZARD,
                    caughtPokemon: getMockTeam(),
                    inventory: getMockInventory()
                });
            }
        },
        {
            id: 'pokedex', category: 'Utility', label: 'Pokedex',
            component: <PokedexView />,
            setup: () => {
                useGameStore.setState({ gameState: GameState.POKEDEX });
                const allCaught = POKEDEX_REGISTRY.slice(0, 20).map(p => p.speciesId); // First 20
                const allSeen = POKEDEX_REGISTRY.slice(0, 50).map(p => p.speciesId); // First 50
                usePlayerStore.setState({
                    seenSpeciesIds: allSeen,
                    caughtHistory: allCaught,
                    caughtPokemon: getMockTeam() // Just to prevent null errors
                });
            }
        },
        {
            id: 'pc_box', category: 'Utility', label: 'PC Storage System',
            component: <PCBox />,
            setup: () => {
                useGameStore.setState({ gameState: GameState.PC_STORAGE });
                usePlayerStore.setState({
                    caughtPokemon: getMockTeam().slice(0, 1), // Only 1 in party
                    storagePokemon: Array.from({length: 30}).map(() => 
                        createPokemonInstance(POKEDEX_REGISTRY[Math.floor(Math.random() * POKEDEX_REGISTRY.length)], false, Math.floor(Math.random() * 50) + 1)
                    )
                });
            }
        },
        {
            id: 'rescue', category: 'Utility', label: 'Rescue Center',
            component: <RescueCenter />,
            setup: () => {
                useGameStore.setState({ gameState: GameState.RESCUE_CENTER, selectedTopic: 'linear' });
            }
        },
        {
            id: 'weather_lab', category: 'Utility', label: 'FX Studio (Weather)',
            component: <WeatherLab />,
            setup: () => {
                useGameStore.setState({ gameState: GameState.WEATHER_LAB });
            }
        },

        // --- NEW INDIVIDUAL EVENT VIEWS ---
        {
            id: 'event_shop', category: 'Event', label: 'Traveling Shop',
            component: <ShopEventView event={getEvent('traveling_shop')} onClose={() => {}} />,
            setup: () => {
                 const shopEvent = getEvent('traveling_shop');
                 // Inject stock data
                 const fullStock = Object.values(ITEM_REGISTRY)
                    .filter(item => item.price > 0 && item.id !== 'poke-ball')
                    .map(item => ({ itemId: item.id, price: item.price, count: 1 }));
                 shopEvent.data = { stock: fullStock };
                 usePlayerStore.setState({ money: 2500, inventory: [] });
            }
        },
        {
            id: 'event_shrine', category: 'Event', label: 'Elemental Shrine',
// FIX: Added missing onClose prop.
            component: <ElementalShrineView event={getEvent('elemental_shrine')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_weather', category: 'Event', label: 'Weather Station',
// FIX: Added missing onClose prop.
            component: <WeatherStationView event={getEvent('weather_station')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_distortion', category: 'Event', label: 'Distortion Signal',
// FIX: Added missing onClose prop.
            component: <DistortionView event={getEvent('distortion_signal')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_steve', category: 'Event', label: 'Minecraft Encounter',
// FIX: Added missing onClose prop.
            component: <MinecraftSteveView event={getEvent('minecraft_steve')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_roblox', category: 'Event', label: 'Roblox Encounter',
// FIX: Added missing onClose prop.
            component: <RobloxNoobView event={getEvent('roblox_noob')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_fortnite', category: 'Event', label: 'Fortnite Encounter',
// FIX: Added missing onClose prop.
            component: <FortniteStormView event={getEvent('fortnite_storm')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_ultra', category: 'Event', label: 'Ultra Signal',
// FIX: Added missing onClose prop.
            component: <UltraSignalView event={getEvent('ultra_signal')} onClose={() => {}} />,
            setup: () => {}
        },
        {
            id: 'event_trade', category: 'Event', label: 'Link Trade',
// FIX: Added missing onClose prop.
            component: <LinkTradeView event={getEvent('link_trade')} onClose={() => {}} />,
            setup: () => {}
        }
    ];

    const handleExit = () => {
        audioService.playSfx('click');
        resetGame(); // Fully reset to clear debug state
        setUiDebuggerOpen(false); // Close Gallery
        setGameState(GameState.MENU_MAIN);
        // Force window reload to ensure clean slate
        window.location.reload();
    };

    const handleSceneChange = (scene: Scene) => {
        audioService.playSfx('click');
        setActiveSceneId(scene.id);
        setRefreshKey(prev => prev + 1); // Force re-mount of component to reset internal state
        // Tiny delay to allow component unmount
        setTimeout(() => scene.setup(), 10);
    };

    const activeScene = SCENES.find(s => s.id === activeSceneId) || SCENES[0];

    // Ensure state is set on mount
    useEffect(() => {
        activeScene.setup();
    }, []);

    const viewportClass = {
        'mobile': 'w-[375px] h-[667px]',
        'tablet': 'w-[768px] h-[1024px]',
        'desktop': 'w-full h-full'
    }[viewportMode];

    // Group scenes by category
    const categories = ['Core', 'Battle', 'Utility', 'Event'] as const;

    return (
        <div className="min-h-screen flex bg-black font-mono overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col shrink-0 z-50">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <h2 className="text-yellow-400 font-bold font-pixel text-sm">UI GALLERY</h2>
                    <button onClick={handleExit} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                
                {/* Viewport Toggles */}
                <div className="flex justify-center gap-2 p-2 bg-slate-950 border-b border-slate-800">
                    <button onClick={() => setViewportMode('mobile')} className={`p-2 rounded ${viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Smartphone size={16}/></button>
                    <button onClick={() => setViewportMode('tablet')} className={`p-2 rounded ${viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Tablet size={16}/></button>
                    <button onClick={() => setViewportMode('desktop')} className={`p-2 rounded ${viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Monitor size={16}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                    {categories.map(cat => (
                        <div key={cat}>
                            <h3 className="text-xs font-bold text-slate-600 uppercase mb-2 px-2">{cat} Screens</h3>
                            <div className="space-y-1">
                                {SCENES.filter(s => s.category === cat).map(scene => (
                                    <button
                                        key={scene.id}
                                        onClick={() => handleSceneChange(scene)}
                                        className={`w-full text-left px-4 py-2 rounded text-xs font-bold transition-colors
                                            ${activeSceneId === scene.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                        `}
                                    >
                                        {scene.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-2 border-t border-slate-800">
                    <button onClick={() => handleSceneChange(activeScene)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center gap-2 text-xs font-bold">
                        <RefreshCw size={14} /> RELOAD SCENE
                    </button>
                </div>
            </div>

            {/* Preview Stage */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center relative overflow-hidden p-4">
                <div 
                    className={`relative bg-slate-900 shadow-2xl transition-all duration-300 overflow-hidden border border-slate-800 ${viewportClass}`}
                    style={{ transform: 'translateZ(0)' }} 
                >
                    {/* Render with Key to force full remount on switch */}
                    <div key={refreshKey} className="w-full h-full relative">
                        {activeScene.component}
                    </div>
                </div>
            </div>
        </div>
    );
};
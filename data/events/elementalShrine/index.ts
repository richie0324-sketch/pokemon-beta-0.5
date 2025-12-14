
import { GameEvent } from '../../../types';
import { useGameStore } from '../../../store/useGameStore';

export const elementalShrineEvent: GameEvent = {
    id: 'elemental_shrine',
    title: 'The Ancient Shrine',
    description: 'You stumble upon a ruined shrine containing three glowing orbs. An inscription reads: "Touch the essence to summon the guardian."',
    trigger: 'RANDOM_ANYTIME',
    chance: 0.05, // Reduced to Rare
    kind: 'quest_trigger',
    effects: {},
    choices: [
        {
            label: '🔴 TOUCH RED ORB',
            riskText: 'Summons Fire Avatar',
            onSelect: (actions) => {
                const topic = useGameStore.getState().selectedTopic;
                const isGen1 = topic === 'linear';

                // Gen 1: Moltres (146), Gen 2: Entei (244)
                const bossId = isGen1 ? 146 : 244;
                const bossName = isGen1 ? "Moltres" : "Entei";
                const terrain = isGen1 ? 'SCORCHING_SUN' : 'VOLCANIC_ASH';
                
                actions.game.startQuest(terrain, bossId, bossName, 'WIN_BATTLES', 3);

                return { 
                    description: `The Red Orb flares up! The air turns scorching hot. The ${bossName} is watching your performance... Win 3 battles to summon it!`, 
                    type: 'neutral' 
                };
            }
        },
        {
            label: '🟡 TOUCH YELLOW ORB',
            riskText: 'Summons Electric Avatar',
            onSelect: (actions) => {
                const topic = useGameStore.getState().selectedTopic;
                const isGen1 = topic === 'linear';

                // Gen 1: Zapdos (145), Gen 2: Raikou (243)
                const bossId = isGen1 ? 145 : 243;
                const bossName = isGen1 ? "Zapdos" : "Raikou";
                const terrain = isGen1 ? 'THUNDER_STORM' : 'STATIC_FIELD';

                actions.game.startQuest(terrain, bossId, bossName, 'WIN_BATTLES', 3);

                return { 
                    description: `Sparks fly from the Yellow Orb! Storm clouds gather instantly. The ${bossName} awaits... Win 3 battles to summon it!`, 
                    type: 'neutral' 
                };
            }
        },
        {
            label: '🔵 TOUCH BLUE ORB',
            riskText: 'Summons Water Avatar',
            onSelect: (actions) => {
                const topic = useGameStore.getState().selectedTopic;
                const isGen1 = topic === 'linear';

                // Gen 1: Articuno (144 - Ice), Gen 2: Suicune (245 - Water)
                const bossId = isGen1 ? 144 : 245;
                const bossName = isGen1 ? "Articuno" : "Suicune";
                const terrain = isGen1 ? 'BLIZZARD' : 'MISTY_RAIN';

                actions.game.startQuest(terrain, bossId, bossName, 'WIN_BATTLES', 3);

                return { 
                    description: `The Blue Orb glows icy cold! A mysterious aura descends. The ${bossName} is testing you... Win 3 battles to summon it!`, 
                    type: 'neutral' 
                };
            }
        }
    ]
};

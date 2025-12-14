import { useEffect, useRef } from 'react';
import { GameState } from '../types';
import { audioService } from '../services/audioService';
import { useBattleStore } from '../store/useBattleStore';

export const useGameAudio = (gameState: GameState) => {
    const enemyRarity = useBattleStore(state => state.enemyPokemon?.rarity);
    const battleVariantRef = useRef<'battle' | 'battle_alt'>('battle');

    useEffect(() => {
        const isBattleState = gameState === GameState.BATTLE_COMBAT || 
            gameState === GameState.CATCH_PHASE || 
            gameState === GameState.WILD_ENCOUNTER ||
            gameState === GameState.TRAINER_INTRO;

        let theme: Parameters<typeof audioService.playBgm>[0] = 'menu';

        if (isBattleState) {
            if (enemyRarity === 'Legendary') {
                theme = 'legendary';
            } else if (enemyRarity === 'Ultra') {
                theme = 'battle_alt';
            } else {
                battleVariantRef.current = battleVariantRef.current === 'battle' ? 'battle_alt' : 'battle';
                theme = battleVariantRef.current;
            }
        } else if (gameState === GameState.VICTORY_CAUGHT || gameState === GameState.EVOLUTION) {
            theme = 'victory';
        } else if (gameState === GameState.RESCUE_CENTER) {
            theme = 'rescue';
        } else if (gameState === GameState.EVENT_ACTIVE) {
            theme = 'menu_alt';
        } else if ([GameState.MENU_TOPIC_SELECT, GameState.MENU_NAME_INPUT, GameState.MENU_STARTER_SELECT].includes(gameState)) {
            theme = 'menu_alt';
        } else {
            theme = 'menu';
        }

        if (gameState === GameState.BATTLE_COMBAT || 
            gameState === GameState.CATCH_PHASE || 
            gameState === GameState.WILD_ENCOUNTER) {
            audioService.playBgm(theme);
        } else if (gameState === GameState.VICTORY_CAUGHT || 
                   gameState === GameState.EVOLUTION) {
            audioService.playBgm('victory');
        } else {
            audioService.playBgm(theme);
        }
        
        return () => {
            audioService.stopBgm();
        };
    }, [gameState, enemyRarity]);
};
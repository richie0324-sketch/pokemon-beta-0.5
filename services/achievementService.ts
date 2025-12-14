
import { AchievementTrigger, PlayerStateForAchievements } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';
import { ACHIEVEMENT_REGISTRY } from '../data/achievementData';
import { showToast } from '../store/useToastStore';
import { createPokemonInstance } from './pokemonGenService';
import { POKEDEX_REGISTRY } from '../data/pokedexData';
import { ITEM_REGISTRY } from '../data/itemData';

export const achievementService = {
  processEvent(trigger: AchievementTrigger, payload: any) {
    const { unlockedAchievements, caughtHistory, money, defeatedTrainers, unlockAchievement, setMoney, addItem, setCaughtPokemon, setStoragePokemon } = usePlayerStore.getState();

    const relevantAchievements = ACHIEVEMENT_REGISTRY.filter(
      (ach) => ach.trigger === trigger && !unlockedAchievements[ach.id]
    );

    if (relevantAchievements.length === 0) return;

    const playerState: PlayerStateForAchievements = {
      caughtHistory: caughtHistory,
      money: money,
      defeatedTrainers: defeatedTrainers,
    };

    for (const achievement of relevantAchievements) {
      // Use a try-catch to prevent a faulty achievement condition from crashing the game
      try {
        if (achievement.condition(payload, playerState)) {
          // Unlock achievement
          unlockAchievement(achievement.id);
          
          // Show primary notification
          showToast(`🏆 Achievement Unlocked: ${achievement.title}`, 'success', 5000);

          // Grant rewards
          if (achievement.reward) {
            const { reward } = achievement;
            let rewardMsg = '';

            if (reward.money) {
              setMoney(m => m + reward.money!);
              rewardMsg += `You received $${reward.money}!`;
            }

            if (reward.itemId && reward.itemCount) {
              addItem(reward.itemId, reward.itemCount);
              const itemName = ITEM_REGISTRY[reward.itemId]?.name || 'item';
              rewardMsg += ` You got ${reward.itemCount}x ${itemName}!`;
            }

            if (reward.pokemon) {
              const entry = POKEDEX_REGISTRY.find(p => p.speciesId === reward.pokemon!.speciesId);
              if (entry) {
                const newPokemon = createPokemonInstance(entry, false, reward.pokemon.level);
                const { caughtPokemon } = usePlayerStore.getState();
                
                if (caughtPokemon.length < 6) {
                  setCaughtPokemon(party => [...party, newPokemon]);
                  rewardMsg += ` ${newPokemon.name} joined your party!`;
                } else {
                  setStoragePokemon(pc => [...pc, newPokemon]);
                  rewardMsg += ` ${newPokemon.name} was sent to the PC!`;
                }
              }
            }

            if (rewardMsg) {
              setTimeout(() => showToast(rewardMsg.trim(), 'info', 4000), 1000);
            }
          }
        }
      } catch (error) {
          console.error(`Error checking achievement "${achievement.id}":`, error);
      }
    }
  }
};

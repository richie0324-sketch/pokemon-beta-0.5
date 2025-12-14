import { MathQuestion, MathTopic, PokemonRarity, Difficulty } from "../types";
import { getQuestionForTopic } from "./topicRegistry";

export type { Difficulty };

const DIFFICULTY_WEIGHTS: Record<PokemonRarity, Record<Difficulty, number>> = {
  'Common':    { Easy: 80, Medium: 20, Hard: 0,  Challenge: 0 },
  'Rare':      { Easy: 50, Medium: 40, Hard: 10, Challenge: 0 },
  'Elite':     { Easy: 20, Medium: 50, Hard: 25, Challenge: 5 },
  'Ultra':     { Easy: 5,  Medium: 30, Hard: 50, Challenge: 15 },
  'Legendary': { Easy: 0,  Medium: 10, Hard: 40, Challenge: 50 },
};

export const getDifficultyFromRarity = (rarity: PokemonRarity): Difficulty => {
  const weights = DIFFICULTY_WEIGHTS[rarity] || DIFFICULTY_WEIGHTS['Common'];
  const rand = Math.random() * 100;

  let cumulative = 0;
  
  cumulative += weights.Easy;
  if (rand < cumulative) return 'Easy';
  
  cumulative += weights.Medium;
  if (rand < cumulative) return 'Medium';
  
  cumulative += weights.Hard;
  if (rand < cumulative) return 'Hard';
  
  return 'Challenge';
};

export const generateLocalQuestion = (topic: MathTopic, difficulty: Difficulty): MathQuestion => {
    return getQuestionForTopic(topic, difficulty);
};

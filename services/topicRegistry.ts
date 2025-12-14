import { MathQuestion, Difficulty, MathTopic } from "../types";
import { generateLinearQuestion } from "./topics/linear";
import { generateProbabilityQuestion } from "./topics/probability";

type QuestionGenerator = (difficulty: Difficulty) => MathQuestion;

interface TopicDefinition {
    id: MathTopic;
    name: string;
    generator: QuestionGenerator;
}

// 1. REGISTRY MAP
// Future chapters (e.g., 'geometry', 'quadratics') will be added here.
const TOPIC_REGISTRY: Record<string, TopicDefinition> = {
    'linear': {
        id: 'linear',
        name: 'Linear Equations',
        generator: generateLinearQuestion
    },
    'probability': {
        id: 'probability',
        name: 'Probability',
        generator: generateProbabilityQuestion
    }
};

// 2. DISPATCHER
export const getQuestionForTopic = (topicId: string, difficulty: Difficulty): MathQuestion => {
    const topic = TOPIC_REGISTRY[topicId];
    if (!topic) {
        console.error(`Topic '${topicId}' not found in registry. Falling back to Linear.`);
        return TOPIC_REGISTRY['linear'].generator(difficulty);
    }
    return topic.generator(difficulty);
};

export const getTopicName = (topicId: string): string => {
    return TOPIC_REGISTRY[topicId]?.name || "Unknown Topic";
};

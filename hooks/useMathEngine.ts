
import { useState, useEffect, useRef } from 'react';
import { MathQuestion, MathTopic, Pokemon, Difficulty } from '../types';
import { generateLocalQuestion, getDifficultyFromRarity } from '../services/localQuestionService';
import { getTypeEffectiveness } from '../constants';
import { audioService } from '../services/audioService';
import { useGameStore } from '../store/useGameStore'; // Added import

// Coefficient Mapping
const DIFFICULTY_COEFF: Record<Difficulty, number> = {
    'Easy': 1.0,
    'Medium': 1.2,
    'Hard': 1.5,
    'Challenge': 2.0
};

interface UseMathEngineProps {
    playerPokemon: Pokemon;
    enemyPokemon: Pokemon;
    topic: MathTopic;
    isCatchPhase: boolean;
    questionSeed: number; 
    onCorrect: (coefficient: number) => void;
    onIncorrect: () => void;
    onQuestionLoaded?: () => void;
}

export const useMathEngine = ({ 
    playerPokemon, 
    enemyPokemon, 
    topic, 
    isCatchPhase,
    questionSeed,
    onCorrect,
    onIncorrect,
    onQuestionLoaded
}: UseMathEngineProps) => {
    
    const [question, setQuestion] = useState<MathQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [effectivenessMsg, setEffectivenessMsg] = useState<string>('');
    const [currentDiff, setCurrentDiff] = useState<number>(1.0);

    const questionHistoryRef = useRef<string[]>([]);
    
    // Check Buffs
    const activeBuffs = useGameStore(state => state.activeBuffs);
    const efficiencyActive = activeBuffs['efficiency_v'] && activeBuffs['efficiency_v'] > 0;

    const loadQuestion = () => {
        setLoading(true);
        setFeedback(null);
        setSelectedOption(null);
        setEffectivenessMsg('');
        
        setTimeout(() => {
            const difficulty = getDifficultyFromRarity(enemyPokemon.rarity);
            setCurrentDiff(DIFFICULTY_COEFF[difficulty] || 1.0);
            
            let q: MathQuestion;
            let attempts = 0;
            const MAX_RETRIES = 10;
            
            do {
                 q = generateLocalQuestion(topic, difficulty);
                 attempts++;
            } while (
                questionHistoryRef.current.includes(q.question) && 
                attempts < MAX_RETRIES
            );
            
            const newHistory = [q.question, ...questionHistoryRef.current].slice(0, 5);
            questionHistoryRef.current = newHistory;
            
            // --- EFFICIENCY V LOGIC ---
            // If active, replace 2 wrong answers with empty strings or nulls to hide them
            if (efficiencyActive) {
                const correct = q.options[q.correctIndex];
                // Keep correct and one random distractor
                let otherIndex = (q.correctIndex + 1) % 4;
                // Create new options array
                const newOptions = q.options.map((opt, idx) => {
                    if (idx === q.correctIndex || idx === otherIndex) return opt;
                    return ""; // Empty string indicates filtered
                });
                q.options = newOptions;
            }

            setQuestion(q);
            setLoading(false);
            onQuestionLoaded?.();
        }, 400);
    };

    useEffect(() => {
        loadQuestion();
    }, [isCatchPhase, enemyPokemon.id, topic, questionSeed]);

    const handleAnswer = (index: number) => {
        if (feedback !== null || !question) return;
        // Ignore clicks on filtered options
        if (question.options[index] === "") return;

        setSelectedOption(index);
        const isCorrect = index === question.correctIndex;

        if (isCorrect) {
            setFeedback('correct');
            audioService.playSfx('correct');

            if (isCatchPhase) {
                setEffectivenessMsg('> Excellent Throw!');
            } else {
                const multiplier = getTypeEffectiveness(playerPokemon.type, enemyPokemon.type);
                if (multiplier > 1) setEffectivenessMsg("> It's Super Effective!");
                else if (multiplier < 1) setEffectivenessMsg("> It's not very effective...");
                else setEffectivenessMsg("> Direct Hit!");
            }

            setTimeout(() => {
                onCorrect(currentDiff);
                if (!isCatchPhase) {
                    setTimeout(() => loadQuestion(), 1500);
                }
            }, 1000);

        } else {
            setFeedback('incorrect');
            audioService.playSfx('incorrect');
            setEffectivenessMsg('> Missed!');
            onIncorrect();
        }
    };

    const continueAfterError = () => {
        audioService.playSfx('click');
        loadQuestion();
    };

    return {
        question,
        loading,
        selectedOption,
        feedback,
        effectivenessMsg,
        handleAnswer,
        continueAfterError 
    };
};

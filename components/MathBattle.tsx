
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { Pokemon, MathTopic, GameState } from '../types';
import { useMathEngine } from '../hooks/useMathEngine'; 
import { usePlayerStore } from '../store/usePlayerStore';
import { useBattleStore } from '../store/useBattleStore';
import { useGameStore } from '../store/useGameStore';
import { logic } from '../hooks/useGameLogic';
import { multiplayer } from '../services/gameLogic/multiplayer'; // Import MP logic
import { Loader2, ArrowRight, XCircle, HelpCircle, ChevronRight, Lock } from 'lucide-react';
import { MathText } from './MathText';
import { calculateDamage } from '../services/battleMechanics';

const MathBattle: React.FC = () => {
  const playerPokemon = usePlayerStore(state => state.playerPokemon);
  const { enemyPokemon, battleMessage, questionSeed, isTrainerBattle, setBattleTimer, isMultiplayer, isMyTurn, battleModifiers, setBattleMessage } = useBattleStore(useShallow(state => ({
      enemyPokemon: state.enemyPokemon,
      battleMessage: state.battleMessage,
      questionSeed: state.questionSeed,
      isTrainerBattle: state.isTrainerBattle,
      setBattleTimer: state.setBattleTimer,
      isMultiplayer: state.isMultiplayer,
      isMyTurn: state.isMyTurn,
      battleModifiers: state.battleModifiers,
      setBattleMessage: state.setBattleMessage
  })));
  const gameState = useGameStore(state => state.gameState);
  const selectedTopic = useGameStore(state => state.selectedTopic);

  const isCatchPhase = gameState === GameState.CATCH_PHASE;
  
  if (!playerPokemon || !enemyPokemon) {
    return null;
  }
  
  const handleCorrect = (coeff: number) => {
      if (isMultiplayer) {
          // P2P Logic: Calculate raw damage
          const { damage } = calculateDamage(playerPokemon, enemyPokemon, coeff, true, battleModifiers.atk, 1.0);
          multiplayer.sendAttack(damage);
      } else {
          if (isCatchPhase) {
              logic.handleCatchAttempt(true);
          } else {
              logic.handleDamageEnemy(coeff);
          }
      }
  };

  const handleIncorrect = () => {
      if (isMultiplayer) {
          multiplayer.sendMiss();
      } else {
          if (isCatchPhase) {
              logic.handleCatchAttempt(false);
          } else {
              logic.handleDamagePlayer(1.0);
          }
      }
  };

  const { 
      question, 
      loading, 
      selectedOption, 
      feedback, 
      effectivenessMsg, 
      handleAnswer,
      continueAfterError 
  } = useMathEngine({
      playerPokemon,
      enemyPokemon,
      topic: selectedTopic,
      isCatchPhase,
      questionSeed,
      onQuestionLoaded: () => {
          if (isTrainerBattle) {
              setBattleTimer(30);
          }
      },
      onCorrect: handleCorrect,
      onIncorrect: handleIncorrect
  });

  // --- MULTIPLAYER WAITING SCREEN ---
  if (isMultiplayer && !isMyTurn) {
      return (
        <div className="w-full mt-4 retro-border bg-slate-800 text-white p-8 min-h-[200px] flex flex-col items-center justify-center gap-4 animate-pulse">
            <Lock size={48} className="text-slate-500" />
            <h2 className="text-2xl font-pixel text-slate-400">OPPONENT'S TURN</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={16} /> Waiting for move...
            </div>
        </div>
      );
  }

  if (battleMessage) {
    return (
      <div 
        onClick={() => setBattleMessage(null)} 
        className="w-full mt-2 md:mt-4 retro-border bg-slate-800 text-white p-4 md:p-8 min-h-[150px] md:min-h-[200px] flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors"
      >
        <h2 className="text-xl md:text-3xl font-pixel leading-relaxed text-center animate-pulse">
          {battleMessage}
        </h2>
        <div className="absolute bottom-2 text-[10px] text-slate-500 opacity-50 font-mono">tap to continue</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full mt-2 md:mt-4 retro-border bg-white p-6 min-h-[150px] flex items-center justify-center">
        <div className="flex items-center gap-3">
           <Loader2 className="animate-spin text-slate-800" size={32} />
           <span className="font-pixel text-slate-600 text-sm">Thinking...</span>
        </div>
      </div>
    );
  }

  if (!question) return <div>Error loading question</div>;

  const getDifficultyColor = (diff?: string) => {
      switch(diff) {
          case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
          case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200';
          case 'Challenge': return 'bg-purple-100 text-purple-800 border-purple-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
  };

  return (
    <div className={`
      w-full mt-0 md:mt-4 retro-border overflow-hidden transition-colors duration-300 flex flex-col md:flex-row
      ${isCatchPhase ? 'bg-yellow-50 border-yellow-600' : 'bg-white border-slate-700'}
    `}>
        {/* Left: Question Text */}
        <div className={`p-3 md:p-6 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r-2 ${isCatchPhase ? 'border-yellow-200' : 'border-slate-200'}`}>
           <div className="flex items-center gap-2 mb-2">
               <span className={`text-[9px] md:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${isCatchPhase ? 'bg-yellow-200 text-yellow-800 border-yellow-300' : 'bg-slate-200 text-slate-600 border-slate-300'}`}>
                 {isCatchPhase ? 'CATCH CHANCE' : question.topic}
               </span>
               {question.difficulty && (
                   <span className={`text-[9px] md:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getDifficultyColor(question.difficulty)}`}>
                       {question.difficulty}
                   </span>
               )}
           </div>
           
           <h2 className="text-base md:text-2xl font-bold text-slate-800 leading-tight">
             <MathText text={question.question} large />
           </h2>
           
           {feedback === 'correct' && (
             <div className="mt-2 md:mt-4 text-base md:text-lg font-bold font-pixel text-green-600 animate-bounce">
               {effectivenessMsg}
             </div>
           )}

           {/* EXPLANATION BOX (Only on Error) */}
           {feedback === 'incorrect' && (
               <div className="mt-2 p-2 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-xs md:text-sm animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center gap-2 font-bold text-red-700 mb-1">
                       <XCircle size={14} /> Incorrect!
                   </div>
                   <p className="text-slate-700 mb-1">
                       Correct answer: <span className="font-bold text-black"><MathText text={question.options[question.correctIndex]} /></span>
                   </p>
                   <div className="text-slate-600 italic border-t border-red-100 pt-1 flex gap-1">
                       <HelpCircle size={14} className="shrink-0 mt-0.5" />
                       <span><MathText text={question.explanation} /></span>
                   </div>
                   
                   {/* Manual Continue Button */}
                   <button 
                       onClick={continueAfterError}
                       className="mt-2 w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
                   >
                       GOT IT <ChevronRight size={14} />
                   </button>
               </div>
           )}
        </div>

        {/* Right: Options */}
        <div className="p-2 md:p-4 md:w-1/2 grid grid-cols-1 gap-2 md:gap-3 bg-slate-50 overflow-y-auto max-h-[40vh] md:max-h-none">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;
            
            let btnClass = "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-blue-400";
            
            if (feedback === 'correct') {
                if (isSelected) btnClass = "bg-green-100 border-green-500 text-green-900";
                else btnClass = "opacity-50 grayscale";
            }
            
            if (feedback === 'incorrect') {
                if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-900"; // Wrong selection
                else if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-900 ring-2 ring-green-400 ring-offset-2"; // Show correct one
                else btnClass = "opacity-50 grayscale";
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={feedback !== null}
                className={`
                  text-left px-3 py-2 md:px-4 md:py-3 rounded-lg font-mono font-bold text-sm md:text-lg transition-all
                  flex items-center group
                  ${btnClass}
                `}
              >
                <span className="w-5 md:w-6 opacity-40 group-hover:text-blue-500 text-xs md:text-base">{String.fromCharCode(65 + idx)}</span>
                <span className="flex-1">
                    <MathText text={option} />
                </span>
                <ArrowRight size={16} className={`opacity-0 transition-opacity text-blue-500 hidden md:block ${!feedback ? 'group-hover:opacity-100' : ''}`} />
              </button>
            );
          })}
        </div>
    </div>
  );
};

export default MathBattle;

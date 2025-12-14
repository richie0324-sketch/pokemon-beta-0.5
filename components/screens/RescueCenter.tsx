
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { BookOpen, HeartPulse, Shield, Lock, CheckCircle, HelpCircle, AlertTriangle, RefreshCw, Timer, GraduationCap } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useBattleStore } from '../../store/useBattleStore';
import { audioService } from '../../services/audioService';
import { logic } from '../../hooks/useGameLogic';
import { getRandomLesson } from '../../data/rescueLessons';

export const RescueCenter: React.FC = () => {
    const selectedTopic = useGameStore(state => state.selectedTopic);
    const { streak, setStreak } = useBattleStore(useShallow(state => ({
        streak: state.streak,
        setStreak: state.setStreak
    })));
    
    // STATE: Active Lesson
    const [lesson, setLesson] = useState(() => getRandomLesson(selectedTopic));
    
    // STATE: Options (Can be shuffled)
    const [currentOptions, setCurrentOptions] = useState<string[]>(() => 
        [...lesson.options].sort(() => Math.random() - 0.5)
    );

    // STATE: Game Logic
    const [isVerified, setIsVerified] = useState(false);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    
    // ANTI-GUESSING STATES
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [shake, setShake] = useState(false);
    const [systemMessage, setSystemMessage] = useState<string | null>(null);

    const timerRef = useRef<number | null>(null);

    // Helper: Reset and load new lesson (Defense #3)
    const loadNewLesson = useCallback(() => {
        const newLesson = getRandomLesson(selectedTopic);
        setLesson(newLesson);
        setCurrentOptions([...newLesson.options].sort(() => Math.random() - 0.5));
        setMistakes(0);
        setIsVerified(false);
        setIsLocked(false);
        setSystemMessage(null);
        setLockTimer(0);
        setSelectedText(null);
        if (timerRef.current) clearInterval(timerRef.current);
    }, [selectedTopic]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleAnswer = (text: string) => {
        if (isVerified || isLocked) return;

        const correctText = lesson.options[lesson.correctIndex];

        if (text === correctText) {
            // SUCCESS
            audioService.playSfx('correct');
            setSelectedText(text);
            setIsVerified(true);
        } else {
            // FAILURE
            audioService.playSfx('incorrect');
            setShake(true);
            setTimeout(() => setShake(false), 500);

            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);

            if (newMistakes >= 2) {
                // Defense #3: Forced Reset & Streak Penalty
                setIsLocked(true);
                setStreak(() => 0); // Reset Streak
                setSystemMessage("CRITICAL FAILURE. STREAK LOST. RECALIBRATING...");
                
                setTimeout(() => {
                    audioService.playSfx('run');
                    loadNewLesson();
                }, 2000);
            } else {
                // Defense #1: Time Penalty
                setIsLocked(true);
                setLockTimer(5);
                
                timerRef.current = window.setInterval(() => {
                    setLockTimer(prev => {
                        if (prev <= 1) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            
                            // Defense #2: Shuffle Options
                            setIsLocked(false);
                            setCurrentOptions(opts => [...opts].sort(() => Math.random() - 0.5));
                            
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
    };

    const handleRecover = () => {
        if (!isVerified) return;
        audioService.playSfx('correct');
        audioService.playSfx('catch'); 
        logic.completeRescueLesson();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col items-center justify-center p-4 font-mono relative">
            
            {/* System Message Overlay */}
            {systemMessage && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center animate-in fade-in">
                    <div className="text-center p-6 border-4 border-red-500 bg-slate-900 rounded-xl animate-pulse">
                        <RefreshCw size={48} className="mx-auto text-red-500 mb-4 animate-spin" />
                        <h2 className="text-2xl font-pixel text-red-500 mb-2">SIMULATION FAILED</h2>
                        <p className="text-white font-mono">{systemMessage}</p>
                    </div>
                </div>
            )}

            <div className={`w-full max-w-3xl bg-slate-800/80 border ${mistakes > 0 ? 'border-red-500/50' : 'border-blue-500/30'} rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 backdrop-blur transition-colors duration-500`}>
                
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/20 p-2 rounded-full">
                            <Shield className="text-red-400" size={28} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-pixel text-red-100">Rescue Center</h1>
                    </div>
                    <span className="text-xs font-bold text-red-200 bg-red-900/40 px-3 py-1 rounded-full border border-red-500/40 animate-pulse">
                        CRITICAL CONDITION
                    </span>
                </div>

                <div className="text-center md:text-left">
                    <p className="text-slate-300 text-sm md:text-base">
                        System locked. Verify knowledge to initiate healing protocol.
                    </p>
                </div>

                {/* Lesson Box */}
                <div className="bg-slate-950 border-l-4 border-yellow-500 rounded-r-xl p-5 shadow-inner relative overflow-hidden">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-wide text-xs mb-2">
                        <BookOpen size={16} /> Key Concept: {lesson.title}
                    </div>
                    <p className="text-white leading-relaxed text-sm md:text-lg font-medium relative z-10">
                        {lesson.content}
                    </p>
                    {/* Subtle BG Icon */}
                    <GraduationCap className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 transform -rotate-12 z-0" />
                </div>

                {/* Verification Quiz */}
                <div className={`space-y-3 transition-all duration-300 ${shake ? 'translate-x-[-10px]' : ''} ${shake ? 'text-red-400' : ''}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                            {isVerified ? <CheckCircle className="text-green-500" size={16}/> : <HelpCircle size={16}/>}
                            Security Check: {lesson.question}
                        </div>
                        {mistakes > 0 && !isVerified && (
                            <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded">
                                Attempts: {2 - mistakes} left
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                        {/* Lock Overlay */}
                        {isLocked && lockTimer > 0 && (
                            <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center rounded-xl border-2 border-red-500/50 backdrop-blur-sm">
                                <Lock size={32} className="text-red-500 mb-2" />
                                <span className="text-red-400 font-bold font-mono text-lg animate-pulse">
                                    SYSTEM LOCKED: {lockTimer}s
                                </span>
                                <span className="text-slate-500 text-xs mt-1">Review the lesson above</span>
                            </div>
                        )}

                        {currentOptions.map((opt, i) => {
                            const isCorrect = opt === lesson.options[lesson.correctIndex];
                            
                            let btnClass = "bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-300";
                            
                            if (isVerified) {
                                if (isCorrect) btnClass = "bg-green-600 border-green-500 text-white ring-2 ring-green-400";
                                else btnClass = "opacity-30 bg-slate-800 border-transparent cursor-not-allowed";
                            } 

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isVerified || isLocked}
                                    className={`py-4 px-4 rounded-lg border-2 text-sm font-bold transition-all active:scale-95 flex items-center justify-center text-center ${btnClass}`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                    
                    {mistakes === 1 && !isLocked && !isVerified && (
                        <p className="text-yellow-500 text-xs font-bold text-center flex items-center justify-center gap-1 animate-in fade-in slide-in-from-top-1">
                            <AlertTriangle size={12} /> Careful! One more mistake will reset the system.
                        </p>
                    )}
                </div>

                {/* Footer Action */}
                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-700/50">
                    <button
                        onClick={handleRecover}
                        disabled={!isVerified}
                        className={`flex-1 py-4 font-bold rounded-xl border-b-4 transition-all flex items-center justify-center gap-3 text-lg shadow-lg
                            ${isVerified 
                                ? 'bg-green-600 hover:bg-green-500 text-white border-green-800 active:border-b-0 active:translate-y-1 animate-pulse' 
                                : 'bg-slate-700 text-slate-500 border-slate-800 cursor-not-allowed opacity-70'}`}
                    >
                        {isVerified ? <HeartPulse size={24} /> : <Lock size={20} />} 
                        {isVerified ? "RESTORE TEAM" : "READ TO UNLOCK"}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-400 bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-3">
                        <span>Streak:</span>
                        <span className={`${mistakes >= 2 ? 'text-red-500 line-through' : 'text-yellow-400'} font-bold font-pixel text-lg`}>{streak}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { logic } from '../../hooks/useGameLogic';
import { Check, ChevronRight, Sparkles, CreditCard } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { TrainerCard } from '../TrainerCard';

const AVATARS = [
    { id: 'red', name: 'Red', url: 'https://play.pokemonshowdown.com/sprites/trainers/red.png' },
    { id: 'leaf', name: 'Leaf', url: 'https://play.pokemonshowdown.com/sprites/trainers/leaf-gen3.png' },
    { id: 'ethan', name: 'Ethan', url: 'https://play.pokemonshowdown.com/sprites/trainers/ethan.png' },
    { id: 'lyra', name: 'Lyra', url: 'https://play.pokemonshowdown.com/sprites/trainers/lyra.png' },
    { id: 'lucas', name: 'Lucas', url: 'https://play.pokemonshowdown.com/sprites/trainers/lucas.png' },
    { id: 'dawn', name: 'Dawn', url: 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png' },
    { id: 'youngster', name: 'Youngster', url: 'https://play.pokemonshowdown.com/sprites/trainers/youngster-gen4.png' },
    { id: 'lass', name: 'Lass', url: 'https://play.pokemonshowdown.com/sprites/trainers/lass-gen4.png' },
];

export const NameInput: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATARS[0].url);
  const [trainerId, setTrainerId] = useState('00000');

  // Generate a random Trainer ID for flavor (and save it later)
  useEffect(() => {
      const randomId = Math.floor(Math.random() * 90000) + 10000;
      setTrainerId(randomId.toString());
  }, []);

  const handleSubmit = () => {
      if (name.trim() && selectedAvatar) {
          audioService.playSfx('correct');
          logic.registerPlayer(name, selectedAvatar, trainerId);
      } else {
          audioService.playSfx('incorrect');
      }
  };

  const handleSelectAvatar = (url: string) => {
      audioService.playSfx('click');
      setSelectedAvatar(url);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8 font-mono relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500"></div>
        <div className="absolute bottom-0 right-0 p-8 opacity-5 pointer-events-none">
            <CreditCard size={400} />
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
            
            {/* LEFT COLUMN: TRAINER CARD PREVIEW */}
            <div className="flex flex-col items-center justify-center order-2 md:order-1">
                <TrainerCard 
                    name={name}
                    id={trainerId}
                    money={3000}
                    badges={[]} // No badges at start
                    avatar={selectedAvatar}
                    className="max-w-sm"
                />
                
                <p className="mt-6 text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-yellow-400"/> Official League Identification
                </p>
            </div>

            {/* RIGHT COLUMN: CONTROLS */}
            <div className="bg-slate-800 border-4 border-slate-600 rounded-xl p-6 md:p-8 shadow-xl order-1 md:order-2 flex flex-col gap-6">
                
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-pixel text-white mb-1">REGISTRATION</h2>
                    <p className="text-slate-400 text-sm">Please fill out your details to begin.</p>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-yellow-400 text-xs font-bold uppercase tracking-widest block">Trainer Name</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="ENTER NAME" 
                            value={name}
                            onChange={handleNameChange}
                            maxLength={12}
                            autoFocus
                            className="w-full bg-slate-900 text-white font-pixel text-lg md:text-xl p-4 border-l-4 border-slate-600 focus:border-yellow-400 outline-none transition-colors uppercase placeholder:text-slate-700"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                            {name.length}/12
                        </div>
                    </div>
                </div>

                {/* Avatar Grid */}
                <div className="space-y-3">
                    <label className="text-yellow-400 text-xs font-bold uppercase tracking-widest block">Select Appearance</label>
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                        {AVATARS.map((av) => {
                            const isSelected = selectedAvatar === av.url;
                            return (
                                <button
                                    key={av.id}
                                    onClick={() => handleSelectAvatar(av.url)}
                                    className={`
                                        relative aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden group
                                        ${isSelected 
                                            ? 'bg-blue-600 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] scale-105 z-10' 
                                            : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-400'}
                                    `}
                                    title={av.name}
                                >
                                    <img 
                                        src={av.url} 
                                        className={`w-full h-full object-contain p-1 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 bg-yellow-400 text-black rounded-full p-0.5">
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 mt-auto">
                    <button 
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className={`
                            w-full py-4 rounded-lg font-bold font-pixel text-lg flex items-center justify-center gap-3 border-b-4 transition-all
                            ${name.trim() 
                                ? 'bg-green-600 hover:bg-green-500 text-white border-green-800 active:border-b-0 active:translate-y-1 shadow-lg' 
                                : 'bg-slate-700 text-slate-500 border-slate-800 cursor-not-allowed'}
                        `}
                    >
                        <span>CONFIRM</span>
                        {name.trim() && <ChevronRight size={24} className="animate-pulse" />}
                    </button>
                </div>

            </div>
        </div>
        
        <div className="absolute bottom-4 text-slate-600 text-xs font-mono">
            ID: {trainerId} • REGION: KANTO/JOHTO
        </div>
    </div>
  );
};

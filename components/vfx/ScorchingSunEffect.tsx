import React from 'react';

export const ScorchingSunFilters: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <style>{`
                @keyframes sun-breathe {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }
            `}</style>
            
            {/* 1. Base Warmth Overlay */}
            <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay"></div>
            
            {/* 2. Rising Heat Haze */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>

            {/* 4. THE SUN (Top Center) */}
            {/* Moved down to -350px (more visible). Shifted right to calc(54% + 8px). */}
            <div className="absolute -top-[350px] left-[calc(54%+8px)] -translate-x-1/2 w-[600px] h-[600px] z-0 pointer-events-none">
                
                {/* Pulsing Core Complex */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'sun-breathe 6s ease-in-out infinite' }}>
                    {/* Inner White Hot Core */}
                    <div className="w-[45%] h-[45%] rounded-full bg-white blur-[50px] opacity-90"></div>
                    {/* Middle Yellow Glow */}
                    <div className="absolute w-[65%] h-[65%] rounded-full bg-yellow-300 blur-[80px] opacity-60 mix-blend-screen"></div>
                    {/* Orange Halo */}
                    <div className="absolute w-[90%] h-[90%] rounded-full bg-orange-500 blur-[100px] opacity-40 mix-blend-screen"></div>
                </div>
            </div>
        </div>
    );
};

export const ScorchingSunParticles: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <style>{`
                @keyframes ember-float {
                    0% { transform: translateY(100vh) translateX(0) scale(0.5); opacity: 0; }
                    20% { opacity: 0.8; }
                    80% { opacity: 0.8; }
                    100% { transform: translateY(-10vh) translateX(-20px) scale(1.2); opacity: 0; }
                }
            `}</style>
            
            {/* Rising Embers / Heat Motes */}
            {Array.from({ length: 25 }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute rounded-full bg-yellow-200 blur-[1px]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 3 + 2}px`,
                        height: `${Math.random() * 3 + 2}px`,
                        animation: `ember-float ${Math.random() * 4 + 4}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        boxShadow: '0 0 4px 1px rgba(251, 191, 36, 0.6)',
                        opacity: 0.8
                    }}
                />
            ))}
        </div>
    );
};
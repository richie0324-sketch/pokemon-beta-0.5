import React from 'react';

export const StaticFieldFilters: React.FC = () => {
    return (
        <>
            <div className="absolute inset-0 bg-yellow-400/5 mix-blend-overlay pointer-events-none"></div>
            {/* Occasional screen flash - double flash effect */}
            <div className="absolute inset-0 bg-yellow-200 animate-double-flash mix-blend-overlay pointer-events-none" style={{ animationDuration: '9s', opacity: 0.2 }}></div>
        </>
    );
};

export const StaticFieldParticles: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <filter id="static-glow" x="-50%" y="-50%" width="200%" height="200%">
                         <feGaussianBlur stdDeviation="0.6" result="coloredBlur"/>
                         <feMerge>
                             <feMergeNode in="coloredBlur"/>
                             <feMergeNode in="SourceGraphic"/>
                         </feMerge>
                    </filter>
                </defs>
                
                {/* 1. Major Bolt Left (Slow & Thick) */}
                <path d="M 20,-10 L 25,15 L 10,40 L 30,60 L 15,90 L 25,110" 
                      className="animate-draw-lines" style={{ animationDuration: '4s' }}
                      stroke="#fde047" strokeWidth="0.6" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" />

                {/* 2. Major Bolt Right (Fast & Erratic) */}
                <path d="M 70,-10 L 85,20 L 65,45 L 80,75 L 70,110" 
                      className="animate-draw-lines" style={{ animationDuration: '2.5s', animationDelay: '1.2s' }}
                      stroke="#fde047" strokeWidth="0.5" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" />

                {/* 3. Horizontal Crossing (Thin & Fast) */}
                <path d="M -10,30 L 30,35 L 50,25 L 80,40 L 110,30" 
                      className="animate-draw-lines" style={{ animationDuration: '3s', animationDelay: '0.5s' }}
                      stroke="#fef08a" strokeWidth="0.3" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" />
                
                {/* 4. Bottom Crossing (Varied) */}
                <path d="M 110,70 L 80,75 L 50,65 L 20,80 L -10,70" 
                      className="animate-draw-lines" style={{ animationDuration: '5s', animationDelay: '2s' }}
                      stroke="#fef08a" strokeWidth="0.3" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" />

                {/* 5. Corner Crackle Top-Right */}
                <path d="M 50,0 L 55,10 L 65,5 L 70,20 L 85,10" 
                      className="animate-draw-lines" style={{ animationDuration: '2s', animationDelay: '0.2s' }}
                      stroke="#fde047" strokeWidth="0.4" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" />

                {/* 6. Corner Crackle Bottom-Left */}
                <path d="M 0,60 L 10,65 L 5,75 L 25,80 L 15,95 L 30,100" 
                      className="animate-draw-lines" style={{ animationDuration: '3.5s', animationDelay: '1.8s' }}
                      stroke="#fde047" strokeWidth="0.4" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" />

                {/* 7. Center Arc (Vertical) */}
                <path d="M 40,20 L 60,50 L 40,80" 
                      className="animate-draw-lines" style={{ animationDuration: '1.5s', animationDelay: '3s', animationIterationCount: 'infinite' }} 
                      stroke="#fff" strokeWidth="0.2" fill="none" filter="url(#static-glow)" vectorEffect="non-scaling-stroke" opacity="0.6" />
            </svg>
        </div>
    );
};
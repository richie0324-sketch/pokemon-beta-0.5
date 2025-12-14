import React from 'react';
import { FieldTerrain } from '../types';
import { CloudRain, Sun, Snowflake, Wind, Zap, CloudDrizzle, Flame, Activity, Hexagon } from 'lucide-react';

// Import split effects
import { BlizzardFilters, BlizzardParticles } from './vfx/BlizzardEffect';
import { ThunderStormFilters, ThunderStormParticles } from './vfx/ThunderStormEffect';
import { MistyRainFilters, MistyRainParticles } from './vfx/MistyRainEffect';
import { SandstormFilters, SandstormParticles } from './vfx/SandstormEffect';
import { ScorchingSunFilters, ScorchingSunParticles } from './vfx/ScorchingSunEffect';
import { VolcanicAshFilters, VolcanicAshParticles } from './vfx/VolcanicAshEffect';
import { GlitchFieldFilters, GlitchFieldParticles } from './vfx/GlitchFieldEffect';
import { StaticFieldFilters, StaticFieldParticles } from './vfx/StaticFieldEffect';
import { JungleFilters, JungleParticles } from './vfx/JungleEffect';

interface WeatherProps {
    terrain: FieldTerrain;
}

const getConfig = (terrain: FieldTerrain) => {
    switch (terrain) {
        case 'BLIZZARD': return { label: 'BLIZZARD', desc: 'Ice Types Attack/Spawn Boosted', style: 'bg-cyan-950/80 border-cyan-400 text-cyan-100', icon: <Snowflake size={14} /> };
        case 'THUNDER_STORM': return { label: 'THUNDERSTORM', desc: 'Water/Electric Types Attack/Spawn Boosted', style: 'bg-blue-950/80 border-blue-400 text-blue-100', icon: <CloudRain size={14} /> };
        case 'MISTY_RAIN': return { label: 'MISTY TERRAIN', desc: 'Water/Psychic Types Attack/Spawn Boosted', style: 'bg-teal-950/80 border-teal-400 text-teal-100', icon: <CloudDrizzle size={14} /> };
        case 'SANDSTORM': return { label: 'SANDSTORM', desc: 'Rock/Ground Types Attack/Spawn Boosted', style: 'bg-yellow-950/80 border-yellow-600 text-yellow-100', icon: <Wind size={14} /> };
        case 'SCORCHING_SUN': return { label: 'HARSH SUNLIGHT', desc: 'Fire/Ground Types Attack/Spawn Boosted', style: 'bg-orange-950/80 border-orange-500 text-orange-100', icon: <Sun size={14} /> };
        case 'VOLCANIC_ASH': return { label: 'VOLCANIC ASH', desc: 'Fire/Rock Types Attack/Spawn Boosted', style: 'bg-red-950/80 border-red-500 text-red-100', icon: <Flame size={14} /> };
        case 'STATIC_FIELD': return { label: 'MAGNETIC FIELD', desc: 'Electric Types Attack/Spawn Boosted', style: 'bg-yellow-900/80 border-yellow-400 text-yellow-100', icon: <Activity size={14} /> };
        case 'GLITCH_FIELD': return { label: 'REALITY ERROR', desc: 'Psychic/Ghost Types Attack/Spawn Boosted', style: 'bg-purple-950/90 border-purple-500 text-green-400 font-mono tracking-widest', icon: <Zap size={14} /> };
        case 'JUNGLE': return { label: 'OVERGROWTH', desc: 'Grass/Bug Types Attack/Spawn Boosted', style: 'bg-green-950/80 border-green-500 text-green-100', icon: <Hexagon size={14} /> };
        default: return null;
    }
};

// COMPONENT 1: BACKGROUND FILTERS
export const WeatherFilters: React.FC<WeatherProps> = ({ terrain }) => {
    switch (terrain) {
        case 'BLIZZARD': return <BlizzardFilters />;
        case 'THUNDER_STORM': return <ThunderStormFilters />;
        case 'MISTY_RAIN': return <MistyRainFilters />;
        case 'SANDSTORM': return <SandstormFilters />;
        case 'SCORCHING_SUN': return <ScorchingSunFilters />;
        case 'VOLCANIC_ASH': return <VolcanicAshFilters />;
        case 'STATIC_FIELD': return <StaticFieldFilters />;
        case 'GLITCH_FIELD': return <GlitchFieldFilters />;
        case 'JUNGLE': return <JungleFilters />;
        default: return null;
    }
};

// COMPONENT 2: FOREGROUND PARTICLES
export const WeatherParticles: React.FC<WeatherProps> = ({ terrain }) => {
    switch (terrain) {
        case 'BLIZZARD': return <BlizzardParticles />;
        case 'THUNDER_STORM': return <ThunderStormParticles />;
        case 'MISTY_RAIN': return <MistyRainParticles />;
        case 'SANDSTORM': return <SandstormParticles />;
        case 'SCORCHING_SUN': return <ScorchingSunParticles />;
        case 'VOLCANIC_ASH': return <VolcanicAshParticles />;
        case 'STATIC_FIELD': return <StaticFieldParticles />;
        case 'GLITCH_FIELD': return <GlitchFieldParticles />;
        case 'JUNGLE': return <JungleParticles />;
        default: return null;
    }
};

// COMPONENT 3: UI BANNER
export const WeatherBanner: React.FC<WeatherProps> = ({ terrain }) => {
    const config = getConfig(terrain);
    if (!config) return null;

    return (
        <div key={terrain} className={`absolute top-0 left-0 w-full py-2 px-2 md:px-4 text-center z-30 border-b-4 shadow-lg backdrop-blur-md animate-slide-down flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${config.style}`}>
            <div className="flex items-center gap-2 font-bold font-pixel text-[10px] md:text-sm uppercase drop-shadow-md">
                {config.icon} {config.label}
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30"></div>
            <div className="font-mono text-[9px] md:text-xs opacity-90 uppercase tracking-tighter md:tracking-tight drop-shadow-sm font-bold">
                {config.desc}
            </div>
        </div>
    );
};

// COMPONENT 4: COMPOSITE OVERLAY (For Previews/Simple Views)
export const WeatherOverlay: React.FC<WeatherProps> = ({ terrain }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 z-0">
                <WeatherFilters terrain={terrain} />
            </div>
            <div className="absolute inset-0 z-20">
                <WeatherParticles terrain={terrain} />
            </div>
            <WeatherBanner terrain={terrain} />
        </div>
    );
};

import { GEN1_STATS } from './gen1';
import { GEN2_STATS } from './gen2';
import { PokemonStats } from '../../types';

export const BASE_STATS_MAP: Record<number, PokemonStats> = {
    ...GEN1_STATS,
    ...GEN2_STATS
};

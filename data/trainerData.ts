
import { Trainer } from '../types';

// Import individual trainers
import { mrYe } from './trainers/mrYe';
import { youngsterJoey } from './trainers/youngsterJoey';
import { lassAnna } from './trainers/lassAnna';
import { hikerDave } from './trainers/hikerDave';
import { rocketGrunt } from './trainers/rocketGrunt';
import { gentlemanEdward } from './trainers/gentlemanEdward';
import { aceTrainerCool } from './trainers/aceTrainerCool';
import { championRed } from './trainers/championRed';

// Import Gym Leaders
import { 
    brock, misty, ltSurge, erika, koga, sabrina, blaine, giovanniGym,
    falkner, bugsy, whitney, morty, chuck, jasmine, pryce, clair
} from './trainers/gymLeaders';

export const NPC_REGISTRY: Record<string, Trainer> = {
    'mr-ye': mrYe,
    'youngster-joey': youngsterJoey,
    'lass-anna': lassAnna,
    'hiker-dave': hikerDave,
    'rocket-grunt-m': rocketGrunt,
    'gentleman-edward': gentlemanEdward,
    'ace-trainer-cool': aceTrainerCool,
    'champion-red': championRed,

    // Gen 1 Leaders
    'leader-brock': brock,
    'leader-misty': misty,
    'leader-surge': ltSurge,
    'leader-erika': erika,
    'leader-koga': koga,
    'leader-sabrina': sabrina,
    'leader-blaine': blaine,
    'leader-giovanni': giovanniGym,

    // Gen 2 Leaders
    'leader-falkner': falkner,
    'leader-bugsy': bugsy,
    'leader-whitney': whitney,
    'leader-morty': morty,
    'leader-chuck': chuck,
    'leader-jasmine': jasmine,
    'leader-pryce': pryce,
    'leader-clair': clair
};

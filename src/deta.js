import { Deta } from 'deta';

const deta = Deta('b0ouklc5_23zArb8iPdWFe3ZQGbd7x86gjBedFbfo');

export const Rooms = deta.Base('planningPoker_Rooms');

import {Event} from './eventTypes';
interface PocAssignment{
    id: number;
    userId: string;
    eventId: number;
    locationId: number;
    isActive: boolean;
    event: Event;
    //location: Location;
}
interface ResponsePOC{
    dataPocAssignment: PocAssignment[];
    dataPocUser: PocUser[];
    status: string;
    error: string;
}

interface PocUser {
  id: number;
  email: string;
  fullName?: string;
}

export type {PocAssignment, ResponsePOC, PocUser};
import {Event} from './eventTypes';
interface PocAssignmentType{
    id: number;
    userId: string;
    eventId: number;
    locationId: number;
    isActive: boolean;
    event: Event;
    //location: Location;
}
interface ResponsePOC{
    dataPocAssignment: PocAssignmentType[];
    dataPocUser: PocUser[];
    status: string;
    error: string;
}

interface PocUser {
  id: number;
  email: string;
  name?: string;
  role:string;
  tenantCode: string;
}

export type {PocAssignmentType, ResponsePOC, PocUser};
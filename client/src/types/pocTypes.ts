import {EventDetail, PocLocation, } from './eventTypes';
import {Location} from './locationTypes';
interface PocAssignmentType{
    id: number;
    userId: string;
    eventId: number;
    locationId: number;
    isActive: boolean;
    event: EventDetail;
    location: Location;
    pocLocation: PocLocation;
    pocLocationId: number;
}
interface ResponsePOC{
    dataPocAssignment: PocAssignmentType[];
    dataPocUser: PocUser[];
    status: string;
    error: string;
}

interface PocUser {
  id: string;
  email: string;
  name?: string;
  role:string;
  tenantCode: string;
}

export type {PocAssignmentType, ResponsePOC, PocUser};
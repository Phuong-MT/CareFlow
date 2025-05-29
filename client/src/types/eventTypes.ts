import {Location} from '@/types/locationTypes'
interface Event{
    tenantCode: string;
    locationId: number;
    title: string;
    dateStart: string;
    dateEnd: string;
    id: number;
    tenant?: Tenant;
    location?: Location;
}
interface Tenant {
  tenantCode: string;
  name: string;
}
interface EventState{
    events: Event[] | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}
interface floorPlan{
  id: number;
  name: string;
  floorPlanImageUrl: string;
  pocLoc:PocLocation[];
}
interface PocLocation{
  id: number;
  name: string;
  x:number;
  y:number;
  floorPlanId: number;
}
interface EventDetail{
  tenantCode: string;
    locationId: number;
    title: string;
    dateStart: string;
    dateEnd: string;
    id: number;
    floorPlan: floorPlan;
    tenant?: Tenant;
    location?: Location;
}
interface EventApiResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}
type EventStatus = 'ended' | 'ongoing' | 'upcoming';
interface EventRequest{
    tenantCode: string;
    page:number;
    limit:number;
}
export type {Event, EventRequest, EventState, EventStatus, EventApiResponse, floorPlan,EventDetail, PocLocation}
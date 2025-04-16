interface Event{
    tenantCode: string;
    locationId: number;
    title: string;
    dateStart: string;
    dateEnd: string;
    id: number;
}
interface EventState{
    events: Event[] | null,
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
type EventStatus = 'ended' | 'ongoing' | 'upcoming';
interface EventRequest{
    tenantCode: string;
}
export type {Event, EventRequest, EventState, EventStatus}
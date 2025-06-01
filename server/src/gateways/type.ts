interface Data{
    tenantCode: string;
    eventId: string; 
    locationId: string
}
export type {Data}
export enum SocketState{
    JOIN_ROOM = 'join_room',
    QUEUE_STATE = 'queue_state',
    LEAVE_ROOM = 'leave_room',
    NEW_QUEUE_CHECK_IN = 'new_queue_check_in',
    NEW_QUEUE_RECEiVED = 'new_queue_received',
    CALL_NEXT = 'call_next',
    QUEUE_STATE_UPDATE = 'queue_state_update',
    CALL_NEXT_SUCCESS = 'call_next_success',
    CALL_NEXT_ERROR = 'call_next_error',
}
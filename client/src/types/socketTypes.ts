import { Socket } from 'socket.io-client';
interface ResponseQueue{
    userId: string,
    nameUser: string,
    status: string,
    position: string,
    queueDate: Date
}
interface SocketState {
    isConnected: boolean;
    socketId: string | null;
    queueState: ResponseQueue[];
  }
export type {SocketState, ResponseQueue}
export enum SocketHeader{
    JOIN_ROOM = 'join_room',
    QUEUE_STATE = 'queue_state',
    LEAVE_ROOM = 'leave_room',
    NEW_QUEUE_CHECK_IN = 'new_queue_check_in',
    NEW_QUEUE_RECEIVED = 'new_queue_received',
    CALL_NEXT = 'call_next',
    QUEUE_STATE_UPDATE = 'queue_state_update',
    CALL_NEXT_SUCCESS = 'call_next_success',
    CALL_NEXT_ERROR = 'call_next_error',
}


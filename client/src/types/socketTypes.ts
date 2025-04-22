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
}


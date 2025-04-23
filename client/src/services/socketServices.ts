// socketService.ts
import { io, Socket } from 'socket.io-client';
import { ResponseQueue, SocketHeader } from '@/types/socketTypes';
import { store } from '@/store/stores';
import { setQueueState, addQueueState, setDisconnected } from '@/store/socketSlide';
let socket: Socket | null = null;

export const connectSocket = (url: string, token: string): Socket => {
  if (!socket) {
    socket = io(url, {
        auth: {token},
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if(socket){
    socket.disconnect();
    store.dispatch(setDisconnected())
  }
  socket = null;
};

export const JoinRoom = (data: {tenantCode: string; eventId: string; locationId: string })=>{
    if(!socket){
        console.log('socket disconnect')
        return;
    } 
    try{
        socket.off(SocketHeader.QUEUE_STATE);
        socket.emit(SocketHeader.JOIN_ROOM, 
            data, 
            (response: { success: boolean;message: string }) => {
                console.log(`Join room: ${response.message}`)
              }
        )
        socket.on(SocketHeader.QUEUE_STATE, (data) => {
            console.log('QUEUE_STATE:', data);
            store.dispatch(setQueueState(data));
          });
    }catch(error){
        console.error("Error joining room:", error);
        throw error;
    }
}
export const NewQueueCheckIn = (data: {
    tenantCode: string;
    eventId: string;
    locationId: string;
    name: string;
  }) => {
    if (!socket) return;
  
    socket.emit(SocketHeader.NEW_QUEUE_CHECK_IN, data, (response: { success: boolean; message: string }) => {
        console.log(`Check in queue: ${response.message}`);
    });
  };
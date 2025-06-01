'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/config';
import { JoinRoom, NewQueueCheckIn, connectSocket, disconnectSocket, getSocket } from '@/services/socketServices';
import { addQueueState, setConnected, setQueueState } from '@/store/socketSlide';
import { ResponseQueue, SocketHeader } from '@/types/socketTypes';
import QueueCheckIn from '@/components/admin/handle-checkin';
import { Button } from '@/components/ui/button';

export default function LivePage() {
  const { roomId } = useParams() as { roomId: string };
  const dispatch = useAppDispatch();
  const {queueState } = useAppSelector((state) => state.socket);
  const token = useAppSelector((state) => state.user.access_token);
  console.log(queueState.length)
  useEffect(() => {
      if (!roomId || !token) return;

      const [tenantCode, eventId, locationId, pocLocationId] = decodeURIComponent(roomId).split(':');

      try {
        connectSocket(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080', token);
        const socket = getSocket();
        dispatch(setConnected(socket?.id));
        JoinRoom({ tenantCode, eventId, locationId });
        return () => {
          const socket = getSocket();
          if (socket) {
            socket.off(SocketHeader.QUEUE_STATE);
            socket.off(SocketHeader.NEW_QUEUE_RECEIVED);
          }
          disconnectSocket();
        };
      } catch (error) {
        console.error("Error joining room:", error);
      }
      
    // return () => {
    //   const socket = getSocket();
    //   if (socket) {
    //     socket.off(SocketHeader.QUEUE_STATE);
    //     socket.off(SocketHeader.NEW_QUEUE_RECEIVED);
    //   }
    // };
  }, [roomId, token, dispatch]);
  useEffect(() => {
    const socket = getSocket()
    if(socket){
      socket.off(SocketHeader.NEW_QUEUE_RECEIVED);
      socket.on(SocketHeader.NEW_QUEUE_RECEIVED, (queueData: ResponseQueue) => {
        dispatch(addQueueState(queueData))
      });

      socket.off(SocketHeader.CALL_NEXT_ERROR);
      socket.on(SocketHeader.CALL_NEXT_ERROR, (error: string)=>{
        alert('call next error: '+error);
      });

      socket.off(SocketHeader.CALL_NEXT_SUCCESS);
      socket.on(SocketHeader.CALL_NEXT_SUCCESS, (queueData: {
         data: {
          userId: string,
          nameUser: string,
          pocLocationId?: number,
          message: string,
        }
      }) => {
        console.log(queueData);
        setTimeout(()=>{
          alert(`Thông báo userId: ${queueData.data.userId}, Bạn : ${queueData.data.nameUser}, Vui lòng di chuyển tới vị trí: ${queueData.data.pocLocationId}, ${queueData.data.message}`);
        }, 1000);
      });
      socket.off(SocketHeader.QUEUE_STATE_UPDATE);
      socket.on(SocketHeader.QUEUE_STATE_UPDATE, (updatedQueue: ResponseQueue[]) => {
        dispatch(setQueueState(updatedQueue));
      });
    }
  }, [roomId, token]);
  const handleNewQueueCheckIn = (newUser: { name: string; tenantCode: string; eventId: string; locationId: string }) => {
    NewQueueCheckIn(newUser);
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Queue Status</h1>

      <QueueCheckIn roomId={roomId} onCheckIn={handleNewQueueCheckIn} /> 
      <Button
        onClick={()=>{
          const socket = getSocket();
          if (socket) {
            const [tenantCode, eventId, locationId, pocLocationId] = decodeURIComponent(roomId).split(':');
            console.log(pocLocationId)
            socket.emit(SocketHeader.CALL_NEXT, { tenantCode, eventId, locationId, pocLocationId }); 
          }
        }}
      > Phục vụ </Button>
      <div className="bg-white shadow-md rounded-xl p-4">
        {queueState.length === 0 ? (
          <p className="text-gray-500">Không có người nào trong hàng chờ.</p>
        ) : (
          <ul className="space-y-2">
            {queueState.map((item, index) => (
              <li
                key={item.userId || index}
                className="p-3 bg-blue-50 rounded-lg flex justify-between items-center"
              >
                <span className="font-medium">{item.nameUser}</span>
                <span className="text-sm text-gray-600">STT: {item.position}</span>
                <span>
                  {item.status === 'pending' &&<span className="text-yellow-500">Đang chờ</span>}
                  {item.status === 'serving' &&<span className="text-green-500">Đang phục vụ</span>}
                </span>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/config';
import { JoinRoom, NewQueueCheckIn, connectSocket, getSocket } from '@/services/socketServices';
import { addQueueState, setConnected } from '@/store/socketSlide';
import { ResponseQueue, SocketHeader } from '@/types/socketTypes';
import QueueCheckIn from '@/components/admin/handle-checkin';

export default function LivePage() {
  const { roomId } = useParams() as { roomId: string };
  const dispatch = useAppDispatch();
  const {queueState } = useAppSelector((state) => state.socket);
  const token = useAppSelector((state) => state.user.access_token);
  console.log(queueState.length)
  useEffect(() => {
      if (!roomId || !token) return;

      const [tenantCode, eventId, locationId] = decodeURIComponent(roomId).split(':');

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
        };
      } catch (error) {
        console.error("Error joining room:", error);
      }
      
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off(SocketHeader.QUEUE_STATE);
        socket.off(SocketHeader.NEW_QUEUE_RECEIVED);
      }
    };
  }, [roomId, token, dispatch]);
  const socket = getSocket()
  useEffect(() => {
    socket?.on(SocketHeader.NEW_QUEUE_RECEIVED, (queueData: ResponseQueue) => {
      dispatch(addQueueState(queueData))
    });
  }, [socket]);
  const handleNewQueueCheckIn = (newUser: { name: string; tenantCode: string; eventId: string; locationId: string }) => {
    NewQueueCheckIn(newUser);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Queue Status</h1>

      <QueueCheckIn roomId={roomId} onCheckIn={handleNewQueueCheckIn} /> 

      <div className="bg-white shadow-md rounded-xl p-4">
        {queueState.length === 0 ? (
          <p className="text-gray-500">Không có người nào trong hàng chờ.</p>
        ) : (
          <ul className="space-y-2">
            {queueState.map((item) => (
              <li
                key={item.userId}
                className="p-3 bg-blue-50 rounded-lg flex justify-between items-center"
              >
                <span className="font-medium">{item.nameUser}</span>
                <span className="text-sm text-gray-600">STT: {item.position}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

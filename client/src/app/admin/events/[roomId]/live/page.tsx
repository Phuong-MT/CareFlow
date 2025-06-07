'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/config';
import { JoinRoom, NewQueueCheckIn, connectSocket, disconnectSocket, getSocket } from '@/services/socketServices';
import { addQueueState, setConnected } from '@/store/socketSlide';
import { ResponseQueue, SocketHeader } from '@/types/socketTypes';
import QueueCheckIn from '@/components/admin/handle-checkin';
import QRGenerator from '@/components/ui/Qrcode';
import Image from 'next/image';
import api from '@/utils/axiosConfig'
import { PocLocation } from '@/types/eventTypes';
export default function LivePage() {
  const { roomId } = useParams() as { roomId: string };
  const dispatch = useAppDispatch();
  const {queueState } = useAppSelector((state) => state.socket);
  const token = useAppSelector((state) => state.user.access_token);
  const [floorPlan, setFloorPlan] = useState()
  const [pocLocation, setPocLocation] = useState<PocLocation[]>();
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState<string>('')
  //console.log(queueState.length)
  useEffect(()=>{
    const [tenantCode, eventId, locationId] = decodeURIComponent(roomId).split(':')
    const fetchFloorPlan = async()=>{
      const FP  = await api.get(`floor-plan/${eventId}`)
      console.log(FP.data)
      if(FP.status === 200){
        setFloorPlan(FP.data)
        setFloorPlanImageUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}${FP.data.floorPlanImageUrl}`)
        setPocLocation(FP.data.pocLocations as PocLocation[])
      }
    }
    fetchFloorPlan()
  },[roomId])
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
  const socket = getSocket()
  useEffect(() => {
    if(socket){
      socket.off(SocketHeader.NEW_QUEUE_RECEIVED);
      socket.on(SocketHeader.NEW_QUEUE_RECEIVED, (queueData: ResponseQueue) => {
        dispatch(addQueueState(queueData))
      });
    }
  }, [socket]);
  const handleNewQueueCheckIn = (newUser: { name: string; tenantCode: string; eventId: string; locationId: string }) => {
    NewQueueCheckIn(newUser);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Queue Status</h1>
       <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="flex-1 space-y-4">
          <QueueCheckIn roomId={roomId} onCheckIn={handleNewQueueCheckIn} />
          <QRGenerator roomId={roomId} />
        </div>
         {floorPlanImageUrl && (
          <div className="w-[500px] h-full flex-shrink-0 relative border rounded overflow-hidden">
            <Image
              src={floorPlanImageUrl}
              width={500}
              height={300}
              alt="floor plan"
              className="object-contain w-full h-auto"
            />
            {pocLocation && pocLocation.map((poc)=>{
              return (
                <div
                  key={poc.id}
                  className="absolute w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs"
                  style={{
                    top: `${poc.y}%`,
                    left: `${poc.x}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={poc.name}
                  >
                  {poc.name}
                </div>
              )
                                  
            })}
          </div>
        )}
      </div>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

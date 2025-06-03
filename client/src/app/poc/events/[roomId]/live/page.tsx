'use client';

import { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/config';
import { JoinRoom, NewQueueCheckIn, connectSocket, disconnectSocket, getSocket } from '@/services/socketServices';
import { addQueueState, setConnected, setQueueState } from '@/store/socketSlide';
import { ResponseQueue, SocketHeader } from '@/types/socketTypes';
import QueueCheckIn from '@/components/admin/handle-checkin';
import { Button } from '@/components/ui/button';
import { getAssignments } from '@/store/pocAssignmentSlide';
import { PocAssignmentType } from '@/types/pocTypes';
import Image from 'next/image';
import { PocLocation } from '@/types/eventTypes';
import QRGenerator from '@/components/ui/Qrcode';
export default function LivePage() {
  const { roomId } = useParams() as { roomId: string };
  const dispatch = useAppDispatch();
  const {queueState } = useAppSelector((state) => state.socket);
  const token = useAppSelector((state) => state.user.access_token);
  const [isServing, setIsServing] = useState(false);
  const dataPocAssignment = useAppSelector(state => state.poc.dataPocAssignment) as PocAssignmentType[]
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState('');
  const [pocLocation, setPocLocation] = useState<PocLocation>();
  const [IdServing, setIdServing] = useState<number | null>(null);
  useEffect(() => {
    const fetchData = async ()=>{
      await dispatch(getAssignments())
    }
    fetchData();
  }, [dispatch])

useEffect(() => {
  const [tenantCode, eventIdStr, locationIdStr, pocLocationIdStr] = decodeURIComponent(roomId).split(':');

  const eventId = Number(eventIdStr);
  const locationId = Number(locationIdStr);
  const pocLocationId = Number(pocLocationIdStr);

  if (dataPocAssignment) {
    const pocAssignment = (dataPocAssignment).find(
      (assignment) =>
        assignment.event.id === eventId &&
        assignment.location.id === locationId &&
        assignment.pocLocation.id === pocLocationId
    );

    if (pocAssignment) {
      setFloorPlanImageUrl(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${pocAssignment.event.floorPlan.floorPlanImageUrl}`
      );
      setPocLocation(pocAssignment.pocLocation);
      setIdServing(pocAssignment.pocLocation.id);
    }
  }
}, [dataPocAssignment, roomId]);


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
  
  useEffect(() => {
    const [tenantCode, eventId, locationId, pocLocationId] = decodeURIComponent(roomId).split(':');
    if(queueState.length> 0){
      const check = queueState.some((item) =>(item.status === 'serving' && item.pocLocationId === Number(pocLocationId)));
      setIsServing(check);
    }
  }, [queueState]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Queue Status</h1>
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="flex-1 space-y-4">
          <QueueCheckIn roomId={roomId} onCheckIn={handleNewQueueCheckIn} />
          <QRGenerator roomId={roomId} />
        </div>
        {floorPlanImageUrl && pocLocation && (
          <div className="w-[500px] h-full flex-shrink-0 relative border rounded overflow-hidden">
            <Image
              src={floorPlanImageUrl}
              width={500}
              height={300}
              alt="floor plan"
              className="object-contain w-full h-auto"
            />
            <div
              key={pocLocation.id}
              className="absolute w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs"
              style={{
                top: `${pocLocation.y}%`,
                left: `${pocLocation.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
              title={pocLocation.name}
            >
              {pocLocation.name}
            </div>
          </div>
        )}
      </div>
      <Button
        onClick={()=>{
          const socket = getSocket();
          if (socket) {
            const [tenantCode, eventId, locationId, pocLocationId] = decodeURIComponent(roomId).split(':');
            console.log(pocLocationId)
            socket.emit(SocketHeader.CALL_NEXT, { tenantCode, eventId, locationId, pocLocationId }); 
            setIsServing(true);
          }
        }}
        disabled={isServing}
      > Phục vụ </Button>
      <Button
          className="bg-green-500 text-white"
          onClick={() => {
            const socket = getSocket();
            if (socket && IdServing && pocLocation?.id) { 
              const [tenantCode, eventId, locationId] = decodeURIComponent(roomId).split(':');
              console.log(`IdServing: ${IdServing}, pocLocationId: ${pocLocation.id}, tenantCode: ${tenantCode}, eventId: ${eventId}, locationId: ${locationId}`);
              socket.emit(SocketHeader.HANDLE_SUCCESS, { queueId: IdServing, tenantCode, eventId, locationId, pocLocationId: pocLocation.id });
              setIsServing(false);
              setIdServing(null);
            }
          }}
          disabled={!isServing}
        >
          Đã xong
        </Button>
        
      <div className="bg-white shadow-md rounded-xl p-4">
        {queueState.length === 0 ? (
          <p className="text-gray-500">Không có người nào trong hàng chờ.</p>
        ) : (
          <ul className="space-y-2">
            {queueState.length > 0&&queueState.map((item, index) => (
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

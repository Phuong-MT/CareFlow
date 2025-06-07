'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/config'
import { getAssignments } from '@/store/pocAssignmentSlide';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { EventStatus } from '@/types/eventTypes';

export default function PocAssignmentList() {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const { dataPocAssignment, status, error } = useAppSelector((state) => state.poc);
  useEffect(() => {
    dispatch(getAssignments())
  }, [dispatch]);
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
  }
  
  const getEventStatus = (startTime: string, endTime: string): EventStatus => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'ongoing';
  };

  const renderBadge = (status: EventStatus) => {
    switch (status) {
      case 'ended':
        return <Badge variant="destructive">Đã kết thúc</Badge>;
      case 'ongoing':
        return <Badge variant="default" className="bg-green-600">Đang diễn ra</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-blue-600 border-blue-400">Sắp diễn ra</Badge>;
    }
  };

  if (status === 'loading') return <p>Đang tải dữ liệu POC...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;
  
  return (
     <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sự kiện bạn được phân công</h1>

      {dataPocAssignment.map((assignment) => {
         const status = getEventStatus(assignment.event.dateStart, assignment.event.dateEnd); 
        const { event, location, pocLocation } = assignment
        const floorPlanUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${event.floorPlan.floorPlanImageUrl}`

        return (
        <Card className="p-4" key={assignment.id}>
          <CardHeader >
            <div className="flex flex-row space-y-0 pb-2">
              <CardTitle>{assignment.event.title}</CardTitle>
              {renderBadge(status)}
            </div>
            <div className="text-sm">
              <p>{assignment.location.name}</p>
              <p>Thời gian: {formatTime(assignment.event.dateStart)} - {formatTime(assignment.event.dateEnd)}</p>
            </div>
          </CardHeader>

          <CardContent>
            <p className="mb-2 text-sm">{assignment.location.address}</p>

            <div className="flex gap-4 items-start">
              {/* Floor Plan Image */}
              <div className="w-[300px] flex-shrink-0 relative border rounded overflow-hidden">
                <Image
                  src={`${floorPlanUrl}`}
                  alt="floor plan"
                  width={300}
                  height={300}
                  className="object-contain w-full h-auto"
                />
                 {event.floorPlan.pocLocations.map((poc: any) => (
                  <div
                    key={poc.id}
                    className={`absolute w-5 h-5 rounded-full ${
                      poc.id === pocLocation.id ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      top: `${poc.y}%`,
                      left: `${poc.x}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={poc.name}
                  >
                    <span className="text-xs">{poc.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm mt-2">
                Bạn được phân công tại: <strong>{assignment.pocLocation.name}</strong> (
                {assignment.pocLocation.x}, {assignment.pocLocation.y})
              </div>
            </div>
          </CardContent>
          {status !== 'ended' &&(
            <Button
            onClick={()=>{
              const roomId = `${event.tenantCode}:${event.id}:${event.locationId}:${assignment.pocLocation.id}`;
              router.push(`/poc/events/${roomId}/live`);
            }}
          > xem chi tiết</Button>
          )
        }
        </Card>
        )
      })}
    </div>
  )
}

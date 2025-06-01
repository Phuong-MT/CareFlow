'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/config'
import { getAssignments } from '@/store/pocAssignmentSlide';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
  
  if (status === 'loading') return <p>Đang tải dữ liệu POC...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;
  
  return (
     <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sự kiện bạn được phân công</h1>

      {dataPocAssignment.map((assignment) => {
        const { event, location, pocLocation } = assignment
        const floorPlanUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${event.floorPlan.floorPlanImageUrl}`

        return (
        <Card className="p-4" key={assignment.id}>
          <CardHeader>
            <CardTitle>{assignment.event.title}</CardTitle>
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
          <Button
            onClick={()=>{
              const roomId = `${event.tenantCode}:${event.id}:${event.locationId}:${assignment.pocLocation.id}`;
              router.push(`/poc/events/${roomId}/live`);
            }}
          > xem chi tiet</Button>
        </Card>
        )
      })}
    </div>
  )
}

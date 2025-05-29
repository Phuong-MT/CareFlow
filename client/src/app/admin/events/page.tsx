'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/config';
import { getAllEvents } from '@/store/eventSlide';
import { EventRequest, EventStatus } from '@/types/eventTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import PaginationControls from '@/components/admin/paginationControls';

export default function EventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { events, status, pagination } = useAppSelector((state) => state.events);
  const tenantCode = useAppSelector((state) => state.user.user?.tenantCode);

  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await dispatch(getAllEvents({ tenantCode, page, limit } as EventRequest));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, [page]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">📅 Danh sách sự kiện</h1>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : status === 'succeeded' && events && events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {events.map((event) => {
              const status = getEventStatus(event.dateStart, event.dateEnd);
              const roomId = `${event.tenantCode}:${event.id}:${event.locationId}`;

              return (
                <Card key={event.id} className="transition-all duration-300 hover:shadow-lg border border-border bg-background">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
                    {renderBadge(status)}
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-col items-start">
                        <span>Tenant: {event.tenant?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-col items-start">
                        <span>Location: {event.location?.name}</span>
                        <span>Address: {event.location?.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                      <span>{new Date(event.dateStart).toLocaleDateString()} - {new Date(event.dateEnd).toLocaleDateString()}</span>
                    </div>

                    <div className='flex flex-col'>
                      {status !== 'ended' && (
                      <div className="pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/events/${roomId}/live`)}
                        >
                          Xem Realtime
                        </Button>
                      </div>
                      
                    )}
                    <div className="pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/events/${roomId}/event-detail`)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <PaginationControls
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.limit)}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p className="text-muted-foreground text-sm">Không có sự kiện nào.</p>
      )}
    </div>
  );
}

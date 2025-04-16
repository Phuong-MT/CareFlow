"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/config";
import { getAllEvents } from "@/store/eventSlide";
import { EventRequest, EventStatus } from "@/types/eventTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
export default function EventsPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const {events, status, error} = useAppSelector((state)=> state?.events);
  const tenantCode = useAppSelector(state=> state.user.user?.tenantCode)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        await dispatch(getAllEvents({tenantCode} as EventRequest));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [getAllEvents]);

  

  const getEventStatus = (startTime: string, endTime: string): EventStatus => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
  
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'ongoing';
  };
  
  return (
    <div className="p-6 container  mx-auto ">
      <h1 className="text-3xl font-bold mb-6">📅 Danh sách sự kiện</h1>

      {status === 'loading' && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'succeeded' && events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => {
            const status = getEventStatus(event.dateStart, event.dateEnd);

            const cardStyle = {
              ended: 'border-red-500 bg-red-50',
              ongoing: 'border-green-500 bg-green-50',
              upcoming: 'border-blue-500 bg-blue-50',
            };

            const badge = {
              ended: <Badge variant="destructive">Đã kết thúc</Badge>,
              ongoing: <Badge variant="default" className="bg-green-500 hover:bg-green-600">Đang diễn ra</Badge>,
              upcoming: <Badge variant="outline" className="text-blue-600 border-blue-400">Sắp diễn ra</Badge>,
            };

            return (
              <Card
                key={event.id}
                className={`hover:shadow-lg transition-all duration-200 ${cardStyle[status]}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {event.title}
                    {badge[status]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-muted-foreground">
                  <p>
                    <strong>📍 Tenant:</strong> {event.tenantCode}
                  </p>
                  <p>
                    <strong>📌 Location ID:</strong> {event.locationId}
                  </p>
                  <p>
                    <strong>🕒 Từ:</strong>{' '}
                    {new Date(event.dateStart).toLocaleDateString()} -{' '}
                    {new Date(event.dateEnd).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}

        </div>
      ) : (
        status === 'succeeded' && <p className="text-muted-foreground">Không có sự kiện nào.</p>
      )}
    </div>
  );
}
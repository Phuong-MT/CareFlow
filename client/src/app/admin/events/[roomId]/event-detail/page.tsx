'use client'

import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/config";
import { useEffect } from "react";
import {EventDetailPage} from '@/components/admin/event-detail'
export default function Event(){
    const dispatch = useAppDispatch();
    const { roomId } = useParams() as { roomId: string };
    const [tenantCode, eventId, locationId] = decodeURIComponent(roomId).split(':');
    useEffect(()=>{

    },[])
    return (
        <div>
           <EventDetailPage eventCode={Number(eventId)}></EventDetailPage>
        </div>
    );
}
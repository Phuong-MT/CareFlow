'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {getPocUser} from '@/store/pocAssignmentSlide'
import { useAppSelector,useAppDispatch } from '@/hooks/config'
import { getAllEvents } from '@/store/eventSlide'
import PaginationControls from '@/components/admin/paginationControls'
import { EventRequest, Event } from '@/types/eventTypes'

export default function AssignPocPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [selectedEventIds, setSelectedEventIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const { events, pagination } = useAppSelector((state) => state.events);
  const { dataPocUser } = useAppSelector((state) => state.poc);
  const tenantCode = useAppSelector(state => state.user?.user?.tenantCode)
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1);
    const limit = 10;
  useEffect(()=>{
    const fetchData = async ()=>{
      await dispatch(getPocUser());
      await dispatch(getAllEvents({ tenantCode, page, limit } as EventRequest))
    }
    fetchData()
  },[])


  const handleToggleEvent = (eventId: number) => {
    setSelectedEventIds(prev => {
      const next = new Set(prev)
      next.has(eventId) ? next.delete(eventId) : next.add(eventId)
      return next
    })
  }


  const handleAssign = async () => {
    if (!selectedUserId || selectedEventIds.size === 0) {
      toast.warning('Vui lòng chọn người dùng và ít nhất 1 sự kiện.')
      return
    }

    try {
      setLoading(true)
      console.log('selectedUserId', selectedUserId)
//await apiAssignPocToEvents(Number(selectedUserId), Array.from(selectedEventIds))
      toast.success('Phân công thành công!')
      setSelectedUserId(undefined)
      setSelectedEventIds(new Set())
    } catch (err) {
      toast.error('Phân công thất bại.')
    } finally {
      setLoading(false)
    }
  }

 const mockEvents: Event[] = [
  {
    id: 1,
    tenantCode: 'TENANT001',
    locationId: 101,
    title: 'Khám tổng quát định kỳ',
    dateStart: '2025-06-01T08:00:00Z',
    dateEnd: '2025-06-01T11:00:00Z',
  },
  {
    id: 2,
    tenantCode: 'TENANT002',
    locationId: 102,
    title: 'Tư vấn sức khỏe tâm lý',
    dateStart: '2025-06-02T13:00:00Z',
    dateEnd: '2025-06-02T16:00:00Z',
  },
  {
    id: 3,
    tenantCode: 'TENANT003',
    locationId: 103,
    title: 'Tiêm phòng vaccine mùa hè',
    dateStart: '2025-06-03T09:30:00Z',
    dateEnd: '2025-06-03T12:00:00Z',
  },
  {
    id: 4,
    tenantCode: 'TENANT001',
    locationId: 101,
    title: 'Khám chuyên khoa da liễu',
    dateStart: '2025-06-04T10:00:00Z',
    dateEnd: '2025-06-04T12:30:00Z',
  },
  {
    id: 5,
    tenantCode: 'TENANT004',
    locationId: 104,
    title: 'Tư vấn dinh dưỡng cho trẻ em',
    dateStart: '2025-06-05T14:00:00Z',
    dateEnd: '2025-06-05T17:00:00Z',
  },
  {
    id: 6,
    tenantCode: 'TENANT005',
    locationId: 105,
    title: 'Khám mắt cộng đồng',
    dateStart: '2025-06-06T07:30:00Z',
    dateEnd: '2025-06-06T10:30:00Z',
  },
  {
    id: 7,
    tenantCode: 'TENANT006',
    locationId: 106,
    title: 'Khám tầm soát ung thư',
    dateStart: '2025-06-07T09:00:00Z',
    dateEnd: '2025-06-07T12:00:00Z',
  },
  {
    id: 8,
    tenantCode: 'TENANT003',
    locationId: 103,
    title: 'Khám nội tổng hợp',
    dateStart: '2025-06-08T08:00:00Z',
    dateEnd: '2025-06-08T11:00:00Z',
  },
  {
    id: 9,
    tenantCode: 'TENANT002',
    locationId: 102,
    title: 'Tư vấn sức khỏe tiền sản',
    dateStart: '2025-06-09T13:00:00Z',
    dateEnd: '2025-06-09T15:30:00Z',
  },
  {
    id: 10,
    tenantCode: 'TENANT004',
    locationId: 104,
    title: 'Tiêm chủng cho người lớn',
    dateStart: '2025-06-10T10:00:00Z',
    dateEnd: '2025-06-10T12:00:00Z',
  },
];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Phân công POC cho sự kiện</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn người dùng POC</label>
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn người dùng" />
          </SelectTrigger>
          <SelectContent>
            {dataPocUser.map(user => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn sự kiện</label>
        {mockEvents && <ScrollArea className="h-64 rounded border p-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {mockEvents.map(event => (
              <Card
                key={event.id}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted transition"
                onClick={() => handleToggleEvent(event.id)}
              >
                <Checkbox
                  checked={selectedEventIds.has(event.id)}
                  onCheckedChange={() => handleToggleEvent(event.id)}
                  id={`event-${event.id}`}
                />
                <label htmlFor={`event-${event.id}`} className="text-sm font-medium">
                  {event.title} - {event.location?.name}
                </label>
              </Card>
            ))}
          </div>
        </ScrollArea>}
        {events === null || events.length === 0 && <p className="text-sm text-muted-foreground">Không có sự kiện nào.</p>}
      </div>
          <PaginationControls
                    currentPage={pagination.page}
                    totalPages={Math.ceil(pagination.total / pagination.limit)}
                    onPageChange={setPage}
                  />
      <Button onClick={handleAssign}  disabled={loading || !selectedUserId || selectedEventIds.size === 0}>
        {loading ? 'Đang phân công...' : 'Phân công'}
      </Button>
    </div>
  )
}

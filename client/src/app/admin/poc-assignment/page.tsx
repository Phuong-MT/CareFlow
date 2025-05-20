'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks/config'

export default function AssignPocPage() {
//   const [users, setUsers] = useState<PocUser[]>([])
//   const [events, setEvents] = useState<Event[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [selectedEventIds, setSelectedEventIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const {events} = useAppSelector((state) => state.events)
  const {dataPocUser} = useAppSelector((state) => state.poc)
  // const {events} = useAppSelector((state) => state.events)
  useEffect(() => {
    const fetchData = async () => {
    //   const usersRes = await apiGetPocUsers()
    //   const eventsRes = await apiGetEvents()
    //   setUsers(usersRes)
    //   setEvents(eventsRes)
    }
    fetchData()
  }, [])

  const handleToggleEvent = (eventId: number) => {
    setSelectedEventIds(prev => {
      const next = new Set(prev)
      next.has(eventId) ? next.delete(eventId) : next.add(eventId)
      return next
    })
  }


  // const handleAssign = async () => {
  //   if (!selectedUserId || selectedEventIds.size === 0) {
  //     toast.warning('Vui lòng chọn người dùng và ít nhất 1 sự kiện.')
  //     return
  //   }

  //   try {
  //     setLoading(true)
  //     await apiAssignPocToEvents(Number(selectedUserId), Array.from(selectedEventIds))
  //     toast.success('Phân công thành công!')
  //     setSelectedUserId(undefined)
  //     setSelectedEventIds(new Set())
  //   } catch (err) {
  //     toast.error('Phân công thất bại.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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
                {user.fullName || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn sự kiện</label>
        {events && <ScrollArea className="h-64 rounded border p-2">
          <div className="space-y-2">
            {events.map(event => (
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

      <Button  disabled={loading || !selectedUserId || selectedEventIds.size === 0}>
        {loading ? 'Đang phân công...' : 'Phân công'}
      </Button>
    </div>
  )
}

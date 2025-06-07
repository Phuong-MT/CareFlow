'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { useAppSelector, useAppDispatch } from '@/hooks/config'
import { getPocUser } from '@/store/pocAssignmentSlide'
import { getAllEvents } from '@/store/eventSlide'
import PaginationControls from '@/components/admin/paginationControls'
import { EventRequest } from '@/types/eventTypes'
import Image from 'next/image'
import api from '@/utils/axiosConfig'
import { set } from 'zod'

export default function AssignPocPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>()
  const [selectedPocLocationId, setSelectedPocLocationId] = useState<number | undefined>()
  const [locationId, setLocationId] = useState<number | undefined>()
  const [loading, setLoading] = useState(false)

  const { events, pagination } = useAppSelector(state => state.events)
  const { dataPocUser } = useAppSelector(state => state.poc)
  const tenantCode = useAppSelector(state => state.user?.user?.tenantCode)
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    dispatch(getPocUser())
    dispatch(getAllEvents({ tenantCode, page, limit } as EventRequest))
  }, [dispatch, tenantCode, page])

  const selectedEvent = events ? events.find(ev => ev.id === selectedEventId) : undefined

  const handleAssign = async () => {
    if (!selectedUserId || !selectedEventId || !selectedPocLocationId || !locationId) {
      alert('Vui lòng chọn đầy đủ người dùng, sự kiện và vị trí.')
      return
    }
    console.log(
      `Assigning POC: User ID: ${selectedUserId}, Event ID: ${selectedEventId}, Location ID: ${locationId}, POC Location ID: ${selectedPocLocationId}`
    )
    try {
      setLoading(true)
      const res = await api.post(`/poc-assignment/userId/${selectedUserId}/event/${selectedEventId}/location/${locationId}/assign/${selectedPocLocationId}`)
      if(res.status === 200){
        alert('Phân công thành công!')
        setSelectedUserId(undefined)
        setSelectedEventId(undefined)
        setSelectedPocLocationId(undefined)
      }
      else{
        alert('Phân công thất bại.')
      }
    } catch (err) {
      alert('Phân công thất bại.')
    } finally {
      setLoading(false)
    }
  }
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
  }
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Phân công POC cho sự kiện</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn người dùng POC</label>
        <Select value={selectedUserId ?? ""}
            onValueChange={(value) => {
              setSelectedUserId(value || undefined);
            }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn người dùng" />
          </SelectTrigger>
          <SelectContent>
            {dataPocUser.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn sự kiện</label>
        <Select
          value={selectedEventId ? `${selectedEventId}-${locationId ?? ""}` : ""}
          onValueChange={(value) => {
            const [idStr, locationIdStr] = value.split("-");
            setSelectedEventId(idStr ? Number(idStr) : undefined);
            setLocationId(locationIdStr ? Number(locationIdStr) : undefined);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn sự kiện" />
          </SelectTrigger>
          <SelectContent>
            {events &&
              events.map((event) => (
                <SelectItem
                  key={event.id}
                  value={`${event.id}-${event.locationId}`}
                >
                  {event.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <Card className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatTime(selectedEvent.dateStart)} - {formatTime(selectedEvent.dateEnd)}
            </p>
            <p className="text-sm">{selectedEvent?.location?.name} - {selectedEvent?.location?.address}</p>
          </div>

           <div className="relative w-full max-w-[600px] h-full aspect-video border rounded overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}${selectedEvent.floorPlan.floorPlanImageUrl}`}
              alt="Floor Plan"
              fill
              className="object-contain"
            />

            {selectedEvent.floorPlan.pocLocations.map((poc) => (
              <div
                key={poc.id}
                className="absolute w-4 h-4 bg-red-500 rounded-full border border-white text-xs flex items-center justify-center"
                style={{
                  left: `${poc.x}%`,
                  top: `${poc.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={poc.name}
              >
                {poc.name}
              </div>
            ))}
          </div>

          {selectedEvent.floorPlan?.pocLocations?.length > 0 && (
            <div>
              <label className="text-sm font-medium">Chọn vị trí check-in:</label>
              <Select 
               value={selectedPocLocationId?.toString() ?? ""}
              onValueChange={(value) => {
                setSelectedPocLocationId(value ? Number(value) : undefined);
              }}
              disabled={!selectedEvent}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  {selectedEvent.floorPlan.pocLocations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </Card>
      )}

      <PaginationControls
        currentPage={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        onPageChange={setPage}
      />

      <Button onClick={handleAssign} disabled={loading}>
        {loading ? 'Đang phân công...' : 'Phân công'}
      </Button>
    </div>
  )
}

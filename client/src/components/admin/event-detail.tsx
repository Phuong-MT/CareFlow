import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import api from '@/utils/axiosConfig'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { PocLocation, EventDetail } from '@/types/eventTypes'

interface EventProps {
  eventCode: number
}

let tempId = -1 // để tạo ID tạm cho POC mới

export const EventDetailPage = ({ eventCode }: EventProps) => {
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState<string>('')
  const [markedPoints, setMarkedPoints] = useState<PocLocation[]>([])
  const [selectedPoint, setSelectedPoint] = useState<string>('')
  const [isFloorPlanChanged, setIsFloorPlanChanged] = useState(false)

  useEffect(() => {
    if (!eventCode) return

    const fetchEvent = async () => {
      try {
        const res = await api.get<EventDetail>(`/events/findOneEvent/${eventCode}`)
        const pocLocationsArray = res.data.floorPlan.pocLoc || []
        setMarkedPoints(pocLocationsArray)
        setFloorPlanImageUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}${res.data.floorPlan.floorPlanImageUrl}`)
      } catch (error) {
        console.error(error)
      }
    }
    fetchEvent()
  }, [eventCode])

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!selectedPoint) {
      alert('Please select a POC first.')
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMarkedPoints((prev) =>
      prev.map((poc) =>
        poc.id.toString() === selectedPoint
          ? { ...poc, x, y }
          : poc
      )
    )
    setIsFloorPlanChanged(true)
  }

  const handleAddPOC = () => {
    const newPOC: PocLocation = {
      id: tempId--,
      name: `POC ${markedPoints.length + 1}`,
      x: 0,
      y: 0,
      floorPlanId : markedPoints[0].floorPlanId
    }
    setMarkedPoints((prev) => [...prev, newPOC])
    setSelectedPoint(newPOC.id.toString())
    setIsFloorPlanChanged(true)
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">POC Locations</Label>
          <Button onClick={handleAddPOC}>Add New POC</Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {markedPoints.map((poc) => (
            <Button
              key={poc.id}
              variant={selectedPoint === poc.id.toString() ? 'default' : 'outline'}
              onClick={() => setSelectedPoint(poc.id.toString())}
            >
              {poc.name}
            </Button>
          ))}
        </div>
      </Card>

      <div className="relative">
        {floorPlanImageUrl && (
          <img
            src={floorPlanImageUrl}
            alt="Floor plan"
            onClick={handleImageClick}
            className="max-h-[600px] object-contain border rounded-md"
          />
        )}
        {floorPlanImageUrl &&
          markedPoints.map((loc) => (
            <div
              key={loc.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full border-2 ${
                selectedPoint === loc.id.toString()
                  ? 'bg-blue-500 border-white'
                  : 'bg-red-500 border-black'
              }`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            />
          ))}
      </div>
    </div>
  )
}

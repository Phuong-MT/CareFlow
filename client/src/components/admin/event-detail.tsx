import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import api from '@/utils/axiosConfig'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { PocLocation, EventDetail } from '@/types/eventTypes'
import {MapPinMinus, Delete  }from 'lucide-react'
interface EventProps {
  eventCode: number
}

let tempId = -1 

export const EventDetailPage = ({ eventCode }: EventProps) => {
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState<string>('')
  const [markedPoints, setMarkedPoints] = useState<PocLocation[]>([])
  const [selectedPoint, setSelectedPoint] = useState<string>('')
  const [isFloorPlanChanged, setIsFloorPlanChanged] = useState(false)
  const [FloorId, setFloorId] = useState<number>(-1)
  const [isFloorPlanImageChanged, setIsFloorPlanImageUrlChanged] = useState(false)
  const [fileImageFloorPlan, setFileImageFloorPlan]  = useState<File>()
  useEffect(() => {
    if (!eventCode) return

    const fetchEvent = async () => {
      try {
        const res = await api.get<EventDetail>(`/events/findOneEvent/${eventCode}`)
        const pocLocationsArray = res.data.floorPlan.pocLocations || []
        setMarkedPoints(pocLocationsArray)
        console.log(markedPoints)
        setFloorId(res.data.floorPlan.id)
        setFloorPlanImageUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}${res.data.floorPlan.floorPlanImageUrl}`)
      } catch (error) {
        console.error(error)
      }
    }
    fetchEvent()
  }, [eventCode,])

  useEffect(() => {
    return () => {
      if (floorPlanImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(floorPlanImageUrl)
      }
    }
  }, [floorPlanImageUrl])

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
      x: 10,
      y: 10,
      floorPlanId : FloorId
    }
    console.log(newPOC.id)
    setMarkedPoints((prev) => [...prev, newPOC])
    setSelectedPoint(newPOC.id.toString())
    setIsFloorPlanChanged(true)
  }

  const handleSaveChanges = async()=>{
    try{
      setSelectedPoint('');
      const payload = {
      floorPlanId: FloorId,
      pocLocations: markedPoints.map(p => ({
        id: p.id > 0 ? p.id : undefined,
        name: p.name,
        x: p.x,
        y: p.y,
        floorPlanId: p.floorPlanId,
      })),
    }
      const res = await api.put(`/floor-plan/${FloorId}/update-pocLoc`,payload)
      if(res.status === 200){
         alert('saveChanges successfully!')
         setIsFloorPlanChanged(false)
      }
    }catch(error){
      console.error('handleSaveChanges '+ error)
      throw error
    }
  }
  const handleUploadImage = async () => {
    if (!fileImageFloorPlan) return

    const formData = new FormData()
    formData.append('floorPlanImage', fileImageFloorPlan)

    try {
      const res = await api.post(`/floor-plan/${eventCode}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if(res.status === 200){   
        alert('Uploaded successfully!')
        setIsFloorPlanImageUrlChanged(false)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload floor plan image.')
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileImageFloorPlan(file)
      setIsFloorPlanImageUrlChanged(true)

      const previewUrl = URL.createObjectURL(file)
      setFloorPlanImageUrl(previewUrl)
    }
  }
  const handleDeletePoc = async(e: PocLocation)=>{
    const updatedPocLocations = markedPoints.filter((poc) => poc.id !== e.id)
      setMarkedPoints(updatedPocLocations)
      if (selectedPoint === e.id.toString()) {
        setSelectedPoint('')
      }
      setIsFloorPlanChanged(true)
  }
  console.log(markedPoints)
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">POC Locations</Label>
          <Button  onClick={handleAddPOC}>Add New POC</Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!isFloorPlanChanged}
          >
            Save Changes
          </Button>
          <Button
            onClick={handleUploadImage}
            disabled={!isFloorPlanImageChanged}
          >
            Upload floor plan image
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {markedPoints.map((poc) => (
            <div key={poc.id} className="flex items-center gap-2">
              <Button
                variant={selectedPoint === poc.id.toString() ? 'default' : 'outline'}
                onClick={() => setSelectedPoint(poc.id.toString())}
              >
                {poc.name}
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDeletePoc(poc)}
              >
                <Delete className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

      </Card>
      
      {/* <div className="flex flex-row gap-2 py-[20px]"> */}
        <div className="relative border rounded-md overflow-hidden max-w-[300] max-h-full">
          {floorPlanImageUrl && (
            <img
              src={floorPlanImageUrl}
              alt="Floor plan"
              onClick={handleImageClick}
              className="w-full h-full object-contain"
            />
          )}
          {floorPlanImageUrl &&
            markedPoints.map((loc) => (
              <div
                key={loc.id}
                className="absolute -translate-x-1/2 -translate-y-full text-center"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <MapPinMinus
                  className={`p-1 rounded-full border-2 ${
                    selectedPoint === loc.id.toString()
                      ? 'bg-blue-500 border-white'
                      : 'bg-red-500 border-black'
                  }`}
                  size={36}
                />
                <div className="text-xs mt-1 bg-white rounded px-1">{loc.name}</div>
              </div>
            ))}
        </div>

        {/* Right: Instruction area */}
        <div className="">
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Upload a floor plan image by clicking the upload area</li>
            <li>Select a check-in point from the sidebar</li>
            <li>Click on the floor plan to mark the location of the selected point</li>
            <li>Click Save Changes when done</li>
          </ul>
        </div>
      {/* </div> */}
        <Button
          onClick={()=>{
            setIsFloorPlanImageUrlChanged(true)
          }}
        >
          Change Floor Plan image
        </Button>
      {isFloorPlanImageChanged && 
     <div>
        <Label htmlFor="floorPlan">Choose floor plan image</Label>
        <Input
          id="floorPlan"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      }
    </div>
  )
}

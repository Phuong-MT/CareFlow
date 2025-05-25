
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosConfig'; 
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/config';
export default function CreateEventPage() {
  const router = useRouter();

  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    locationId: '',
  });

useEffect(() => {
  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations/findAll');
      setLocations(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error);
    }
  };
    fetchLocations();
}, []);
    const tenantCode = useAppSelector(state => state.user?.user?.tenantCode)
    const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  function setDateEndToEndOfDay(dateStr: string): string {
    const date = new Date(dateStr);
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.locationId) {
      alert('Vui lòng chọn địa điểm');
      return;
    }
    const payload = {
        title: formData.title.trim(),
        dateStart: new Date(formData.dateStart).toISOString(),
        dateEnd: setDateEndToEndOfDay(formData.dateEnd),
        tenantCode: tenantCode,
        locationId: Number(formData.locationId),
        description: formData.description.trim() || null,
    };
    const res = await api.post('/events/createEvent', payload);

    if (res.status === 201) {
      alert('Tạo sự kiện thành công!');
      router.push('/admin/events');
    } else {
      alert('Tạo sự kiện thất bại!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo sự kiện mới</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên sự kiện */}
        <div>
          <Label  className="block font-medium" htmlFor="title">Tên sự kiện</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={e => handleInputChange('title', e.target.value)}
            placeholder="Nhập tên sự kiện"
            required
          />
        </div>

        {/* Mô tả */}
        <div>
          <Label  className="block font-medium" htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="Mô tả sự kiện (tuỳ chọn)"
          />
        </div>

        {/* Ngày bắt đầu, kết thúc */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label  className="block font-medium" htmlFor="dateStart">Ngày bắt đầu</Label>
            <Input
              id="dateStart"
              type="date"
              value={formData.dateStart}
              onChange={e => handleInputChange('dateStart', e.target.value)}
              required
            />
          </div>
          <div>
            <Label  className="block font-medium" htmlFor="dateEnd">Ngày kết thúc</Label>
            <Input
              id="dateEnd"
              type="date"
              value={formData.dateEnd}
              onChange={e => handleInputChange('dateEnd', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Chọn địa điểm */}
        <div>
          <Label  className="block font-medium" htmlFor="locationId">Địa điểm</Label>
          <Select
            onValueChange={value => handleInputChange('locationId', value)}
            value={formData.locationId}
            defaultValue=""
          >
            <SelectTrigger id="locationId" className="w-full">
              <SelectValue placeholder="Chọn địa điểm" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(loc => (
                <SelectItem key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Tạo sự kiện
        </Button>
      </form>
    </div>
  );
}

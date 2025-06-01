'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import  api from '@/utils/axiosConfig'

export default function CreateLocationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(form.address ==='' || form.name === '')return
      const res = await api.post('/locations/create',form);

      if (res.status === 200) {
        alert('create location success')
      } else {
        console.error('Create failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-xl font-bold mb-4">Create Location</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

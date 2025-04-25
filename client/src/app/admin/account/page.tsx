'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Settings, User } from 'lucide-react';

export default function ProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    title: 'System Administrator',
    role: 'Administrator',
    createdAt: 'January 15, 2023',
    about:
      'Admin user with full system access. Responsible for managing events, users, and system settings.',
  });

  const activityLog = [
    {
      icon: <CalendarDays className="w-4 h-4 text-muted-foreground" />,
      text: 'Created new event: Tech Conference 2023',
      time: '2 hours ago',
    },
    {
      icon: <Settings className="w-4 h-4 text-muted-foreground" />,
      text: 'Updated system settings',
      time: '1 day ago',
    },
    {
      icon: <User className="w-4 h-4 text-muted-foreground" />,
      text: 'Added new user: John Smith',
      time: '3 days ago',
    },
    {
      icon: <CalendarDays className="w-4 h-4 text-muted-foreground" />,
      text: 'Modified event: AI Workshop',
      time: '4 days ago',
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your profile information
        </p>
      </div>

      {/* Thông tin chính */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src='https://github.com/shadcn.png' alt={userInfo.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{userInfo.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {userInfo.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userInfo.title}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              Edit Profile
            </Button>
          </div>

          <div className="border rounded-md divide-y">
            {[
              ['Full name', userInfo.name],
              ['Job title', userInfo.title],
              ['Email address', userInfo.email],
              ['Role', userInfo.role],
              ['Account created', userInfo.createdAt],
              ['About', userInfo.about],
            ].map(([label, value], idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-4 px-4 py-3 text-sm"
              >
                <div className="font-medium text-muted-foreground">{label}</div>
                <div className="col-span-3">{value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            {activityLog.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="pt-1">{item.icon}</div>
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal chỉnh sửa */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={userInfo.title}
                onChange={(e) => setUserInfo({ ...userInfo, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={userInfo.about}
                onChange={(e) => setUserInfo({ ...userInfo, about: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

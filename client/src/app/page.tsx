'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/ui/ScanQrCode';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CareFlow</h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.push('/login')}>
              Log in
            </Button>
            <Button onClick={() => router.push('/register')}>
              Sign up
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                Smart Queue & Check-in System
              </h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Optimize Patient Flow with Real-Time Insights
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                CareFlow empowers your team with powerful tools to manage queues, track check-ins, and view live analytics — all in real time.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Button onClick={() => router.push('/register/tenant')} className="px-8 py-3">
                  Get Started as Admin
                </Button>
                <Button variant="outline" onClick={() => router.push('/register/poc')} className="px-8 py-3">
                  Register as POC
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        <div>
          <h2 className="text-2xl font-bold text-center my-8">Scan QR Code to Join Queue</h2>
          <QRScanner />
        </div>

        {/* Features section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Core Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Built to Power Modern Event and Queue Management
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {/* Role-based Access */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-medium text-gray-900">Role-based Access Control</h3>
                  <p className="mt-2 text-gray-600">
                    Manage users with distinct roles like Super Admin, Admin, and Point-of-Contact for flexible and secure operations.
                  </p>
                </div>

                {/* Real-time Analytics */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-medium text-gray-900">Real-Time Analytics</h3>
                  <p className="mt-2 text-gray-600">
                    Stay informed with up-to-the-second metrics on queue status, check-ins, and wait times through live dashboards.
                  </p>
                </div>

                {/* Real-time Queue State */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-medium text-gray-900">Live Queue Monitoring</h3>
                  <p className="mt-2 text-gray-600">
                    View and manage the current state of the queue in real time, with tools to reorder, skip, or call the next attendee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CareFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

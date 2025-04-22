// src/components/QueueCheckIn.tsx
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface QueueCheckInProps {
  roomId: string; 
  onCheckIn: (newUser: { name: string; tenantCode: string; eventId: string; locationId: string }) => void;
}

const QueueCheckIn: React.FC<QueueCheckInProps> = ({ roomId, onCheckIn }) => {
  const [userName, setUserName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckIn = () => {
    if (!roomId || !userName) return;

    const [tenantCode, eventId, locationId] = decodeURIComponent(roomId).split(':');
    
    setIsProcessing(true);
    onCheckIn({
      name: userName,
      tenantCode,
      eventId,
      locationId,
    });
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Input
        type="text"
        className="mb-4 w-80"
        placeholder="Enter your name"
        value={userName}
        onChange={(e: any) => setUserName(e.target.value)}
      />
      <Button
        className="w-80 bg-green-600 text-white hover:bg-green-700 transition"
        onClick={handleCheckIn}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'New Queue Check-in'}
      </Button>
    </div>
  );
};

export default QueueCheckIn;

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  roomId: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ roomId }) => {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number>(300);

  const generateQR = () => {
    const [tenantCode, eventId, locationId, pocLocationId] = decodeURIComponent(roomId).split(':');
    const tg = Date.now();
    setTimestamp(tg);
    //console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${tenantCode}:${eventId}:${locationId}:${pocLocationId}?tg=${tg}`);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/events/${tenantCode}:${eventId}:${locationId}:${pocLocationId}?tg=${tg}`;
    setQrValue(url);
    setTimeLeft(300);
};

useEffect(() => {
    generateQR();
    //console.log(qrValue);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setQrValue(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [roomId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {qrValue ? (
        <>
          <QRCodeSVG value={qrValue} size={256} />
          <p className="text-sm text-gray-500">
            QR code sẽ hết hạn sau {timeLeft} giây.
          </p>
          <button
            onClick={generateQR}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset QR
          </button>
        </>
      ) : (
        <>
          <p className="text-red-500">QR code đã hết hạn.</p>
          <button
            onClick={generateQR}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tạo lại QR
          </button>
        </>
      )}
    </div>
  );
};

export default QRGenerator;

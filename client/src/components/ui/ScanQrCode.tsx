"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export enum Html5QrcodeSupportedFormats {
  QR_CODE = 0,
  AZTEC,
  CODABAR,
  CODE_39,
  CODE_93,
  CODE_128,
  DATA_MATRIX,
  MAXICODE,
  ITF,
  EAN_13,
  EAN_8,
  PDF_417,
  RSS_14,
  RSS_EXPANDED,
  UPC_A,
  UPC_E,
  UPC_EAN_EXTENSION,
}
const QRScanner: React.FC = () => {
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    
    const startScanning = async () => {
        if (scanning) return;

    setScanning(true);
    const qrRegionId = "qr-reader";

    html5QrCodeRef.current = new Html5Qrcode( "reader",{ formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ], verbose: false });
    const devices = await Html5Qrcode.getCameras();
    const cameraId = devices[0]?.id;

    if (!cameraId) {
      alert("Không tìm thấy camera");
      return;
    }

    html5QrCodeRef.current.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (decodedText) => {
        console.log("QR code detected:", decodedText);
        await html5QrCodeRef.current?.stop();
        setScanning(false);

        try {
          const url = new URL(decodedText);
          const roomId = url.pathname.split("/").pop()?.split("?")[0];
          const tg = url.searchParams.get("tg");
          const token = localStorage.getItem("token");

          if (!roomId || !tg || !token) throw new Error("Thiếu dữ liệu");

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/events/${roomId}?tg=${tg}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error("QR không hợp lệ");

          router.push(`/admin/events/${roomId}/live`);
        } catch (err) {
          alert("QR không hợp lệ hoặc hết hạn.");
        }
      },
      (errorMessage) => {
        console.warn("QR Scan error", errorMessage);
      }
    );
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && scanning) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={startScanning}
        disabled={scanning}
      >
        {scanning ? "Đang quét..." : "Bắt đầu quét QR"}
      </button>

      {scanning && (
        <div id="qr-reader" style={{ width: 300, height: 300 }} />
      )}

      {scanning && (
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={stopScanning}
        >
          Dừng quét
        </button>
      )}
    </div>
  );
};

export default QRScanner;

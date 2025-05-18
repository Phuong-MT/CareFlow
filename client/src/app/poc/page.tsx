'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/config'
import { getAssignments } from '@/store/pocAssignmentSlide';

export default function PocAssignmentList() {
  const dispatch = useAppDispatch();
  const { dataPocAssignment,status, error } = useAppSelector((state) => state.poc);

  useEffect(() => {
    dispatch(getAssignments());
  }, [dispatch]);

  if (status === 'loading') return <p>Đang tải dữ liệu POC...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách POC Assignment</h2>
      <table className="table-auto w-full border border-collapse border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Event ID</th>
            <th className="border px-4 py-2">Location ID</th>
            <th className="border px-4 py-2">Active</th>
          </tr>
        </thead>
        <tbody>
          {dataPocAssignment.map((poc) => (
            <tr key={poc.id}>
              <td className="border px-4 py-2">{poc.id}</td>
              <td className="border px-4 py-2">{poc.userId}</td>
              <td className="border px-4 py-2">{poc.eventId}</td>
              <td className="border px-4 py-2">{poc.locationId}</td>
              <td className="border px-4 py-2">
                {poc.isActive ? '✅' : '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

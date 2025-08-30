'use client';

import { useState, useEffect } from 'react';

interface QueueEntry {
  id: string;
  phone: string;
  queueNumber: number;
  createdAt: string;
  status: 'waiting' | 'ready' | 'completed' | 'cancelled';
}

export default function AdminPage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/admin/queue');
      const data = await response.json();
      setQueue(data.queue || []);
    } catch (error) {
      console.error('대기열 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQueue = async (queueNumber: number, action: string) => {
    try {
      const response = await fetch('/api/admin/queue', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queueNumber, action }),
      });

      if (response.ok) {
        await fetchQueue();
      } else {
        throw new Error('업데이트 실패');
      }
    } catch (error) {
      console.error('대기열 업데이트 실패:', error);
      alert('업데이트에 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      waiting: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const labels = {
      waiting: '대기중',
      ready: '준비완료',
      completed: '완료',
      cancelled: '취소',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">대기열 관리</h1>
            <button
              onClick={fetchQueue}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              새로고침
            </button>
          </div>

          {queue.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">현재 대기중인 고객이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      대기번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      휴대폰 번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queue.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{entry.queueNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(entry.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.status === 'waiting' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => updateQueue(entry.queueNumber, 'ready')}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              입장준비
                            </button>
                            <button
                              onClick={() => updateQueue(entry.queueNumber, 'cancel')}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              취소
                            </button>
                          </div>
                        )}
                        {entry.status === 'ready' && (
                          <button
                            onClick={() => updateQueue(entry.queueNumber, 'complete')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            완료
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CompleteContent() {
  const searchParams = useSearchParams();
  const queueNumber = searchParams.get('queueNumber');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">대기열 등록 완료!</h1>
          <p className="text-gray-600">카카오톡 알림을 발송했습니다.</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="text-sm text-gray-600 mb-2">대기번호</div>
          <div className="text-3xl font-bold text-blue-600">#{queueNumber || 'N/A'}</div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">예상 대기 시간</span>
            <span className="font-semibold text-gray-900">15-20분</span>
          </div>
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">현재 대기팀</span>
            <span className="font-semibold text-gray-900">{queueNumber ? Math.max(1, parseInt(queueNumber) - 1) : 0}팀</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p className="mb-2">📱 카카오톡으로 순서 알림을 보내드립니다.</p>
          <p>입장 준비가 되면 알림을 받으실 수 있습니다.</p>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            처음으로
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            상태 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
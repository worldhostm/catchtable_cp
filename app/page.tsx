'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsentPage() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (agreed) {
      router.push('/phone');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">캐치테이블</h1>
          <p className="text-gray-600">식당 대기열 예약 서비스</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">개인정보 수집 및 이용 동의</h2>
          
          <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-40 overflow-y-auto text-sm text-gray-700">
            <p className="mb-2"><strong>수집하는 개인정보 항목:</strong></p>
            <p className="mb-2">- 휴대폰 번호</p>
            
            <p className="mb-2"><strong>개인정보의 수집 및 이용목적:</strong></p>
            <p className="mb-2">- 대기열 등록 및 관리</p>
            <p className="mb-2">- 카카오톡 알림 서비스 제공</p>
            
            <p className="mb-2"><strong>개인정보의 보유 및 이용기간:</strong></p>
            <p>- 대기열 서비스 이용 완료 후 즉시 삭제</p>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!agreed}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            agreed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

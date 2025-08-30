'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PhonePage() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!validatePhone(phone)) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/complete?queueNumber=${data.queueNumber}`);
      } else {
        throw new Error('대기열 등록에 실패했습니다.');
      }
    } catch (error) {
      alert('대기열 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">대기열 등록</h1>
          <p className="text-gray-600">휴대폰 번호를 입력해주세요</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴대폰 번호
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            maxLength={13}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <p className="mt-2 text-sm text-gray-500">
            카카오톡 알림을 받을 휴대폰 번호를 입력해주세요.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            이전
          </button>
          <button
            onClick={handleSubmit}
            disabled={!validatePhone(phone) || isLoading}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              validatePhone(phone) && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '등록 중...' : '대기열 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FindIdPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    return formData.name.trim().length >= 2 && /^010-\d{4}-\d{4}$/.test(formData.phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/find-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setResult(result.username);
      } else {
        alert(result.message || '아이디를 찾을 수 없습니다.');
      }
    } catch (error) {
      alert('아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">아이디 찾기</h1>
          <p className="text-gray-600">이름과 휴대폰 번호로 아이디를 찾아드립니다</p>
        </div>

        {result ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">아이디를 찾았습니다!</h3>
              <p className="text-green-700 text-lg font-semibold">{result}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                로그인하러 가기
              </button>
              <button
                onClick={() => router.push('/reset-password')}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium transition-colors"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="이름을 입력해주세요"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                휴대폰 번호
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="010-0000-0000"
                maxLength={13}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!validateForm() || isLoading}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                validateForm() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? '찾는 중...' : '아이디 찾기'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
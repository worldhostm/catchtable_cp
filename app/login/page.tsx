'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    return formData.username.trim() !== '' && formData.password.trim() !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('로그인이 완료되었습니다.');
        router.push('/');
      } else {
        alert(result.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-600">캐치테이블에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="아이디를 입력해주세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="비밀번호를 입력해주세요"
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
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 flex justify-center space-x-4 text-sm">
          <button
            onClick={() => router.push('/find-id')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            아이디 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => router.push('/reset-password')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/signup')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            계정이 없으신가요? 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
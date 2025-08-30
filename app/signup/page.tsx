'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SignupStep = 'name' | 'username' | 'phone' | 'email' | 'password';

interface SignupData {
  name: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('name');
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

  const validateStep = (step: SignupStep): boolean => {
    switch (step) {
      case 'name':
        return signupData.name.trim().length >= 2;
      case 'username':
        return signupData.username.trim().length >= 3;
      case 'phone':
        return /^010-\d{4}-\d{4}$/.test(signupData.phone);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email);
      case 'password':
        return signupData.password.length >= 6 && signupData.password === signupData.confirmPassword;
      default:
        return false;
    }
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const steps: SignupStep[] = ['name', 'username', 'phone', 'email', 'password'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    const steps: SignupStep[] = ['name', 'username', 'phone', 'email', 'password'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          username: signupData.username,
          phone: signupData.phone,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        router.push('/login');
      } else {
        alert(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={signupData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              실명을 입력해주세요 (최소 2자)
            </p>
          </div>
        );

      case 'username':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              value={signupData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="아이디를 입력해주세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              영문, 숫자 조합 3자 이상
            </p>
          </div>
        );

      case 'phone':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴대폰 번호
            </label>
            <input
              type="tel"
              value={signupData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              '-'를 포함한 휴대폰 번호를 입력해주세요
            </p>
          </div>
        );

      case 'email':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@email.com"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              유효한 이메일 주소를 입력해주세요
            </p>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <p className="text-sm text-gray-500">
              비밀번호는 6자 이상이어야 합니다
            </p>
            {signupData.password && signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
              <p className="text-sm text-red-500">
                비밀번호가 일치하지 않습니다
              </p>
            )}
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'name': return '이름을 입력해주세요';
      case 'username': return '아이디를 입력해주세요';
      case 'phone': return '휴대폰 번호를 입력해주세요';
      case 'email': return '이메일을 입력해주세요';
      case 'password': return '비밀번호를 설정해주세요';
    }
  };

  const getCurrentStepNumber = () => {
    const steps: SignupStep[] = ['name', 'username', 'phone', 'email', 'password'];
    return steps.indexOf(currentStep) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">{getStepTitle()}</p>
          <div className="mt-4 flex justify-center">
            <span className="text-sm text-gray-500">
              {getCurrentStepNumber()}/5 단계
            </span>
          </div>
        </div>

        <div className="mb-6">
          {renderStepContent()}
        </div>

        <div className="flex space-x-3">
          {currentStep !== 'name' && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!validateStep(currentStep) || isLoading}
            className={`${currentStep === 'name' ? 'w-full' : 'flex-1'} py-3 px-4 rounded-md font-medium transition-colors ${
              validateStep(currentStep) && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '처리 중...' : (currentStep === 'password' ? '회원가입' : '다음')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
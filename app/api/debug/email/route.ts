import { NextRequest, NextResponse } from 'next/server';
import { getResendEmailService } from '@/lib/email/resendService';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Email Debug Info:');
    
    // 환경 변수 체크
    const envCheck = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : '❌ Missing',
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || '❌ Using default: onboarding@resend.dev',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '❌ Using default: http://localhost:3000'
    };

    console.log('📊 Environment Variables:', envCheck);

    // Resend 연결 테스트
    let connectionTest = null;
    try {
      const emailService = getResendEmailService();
      connectionTest = await emailService.verifyConnection();
      console.log('🔌 Connection test result:', connectionTest);
    } catch (error) {
      connectionTest = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
      console.log('❌ Connection test failed:', connectionTest);
    }

    return NextResponse.json({
      success: true,
      debug: {
        environment: envCheck,
        connection: connectionTest,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          environment: {
            RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Present' : '❌ Missing',
            RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || '❌ Missing'
          }
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email address is required for testing' },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing email send to: ${email}`);

    const emailService = getResendEmailService();
    
    // 간단한 테스트 이메일 발송
    const result = await emailService.testEmail(email);
    
    console.log('📨 Test email result:', result);

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `테스트 이메일이 ${email}로 발송되었습니다.`
        : `테스트 이메일 발송 실패: ${result.error}`,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json(
      { 
        success: false,
        message: '테스트 이메일 발송 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
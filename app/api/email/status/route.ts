import { NextRequest, NextResponse } from 'next/server';
import { getResendEmailService } from '@/lib/email/resendService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { message: 'Message ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const emailService = getResendEmailService();
    
    // Resend API를 통해 이메일 상태 확인
    const result = await emailService.resend.emails.get(messageId);

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Email status check failed:', error);
    return NextResponse.json(
      { 
        message: '이메일 상태 확인에 실패했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const emailService = getResendEmailService();
    
    // 최근 이메일 목록 조회
    const emails = await emailService.resend.emails.list();

    return NextResponse.json({
      success: true,
      data: emails.data
    });
  } catch (error) {
    console.error('Email list fetch failed:', error);
    return NextResponse.json(
      { 
        message: '이메일 목록 조회에 실패했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getResendEmailService } from '@/lib/email/resendService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: '이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    const emailService = getResendEmailService();
    const result = await emailService.testEmail(email);

    if (result.success) {
      return NextResponse.json({
        message: '테스트 이메일이 발송되었습니다.',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { message: `이메일 발송 실패: ${result.error}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { message: '테스트 이메일 발송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
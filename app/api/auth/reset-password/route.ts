import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userService } from '@/lib/db/userService';
import { getResendEmailService } from '@/lib/email/resendService';

function generateTempPassword(length: number = 8): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { message: '아이디와 이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const user = await userService.getUserByUsernameAndEmail(username, email);

    if (!user) {
      return NextResponse.json(
        { message: '일치하는 사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const tempPassword = generateTempPassword();
    const hashedTempPassword = await bcrypt.hash(tempPassword, 12);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await userService.createTempPassword(user.id, hashedTempPassword, expiresAt);
    await userService.updateUserPassword(user.id, hashedTempPassword);

    const emailService = getResendEmailService();
    const emailResult = await emailService.sendTempPassword(email, username, tempPassword);

    if (!emailResult.success) {
      return NextResponse.json(
        { message: '이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: '임시 비밀번호가 이메일로 발송되었습니다.',
        messageId: emailResult.messageId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: '비밀번호 초기화 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
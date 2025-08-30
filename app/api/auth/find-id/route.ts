import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db/userService';

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { message: '이름과 휴대폰 번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!/^010-\d{4}-\d{4}$/.test(phone)) {
      return NextResponse.json(
        { message: '올바른 휴대폰 번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const user = await userService.getUserByNameAndPhone(name, phone);

    if (!user) {
      return NextResponse.json(
        { message: '일치하는 사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const maskedUsername = user.username.length > 3 
      ? user.username.substring(0, 3) + '*'.repeat(user.username.length - 3)
      : user.username.substring(0, 1) + '*'.repeat(user.username.length - 1);

    return NextResponse.json(
      { 
        username: maskedUsername,
        message: '아이디를 찾았습니다.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Find ID error:', error);
    return NextResponse.json(
      { message: '아이디 찾기 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
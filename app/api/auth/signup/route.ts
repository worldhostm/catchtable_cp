import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userService } from '@/lib/db/userService';

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, phone, email } = await request.json();

    if (!username || !password || !name || !phone || !email) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!/^010-\d{4}-\d{4}$/.test(phone)) {
      return NextResponse.json(
        { message: '올바른 휴대폰 번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { message: '이미 존재하는 아이디입니다.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await userService.createUser({
      username,
      password: hashedPassword,
      name,
      phone,
      email
    });

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
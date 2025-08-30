import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { userService } from '@/lib/db/userService';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const user = await userService.getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 잘못되었습니다.' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 잘못되었습니다.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { 
        message: '로그인이 완료되었습니다.',
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

    response.cookies.set('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
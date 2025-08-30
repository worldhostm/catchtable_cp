import { NextRequest, NextResponse } from 'next/server';
import { KakaoNotificationService } from '@/lib/kakao';

interface QueueEntry {
  id: string;
  phone: string;
  queueNumber: number;
  createdAt: Date;
  status: 'waiting' | 'ready' | 'completed' | 'cancelled';
}

let queueStorage: QueueEntry[] = [];
let currentQueueNumber = 1;

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !phone.match(/^010-\d{4}-\d{4}$/)) {
      return NextResponse.json(
        { error: '올바른 휴대폰 번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const existingEntry = queueStorage.find(
      entry => entry.phone === phone && entry.status === 'waiting'
    );

    if (existingEntry) {
      return NextResponse.json(
        { error: '이미 대기열에 등록된 번호입니다.' },
        { status: 409 }
      );
    }

    const queueEntry: QueueEntry = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      phone,
      queueNumber: currentQueueNumber++,
      createdAt: new Date(),
      status: 'waiting'
    };

    queueStorage.push(queueEntry);

    const kakaoService = new KakaoNotificationService();
    const notificationSent = await kakaoService.sendQueueNotification(
      phone,
      queueEntry.queueNumber
    );

    return NextResponse.json({
      success: true,
      queueNumber: queueEntry.queueNumber,
      id: queueEntry.id,
      notificationSent,
      message: '대기열에 등록되었습니다.'
    });

  } catch (error) {
    console.error('대기열 등록 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    totalQueue: queueStorage.filter(entry => entry.status === 'waiting').length,
    currentNumber: Math.max(0, currentQueueNumber - 1)
  });
}
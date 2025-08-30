import { NextRequest, NextResponse } from 'next/server';
import { KakaoNotificationService } from '@/lib/kakao';

interface QueueEntry {
  id: string;
  phone: string;
  queueNumber: number;
  createdAt: Date;
  status: 'waiting' | 'ready' | 'completed' | 'cancelled';
}

declare global {
  var queueStorage: QueueEntry[] | undefined;
}

export async function GET() {
  try {
    global.queueStorage = global.queueStorage || [];
    
    const waitingQueue = global.queueStorage
      .filter(entry => entry.status === 'waiting')
      .sort((a, b) => a.queueNumber - b.queueNumber);

    return NextResponse.json({
      queue: waitingQueue,
      total: waitingQueue.length
    });

  } catch (error) {
    console.error('대기열 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { queueNumber, action } = await request.json();

    if (!queueNumber || !action) {
      return NextResponse.json(
        { error: '대기번호와 액션이 필요합니다.' },
        { status: 400 }
      );
    }

    global.queueStorage = global.queueStorage || [];
    
    const queueEntry = global.queueStorage.find(
      entry => entry.queueNumber === queueNumber
    );

    if (!queueEntry) {
      return NextResponse.json(
        { error: '대기열 항목을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const kakaoService = new KakaoNotificationService();
    let notificationSent = false;

    switch (action) {
      case 'ready':
        queueEntry.status = 'ready';
        notificationSent = await kakaoService.sendReadyNotification(
          queueEntry.phone,
          queueEntry.queueNumber
        );
        break;
      
      case 'complete':
        queueEntry.status = 'completed';
        break;
      
      case 'cancel':
        queueEntry.status = 'cancelled';
        notificationSent = await kakaoService.sendSimpleNotification(
          queueEntry.phone,
          `대기가 취소되었습니다. (대기번호: #${queueEntry.queueNumber})`
        );
        break;
      
      default:
        return NextResponse.json(
          { error: '유효하지 않은 액션입니다.' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      queueNumber: queueEntry.queueNumber,
      status: queueEntry.status,
      notificationSent
    });

  } catch (error) {
    console.error('대기열 업데이트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
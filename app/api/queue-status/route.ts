import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queueNumber = searchParams.get('queueNumber');
    const phone = searchParams.get('phone');

    if (!queueNumber && !phone) {
      return NextResponse.json(
        { error: '대기번호 또는 휴대폰 번호가 필요합니다.' },
        { status: 400 }
      );
    }

    global.queueStorage = global.queueStorage || [];
    
    let queueEntry;
    
    if (queueNumber) {
      queueEntry = global.queueStorage.find(
        entry => entry.queueNumber === parseInt(queueNumber)
      );
    } else if (phone) {
      queueEntry = global.queueStorage.find(
        entry => entry.phone === phone && entry.status !== 'completed'
      );
    }

    if (!queueEntry) {
      return NextResponse.json(
        { error: '대기열 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const waitingAhead = global.queueStorage.filter(
      entry => entry.status === 'waiting' && entry.queueNumber < queueEntry.queueNumber
    ).length;

    const estimatedWaitTime = Math.max(5, waitingAhead * 15);

    return NextResponse.json({
      queueNumber: queueEntry.queueNumber,
      status: queueEntry.status,
      waitingAhead,
      estimatedWaitTime,
      createdAt: queueEntry.createdAt
    });

  } catch (error) {
    console.error('대기열 상태 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
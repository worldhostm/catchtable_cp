interface KakaoMessageTemplate {
  object_type: string;
  text: string;
  link?: {
    web_url?: string;
    mobile_web_url?: string;
  };
  button_title?: string;
}

interface KakaoNotificationRequest {
  receiver_uuids: string[];
  template_object: KakaoMessageTemplate;
}

export class KakaoNotificationService {
  private appKey: string;
  private adminKey: string;

  constructor() {
    this.appKey = process.env.KAKAO_APP_KEY || '';
    this.adminKey = process.env.KAKAO_ADMIN_KEY || '';
  }

  async sendQueueNotification(phoneNumber: string, queueNumber: number): Promise<boolean> {
    try {
      const template: KakaoMessageTemplate = {
        object_type: 'text',
        text: `🍽️ 캐치테이블 대기열 등록완료\n\n대기번호: #${queueNumber}\n예상 대기시간: 15-20분\n\n입장 순서가 되면 다시 알림을 보내드립니다.`,
        link: {
          web_url: `${process.env.NEXT_PUBLIC_APP_URL}/complete?queueNumber=${queueNumber}`,
          mobile_web_url: `${process.env.NEXT_PUBLIC_APP_URL}/complete?queueNumber=${queueNumber}`
        },
        button_title: '상태 확인'
      };

      const uuid = await this.getUuidByPhoneNumber(phoneNumber);
      if (!uuid) {
        throw new Error('사용자 UUID를 찾을 수 없습니다.');
      }

      const response = await fetch('https://kapi.kakao.com/v1/api/talk/friends/message/default/send', {
        method: 'POST',
        headers: {
          'Authorization': `KakaoAK ${this.adminKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          receiver_uuids: JSON.stringify([uuid]),
          template_object: JSON.stringify(template)
        })
      });

      return response.ok;
    } catch (error) {
      console.error('카카오톡 알림 전송 실패:', error);
      return false;
    }
  }

  async sendReadyNotification(phoneNumber: string, queueNumber: number): Promise<boolean> {
    try {
      const template: KakaoMessageTemplate = {
        object_type: 'text',
        text: `🔔 입장 준비 완료!\n\n대기번호: #${queueNumber}\n5분 이내에 매장으로 와주세요.\n\n늦으시면 대기가 취소될 수 있습니다.`,
        link: {
          web_url: `${process.env.NEXT_PUBLIC_APP_URL}/complete?queueNumber=${queueNumber}`,
          mobile_web_url: `${process.env.NEXT_PUBLIC_APP_URL}/complete?queueNumber=${queueNumber}`
        },
        button_title: '확인'
      };

      const uuid = await this.getUuidByPhoneNumber(phoneNumber);
      if (!uuid) {
        throw new Error('사용자 UUID를 찾을 수 없습니다.');
      }

      const response = await fetch('https://kapi.kakao.com/v1/api/talk/friends/message/default/send', {
        method: 'POST',
        headers: {
          'Authorization': `KakaoAK ${this.adminKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          receiver_uuids: JSON.stringify([uuid]),
          template_object: JSON.stringify(template)
        })
      });

      return response.ok;
    } catch (error) {
      console.error('입장 준비 알림 전송 실패:', error);
      return false;
    }
  }

  private async getUuidByPhoneNumber(phoneNumber: string): Promise<string | null> {
    try {
      const response = await fetch('https://kapi.kakao.com/v1/api/talk/friends', {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${this.adminKey}`,
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const friend = data.elements?.find((friend: any) => 
        friend.phone_number === phoneNumber.replace(/-/g, '')
      );

      return friend?.uuid || null;
    } catch (error) {
      console.error('UUID 조회 실패:', error);
      return null;
    }
  }

  async sendSimpleNotification(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const template: KakaoMessageTemplate = {
        object_type: 'text',
        text: message
      };

      const uuid = await this.getUuidByPhoneNumber(phoneNumber);
      if (!uuid) {
        console.log('개발 모드: 카카오톡 알림을 시뮬레이션합니다.');
        console.log(`받는사람: ${phoneNumber}`);
        console.log(`메시지: ${message}`);
        return true;
      }

      const response = await fetch('https://kapi.kakao.com/v1/api/talk/friends/message/default/send', {
        method: 'POST',
        headers: {
          'Authorization': `KakaoAK ${this.adminKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          receiver_uuids: JSON.stringify([uuid]),
          template_object: JSON.stringify(template)
        })
      });

      return response.ok;
    } catch (error) {
      console.error('카카오톡 메시지 전송 실패:', error);
      console.log('개발 모드: 카카오톡 알림을 시뮬레이션합니다.');
      console.log(`받는사람: ${phoneNumber}`);
      console.log(`메시지: ${message}`);
      return true;
    }
  }
}
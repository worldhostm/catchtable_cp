import { Resend } from 'resend';
import { render } from '@react-email/render';
import TempPasswordEmail from './templates/TempPasswordEmail';

class ResendEmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required');
    }
    this.resend = new Resend(apiKey);
  }

  async sendTempPassword(email: string, username: string, tempPassword: string) {
    console.log('🚀 Starting temp password email send...');
    console.log('📧 Sending to:', email);
    
    return await this.sendEmail({
      to: email,
      subject: '[캐치테이블] 임시 비밀번호 발급',
      template: 'tempPassword',
      data: { username, tempPassword }
    });
  }

  private async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }) {
    try {
      console.log('📨 Sending email via Resend API...');
      console.log('📊 Email options:', {
        to: options.to,
        subject: options.subject,
        template: options.template,
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      let emailHtml = '';
      let emailText = '';

      if (options.template === 'tempPassword') {
        const { username, tempPassword } = options.data;
        
        console.log('🎨 Rendering temp password template...');
        emailHtml = await render(
          TempPasswordEmail({
            username,
            tempPassword,
            appUrl,
          })
        );

        emailText = `
캐치테이블 임시 비밀번호 발급

안녕하세요, ${username}님!
요청하신 임시 비밀번호를 발급해드립니다.

임시 비밀번호: ${tempPassword}

보안 안내:
- 임시 비밀번호는 24시간 후 만료됩니다
- 로그인 후 반드시 비밀번호를 변경해주세요
- 본인이 요청하지 않았다면 즉시 고객센터로 연락해주세요

로그인 페이지: ${appUrl}/login
        `.trim();
      }

      console.log('📤 Calling Resend API...');
      const result = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: [options.to],
        subject: options.subject,
        html: emailHtml,
        text: emailText,
      });

      console.log('✅ Email sent successfully!');
      console.log('📊 Send result:', {
        id: result.data?.id,
        status: result.data ? 'sent' : 'unknown',
        fullResult: result
      });

      return { 
        success: true, 
        messageId: result.data?.id,
        result: result.data
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.error('📊 Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async verifyConnection() {
    try {
      const domains = await this.resend.domains.list();
      return { success: true, domains };
    } catch (error) {
      console.error('Resend connection verification failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testEmail(toEmail: string) {
    try {
      const result = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: [toEmail],
        subject: '[캐치테이블] 테스트 이메일',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">캐치테이블</h1>
            <p>이메일 설정이 정상적으로 작동합니다!</p>
            <p>이 테스트 이메일을 받으셨다면 Resend 설정이 완료되었습니다.</p>
          </div>
        `,
        text: '캐치테이블 테스트 이메일입니다. 이메일 설정이 정상적으로 작동합니다!',
      });

      return { 
        success: true, 
        messageId: result.data?.id,
        result 
      };
    } catch (error) {
      console.error('Test email failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

let resendEmailService: ResendEmailService | null = null;

export function getResendEmailService() {
  if (!resendEmailService) {
    resendEmailService = new ResendEmailService();
  }
  return resendEmailService;
}

export default ResendEmailService;
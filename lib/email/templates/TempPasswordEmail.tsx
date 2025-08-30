import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
  Body,
} from '@react-email/components';
import * as React from 'react';

interface TempPasswordEmailProps {
  username: string;
  tempPassword: string;
  appUrl: string;
}

export const TempPasswordEmail = ({
  username,
  tempPassword,
  appUrl = 'http://localhost:3000',
}: TempPasswordEmailProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>캐치테이블 임시 비밀번호가 발급되었습니다</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={logo}>캐치테이블</Heading>
            <Text style={subtitle}>식당 대기열 예약 서비스</Text>
          </Section>

          <Section style={section}>
            <Heading style={heading}>임시 비밀번호가 발급되었습니다</Heading>
            <Text style={paragraph}>
              안녕하세요, <strong>{username}</strong>님!
            </Text>
            <Text style={paragraph}>
              요청하신 임시 비밀번호를 발급해드립니다.
            </Text>

            <Section style={passwordContainer}>
              <Text style={passwordLabel}>임시 비밀번호:</Text>
              <Text style={passwordText}>{tempPassword}</Text>
            </Section>

            <Section style={warningContainer}>
              <Text style={warningTitle}>보안 안내:</Text>
              <Text style={warningText}>
                • 임시 비밀번호는 24시간 후 만료됩니다
                <br />
                • 로그인 후 반드시 비밀번호를 변경해주세요
                <br />
                • 본인이 요청하지 않았다면 즉시 고객센터로 연락해주세요
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={`${appUrl}/login`}>
                로그인하기
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              본 메일은 발신전용 메일입니다. 문의사항이 있으시면 고객센터를 이용해주세요.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

TempPasswordEmail.PreviewProps = {
  username: '홍길동',
  tempPassword: 'Temp1234',
  appUrl: 'http://localhost:3000',
} as TempPasswordEmailProps;

export default TempPasswordEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const logo = {
  color: '#2563eb',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '10px 0 0 0',
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const heading = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 10px 0',
};

const passwordContainer = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
  border: 'solid 4px #2563eb',
};

const passwordLabel = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
};

const passwordText = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  margin: '0',
};

const warningContainer = {
  backgroundColor: '#fef3cd',
  padding: '15px',
  borderRadius: '6px',
  margin: '20px 0',
  textAlign: 'left' as const,
};

const warningTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid #e5e7eb',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};
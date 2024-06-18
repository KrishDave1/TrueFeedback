/** @format */

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
  Img,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang='en' dir='ltr'>
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily='Roboto'
          fallbackFontFamily='Verdana'
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle='normal'
        />
        <style>
          {`
            body {
              background-color: #f4f4f7;
              color: #51545e;
              font-family: 'Roboto', Verdana, sans-serif;
              margin: 0;
              padding: 0;
            }
            .email-container {
              background-color: #ffffff;
              border: 1px solid #eaeaec;
              border-radius: 8px;
              margin: 40px auto;
              max-width: 600px;
              padding: 20px;
            }
            .header {
              background-color: #6c63ff;
              border-radius: 8px 8px 0 0;
              padding: 20px;
              text-align: center;
            }
            .header img {
              max-width: 100px;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
            }
            .content {
              padding: 20px;
            }
            .content h2 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .content p {
              line-height: 1.6;
              margin: 0 0 10px;
            }
            .otp {
              background-color: #f4f4f7;
              border-radius: 4px;
              display: inline-block;
              font-size: 20px;
              font-weight: bold;
              margin: 20px 0;
              padding: 10px 20px;
            }
            .footer {
              border-top: 1px solid #eaeaec;
              padding: 20px;
              text-align: center;
            }
            .button {
              background-color: #6c63ff;
              border: none;
              border-radius: 4px;
              color: #ffffff;
              display: inline-block;
              font-size: 16px;
              padding: 10px 20px;
              text-decoration: none;
            }
          `}
        </style>
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Container className='email-container'>
        <Section className='header'>
          <Img src='https://example.com/logo.png' alt='Company Logo' />
          <Heading as='h1'>Welcome to Mystery Message</Heading>
        </Section>
        <Section className='content'>
          <Heading as='h2'>Hello {username},</Heading>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
          <Text className='otp'>{otp}</Text>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
          <Button href={`http://localhost:3000/verify/${username}`} className='button'>
            Verify here
          </Button>
        </Section>
        <Section className='footer'>
          <Text>
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

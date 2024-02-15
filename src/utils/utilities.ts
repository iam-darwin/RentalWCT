import dotEnv from "dotenv";

dotEnv.config();

export const utils = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET as string,
  accountSid: process.env.TWILIO_ID as string,
  authToken: process.env.TWILIO_AUTH as string,
  fromNumber: process.env.FROM_NUMBER as string,
  toNumber: process.env.toNumber as string,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPwd: process.env.SMTP_PWD as string,
  smtpHost: process.env.SMTP_HOST as string,
  forgotPwd: process.env.FORGOT_PWD as string,
  fromEmail: process.env.FROM_EMAIL as string,
  accessKey: process.env.ACCESS_KEY as string,
  secretKey: process.env.SECRET_KEY as string,
  awsRegion: process.env.AWS_SES_REGION as string,
  bucket: process.env.S3_BUCKET as string,
  adminURL: process.env.ADMIN_FORGOT_PWD as string,
  driverURL: process.env.DRIVER_FORGOT_PWD as string,
  twilioMessageId: process.env.TWILIO_MESSAGE_ID as string,
};

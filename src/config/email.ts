import * as nodemailer from 'nodemailer';
import { utils } from '../utils/utilities';

const smtpConfig = {
  host: utils.smtpHost,
  port: 465, // use your SMTP server port
  secure: true, // true for 465, false for other ports
  auth: {
    user: utils.smtpUsername,
    pass: utils.smtpPwd,
  },
};


export const transporter = nodemailer.createTransport(smtpConfig);
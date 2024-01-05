import aws, { Credentials } from 'aws-sdk';
import { utils } from '../utils/utilities';

const credentials: Credentials = new aws.Credentials({
  accessKeyId: utils.accessKey,
  secretAccessKey: utils.secretKey,
});

export const s3 = new aws.S3({
  region: utils.awsRegion,
  credentials,
});
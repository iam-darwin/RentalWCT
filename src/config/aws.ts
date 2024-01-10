import {  S3Client } from "@aws-sdk/client-s3";
import { utils } from '../utils/utilities';


export const client = new S3Client({
  credentials: {
    accessKeyId: utils.accessKey,
    secretAccessKey: utils.secretKey,
  },
  region: utils.awsRegion, 
});

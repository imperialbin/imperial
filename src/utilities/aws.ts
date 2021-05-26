import { S3, SES } from "aws-sdk";
import { Consts } from "./consts";

export const s3 = new S3({
  region: Consts.AWS_REGION,
  accessKeyId: Consts.AWS_ACCESS,
  secretAccessKey: Consts.AWS_SECRET,
});

export const ses = new SES({
  region: Consts.AWS_REGION,
  accessKeyId: Consts.AWS_ACCESS,
  secretAccessKey: Consts.AWS_SECRET,
});

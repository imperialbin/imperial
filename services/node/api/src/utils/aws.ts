import { S3 as S3Client, SES as SESClient } from "aws-sdk";
import { env } from "./env";
import { Logger } from "./logger";

const s3 = new S3Client({
  region: env.AWS_REGION,

  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
});

const ses = new SESClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

class S3 {
  public static async uploadFile(
    key: string,
    body: string | Buffer,
    contentType: string
  ) {
    const uploadRequest = await s3
      .upload({
        Bucket: "imperial",
        Key: key,
        Body: body,
        ContentType: contentType,
      })
      .promise();

    Logger.success("S3", `Uploaded ${key} to S3`);

    return uploadRequest;
  }
}

export { S3 };

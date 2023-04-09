import { S3 as S3Client, SES as SESClient } from "aws-sdk";

import { env } from "./env";
import { Logger } from "./logger";
import { render } from "@react-email/render";
import { EmailProps, Emails } from "./emails/emails";
import ConfirmEmail from "./emails/confirm_email";
import ResetPassword from "./emails/reset_password";
import NewLogin from "./emails/new_login";
import { FunctionComponent } from "react";

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

const EMAILS = {
  confirm_email: ConfirmEmail,
  new_login: NewLogin,
  reset_password: ResetPassword,
};

class SES {
  public static async sendEmail<T extends Emails>(
    email: T,
    data: EmailProps[T],
    to: string,
    title: string,
  ) {
    const Element = (EMAILS[email] as FunctionComponent<EmailProps[T]>)(
      data,
    ) as JSX.Element;

    const html = render(Element);
    return ses
      .sendEmail({
        Source: env.AWS_SES_FROM,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: html,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: title,
          },
        },
      })
      .promise()
      .catch((err) => {
        Logger.error("SES", `Error sending email ${String(err)}`);
      });
  }
}

class S3 {
  public static async uploadFile(
    key: string,
    body: string | Buffer,
    contentType: string,
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

export { S3, SES };

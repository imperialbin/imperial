import aws from "aws-sdk";

// ENV stuff
const region = process.env.SES_REGION,
  accessKeyId = process.env.SES_ACCESS,
  secretAccessKey = process.env.SES_SECRET;

export const ses = new aws.SES({
  region,
  accessKeyId,
  secretAccessKey,
});

/**
 * @param  {string} to
 * @param  {string} subject
 * @param  {string} html
 * @returns Promise
 */
export const mail = (
  to: string,
  subject: string,
  html: string
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      ses
        .sendEmail({
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Body: {
              Html: { Charset: "UTF-8", Data: html },
            },
            Subject: { Charset: "UTF-8", Data: subject },
          },
          Source: "IMPERIAL | Contact <noreply@imperialb.in>",
        })
        .promise();
      return resolve("Successfully emailed user!");
    } catch (err) {
      return reject("An error occurred while emailing user!");
    }
  });
};

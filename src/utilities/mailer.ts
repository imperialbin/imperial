// @ts-ignore uwu
import nodeMailer from "nodemailer";

// ENV stuff
const HOST = process.env.EMAIL_HOST,
  PORT = process.env.EMAIL_PORT,
  USER = process.env.EMAIL_USER,
  PASS = process.env.EMAIL_PASS;

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
  // Emailing settings
  const transporter = nodeMailer.createTransport({
    host: HOST,
    port: PORT,
    secure: true,
    auth: {
      user: USER,
      pass: PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"IMPERIAL | Contact" <${USER}>`,
    to,
    subject,
    html,
  };

  // Return a promise to email the user
  return new Promise<string>((resolve, reject) => {
    transporter.sendMail(mailOptions, async (err: string) => {
      if (err) {
        console.log(err);
        return reject("An error has occurred whilst emailing");
      }
      resolve("Successfully emailed user!");
    });
  });
};

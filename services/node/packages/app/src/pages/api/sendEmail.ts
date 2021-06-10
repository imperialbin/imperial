import { HttpException, api } from "../../util/api";
import { sendEmail } from "../../util/sendEmail";

export interface HelloResponseType {
  email: string;
}

export default api(async (req, res) => {
  if (Math.random() > 0.7) {
    throw new HttpException(400, "This was intentionally thrown!");
  }

  sendEmail("NewLogin", "hello@looskie.com", "{ }");

  res.json({
    email: "Sent an email to hello@looskie.com!",
  });
});

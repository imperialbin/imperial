import { InferModel } from "drizzle-orm";
import { devices } from "../../db/schemas";

export type EmailProps = {
  confirm_email: {
    token: string;
  };
  new_login: {
    userAgent: {
      ip: string;
      user_agent: string;
    };
  };
  reset_password: {
    token: string;
  };
};

type Emails = keyof EmailProps;

export { EmailProps, Emails };

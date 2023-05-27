type EmailProps = {
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
  order_refunded: {
    receipt_url: string;
    amount_refunded: number;
  };
  payment_success: {
    token: string;
    receipt_url: string;
  };
  payment_failed: {};
};

type Emails = keyof EmailProps;

export type { EmailProps, Emails };

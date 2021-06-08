import { sendMessage } from "./rabbitmq";

export const sendEmail = (template: string, to: string, data: string) => {
  const body = {
    template,
    to,
    data,
  };

  sendMessage(
    {
      exchangeName: "emails",
      routingKey: "emails",
    },
    body
  );

  console.log(body);
};

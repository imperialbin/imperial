import {sendMessage} from './rabbitmq';

export const sendEmail = (template: string, to: string, data: string) => {
  void sendMessage(
    {exchangeName: 'emails', routingKey: 'emails'},
    JSON.stringify({
      template,
      to,
      data,
    })
  );
};

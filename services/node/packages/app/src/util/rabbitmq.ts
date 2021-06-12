import rabbit from 'rabbitode';
import {TOPIC} from 'rabbitode/lib/exchangeTypes';
import {RABBITMQ_URI} from './constants';

interface messageConfig {
  exchangeName: string;
  routingKey: string;
}

export const sendMessage = async (config: messageConfig, message: string | Buffer) => {
  return rabbit.sendMessage({
    messageConfig: {
      exchangeName: config.exchangeName,
      routingKey: config.routingKey,
      content: message,
    },
    exchangeType: TOPIC,
    connectionUrl: RABBITMQ_URI,
    publishCallback: () => {
      //
    },
  });
};

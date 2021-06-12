import {HttpException, api} from 'nextkit';
import {sendEmail} from '../../util/sendEmail';

export interface HelloResponseType {
  email: string;
}

export default api({
  async POST() {
    if (Math.random() > 0.7) {
      throw new HttpException(400, 'This was intentionally thrown!');
    }

    sendEmail('NewLogin', 'hello@looskie.com', '{ }');

    return {
      email: 'Sent an email to hello@looskie.com!',
    };
  },
});

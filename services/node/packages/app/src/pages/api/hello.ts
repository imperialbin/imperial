import {HttpException, api} from 'nextkit';

export interface HelloResponseType {
  time: number;
}

export default api<HelloResponseType>({
  async GET() {
    if (Math.random() > 0.7) {
      throw new HttpException(400, 'This was intentionally thrown!');
    }

    return {
      time: Date.now(),
    };
  },
});

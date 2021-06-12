import {api} from 'nextkit';

export default api({
  async GET() {
    return {
      message: "Welcome to IMPERIAL's API!",
      apiVersion: 'v1',
      documentation: 'https://docs.imperialb.in/v1',
    };
  },
});

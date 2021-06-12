import { api } from "nextkit";

export default api({
  async GET() {
    return {
      message: "Index of IMPERIAL API.",
      apiVersions: [
        {
          version: "v1",
          url: "/api/v1",
        },
      ],
    };
  },
});

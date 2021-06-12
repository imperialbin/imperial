import { api } from "../../util/api";

export default api(async (req, res) => {
  res.json({
    message: "Index of IMPERIAL API.",
    apiVersions: [
      {
        version: "v1",
        url: "/api/v1",
      },
    ],
  });
});

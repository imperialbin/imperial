import { api } from "../../../util/api";

export default api(async (req, res) => {
  res.json({
    message: "Welcome to IMPERIAL's API!",
    apiVersion: "v1",
    documentation: "https://docs.imperialb.in/v1",
  });
});

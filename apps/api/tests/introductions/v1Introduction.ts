import { server } from "../index.test";

export default async () => {
  const res = await server.inject({
    method: "GET",
    url: "/v1",
  });

  expect(res.json()).toEqual({
    success: true,
    data: {
      message: "Welcome to Imperial API",
      version: "1",
      documentation: "https://docs.imperialb.in/v1",
    },
  });
};

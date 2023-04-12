import { server } from "../index.test";

export default async () => {
  const res = await server.inject({
    method: "GET",
    url: "/",
  });

  expect(res.json()).toEqual({
    success: true,
    data: {
      message: "Welcome to Imperial API",
    },
  });
};

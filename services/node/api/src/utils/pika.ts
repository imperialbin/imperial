import { Pika } from "pika-id";

const pika = new Pika([
  {
    prefix: "user",
    description: "User ID",
  },
  {
    prefix: "imperial",
    description: "Imperial API Token",
    secure: true,
  },
  {
    prefix: "device",
    description: "Device ID",
  },
  {
    prefix: "imperial_auth",
    description: "imperial auth token",
    secure: true,
  },
]);

export { pika };

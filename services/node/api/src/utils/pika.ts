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
  {
    prefix: "role",
    description: "Role ID",
  },
  {
    prefix: "member_plus",
    description: "Member Plus Token",
  },
]);

type PikaIDs = (typeof pika.prefixes)[number]["prefix"];
type Id<T extends PikaIDs> = `${T}_${string}`;

export { pika, type PikaIDs, type Id };

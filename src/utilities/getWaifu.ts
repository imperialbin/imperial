import fetch from "node-fetch";

const waifus = ["waifu", "cuddle", "neko"]

export const getWaifu = async (): Promise<string> => {
  const index = Math.floor(Math.random() * waifus.length);
  const res = await fetch(`https://waifu.pics/api/sfw/${waifus[index]}`);
  const json = await res.json();
  return json.url;
};

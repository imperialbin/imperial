import UAParser from "ua-parser-js";

type DeviceType =
  | "console"
  | "mobile"
  | "tablet"
  | "smarttv"
  | "wearable"
  | "embedded";

export interface UserAgent {
  osName: string | undefined;
  osVersion: string | undefined;
  browserName: string | undefined;
  browserVersion: string | undefined;
  deviceType: DeviceType | undefined;
}

export const parseUserAgent = (userAgent: string): UserAgent => {
  const {
    os: { name: osName, version: osVersion },
    browser: { name: browserName, version: browserVersion },
    device: { type: deviceType },
  } = UAParser(userAgent);

  return {
    osName,
    osVersion,
    browserName,
    browserVersion,
    deviceType: deviceType as DeviceType,
  };
};

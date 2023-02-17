import useSWR from "swr";

import { Device } from "../types";

export const useDevices = (): Device[] | undefined => {
  const { data: response, error } = useSWR(`/devices/@me`);

  return response?.data;
};

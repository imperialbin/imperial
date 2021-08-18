/* This file contains a lot of functions that more than likely do requests */

import { LoginRequest } from "../types";
import { makeRequest } from "./makeRequest";

export const loginRequest = async (data: LoginRequest) => {
  return await makeRequest("/auth/login", "POST", data);
};

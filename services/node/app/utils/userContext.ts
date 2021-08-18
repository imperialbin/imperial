import { createContext } from "react";
import { getSessionCookie } from "./getSessionCookie";

export const UserContext = createContext(getSessionCookie());

import Cookies from "js-cookie";
import { API_URI, API_VERSION } from "./consts";

export const getSessionCookie = () => {
  const cookie = Cookies.get("IMPERIAL-AUTH");

  console.log(cookie);

  if (!cookie) {
    return null;
  }

  fetch(`${API_URI}${API_VERSION}/users/me`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        return null;
      }

      console.log(data);

      return data.data;
    });
};

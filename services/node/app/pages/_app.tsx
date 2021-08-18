import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { getSessionCookie } from "../utils/getSessionCookie";
import { UserContext } from "../utils/userContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [user, setUser] = useState(getSessionCookie());

  useEffect(() => {
    setUser(getSessionCookie());
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

// commit moment
export default MyApp;

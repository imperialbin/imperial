import type { NextPage } from "next";
import { AuthError } from "../components/401";
import { useUser } from "../hooks/useUser";
import { request } from "../utils/requestWrapper";

const Logout: NextPage = () => {
  const { user, isError, isLoading } = useUser();

  if (!user && !isLoading) return <AuthError />;

  request("/auth/logout", "DELETE");

  return (
    <h1>
      Logging out i actually didnt finish this lol but if it doesnt error you
      shouldnt have a valid session anymore
    </h1>
  );
};

export default Logout;

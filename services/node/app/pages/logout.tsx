import { useEffect } from "react";
import type { NextPage } from "next";
import Router from "next/router";
import { AuthError } from "../components/401";
import { useUser } from "../hooks/useUser";
import { request } from "../utils/requestWrapper";

const Logout: NextPage = () => {
  const { user, isError, isLoading } = useUser();

  useEffect(() => {
    if (!user && !isLoading) Router.replace("/login");
  }, [user, isLoading]);

  request("/auth/logout", "DELETE");

  Router.replace("/login");

  return user ? <h1>Destroying session...</h1> : <h1></h1>;
};

export default Logout;

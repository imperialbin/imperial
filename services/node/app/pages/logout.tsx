import { useEffect } from "react";
import type { NextPage } from "next";
import Router from "next/router";
import { useUser } from "../hooks/useUser";
import { request } from "../utils/requestWrapper";

const Logout: NextPage = () => {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!user && !isLoading) Router.replace("/login");

    request("/auth/logout", "DELETE");

    Router.replace("/login");
  }, [user, isLoading]);

  return user ? <h1>Destroying session...</h1> : <h1></h1>;
};

export default Logout;

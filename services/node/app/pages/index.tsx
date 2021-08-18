import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../utils/userContext";

const Home: NextPage = () => {
  const { user, setUser } = useContext(UserContext);

  return <h1>yo dude! {JSON.stringify(user, null, 2)}</h1>;
};

export default Home;

import type { NextPage } from "next";
import Router from "next/router";
import { FormEventHandler, useState } from "react";
import { loginRequest } from "../utils/core";
import { makeRequest } from "../utils/makeRequest";

const Login: NextPage = () => {
  const [username, setUsername] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(username, password);

    const data = await loginRequest({
      username: username!,
      password: password!,
    });

    if (!data.success) {
      setError(data.message);
    }

    Router.push("/");
  };

  return (
    <>
      <form onSubmit={submit}>
        <input
          type="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username or email"
          required
        />
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default Login;

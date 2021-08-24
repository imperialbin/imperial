import type { NextPage } from "next";
import { useState } from "react";
import { request } from "../utils/requestWrapper";

const Login: NextPage = () => {
  const [username, setUsername] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username) {
      setError("You need to have a username");
    }
    if (!password) {
      setError("You need to have a password");
    }

    const { data, error } = await request("/auth/login", "POST", {
      username,
      password,
    });

    if (!data.success && error) {
      return setError(data.message);
    }

    setError(null);
    console.log(data);
  };

  return (
    <>
      {error && <h1>bitch ass has an error {error}</h1>}

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

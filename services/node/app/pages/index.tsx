import type { NextPage } from "next";
import { useUser } from "../hooks/useUser";

const Home: NextPage = () => {
  const { user, isError, isLoading } = useUser();

  return (
    <div>
      {user ? (
        <h1>hey what the fuck is going on {user.username}</h1>
      ) : (
        <h1>login wtf</h1>
      )}
    </div>
  );
};

export default Home;

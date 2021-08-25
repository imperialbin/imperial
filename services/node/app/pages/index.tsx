import { useAtom } from "jotai";
import type { NextPage } from "next";
import { Editor } from "../components/editor";
import { useUser } from "../hooks/useUser";
import { Nav } from "../layout/nav";
import { languageState } from "../state/editor";

const Home: NextPage = () => {
  const { user, isError, isLoading } = useUser();
  const [language, setLanguage] = useAtom(languageState);

  return (
    <div>
      <Nav user={user} />
      <button onClick={() => setLanguage("javascript")}>javashit</button>
      <Editor height={"80vh"} />

      {user ? (
        <h1>hey what the fuck is going on {user.username}</h1>
      ) : (
        <h1>login wtf</h1>
      )}
    </div>
  );
};

export default Home;

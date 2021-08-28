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
      <Nav user={user} creatingDocument />
      <Editor user={user} />
    </div>
  );
};

export default Home;

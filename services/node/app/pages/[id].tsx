import { useAtom } from "jotai";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Editor } from "../components/editor";
import { useDocument, useUser } from "../hooks";
import { Nav } from "../layout/nav";
import { languageState } from "../state/editor";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isError: userError, isLoading: userLoading } = useUser();
  const {
    document,
    isError: documentError,
    isLoading: documentLoading,
  } = useDocument(id as string);
  const [language, setLanguage] = useAtom(languageState);

  return (
    <div>
      <Nav user={user} />
      {document ? (
        <Editor
          language={document.settings.language}
          value={document && document.content}
          height={"80vh"}
        />
      ) : documentLoading ? (
        <h1>loading</h1>
      ) : (
        <h1>We couldnt find that document!</h1>
      )}
    </div>
  );
};

export default Home;

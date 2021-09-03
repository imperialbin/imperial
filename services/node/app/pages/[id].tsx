import { useAtom } from "jotai";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Editor } from "../components/editor";
import { useDocument, useUser } from "../hooks";
import { Nav } from "../layout/nav";
import { languageState } from "../state/editor";

const Home: NextPage = () => {
  const { id, password } = useRouter().query;
  const { user, isError: userError, isLoading: userLoading } = useUser();
  const { document, isError: documentError } = useDocument(
    id as string,
    password as string
  );
  const [language, setLanguage] = useAtom(languageState);

  return (
    <div>
      {document ? (
        <>
          <Nav
            user={user}
            editor={
              user
                ? document.creator === user.username ||
                  document.settings.editors.includes(user.username)
                : false
            }
            encryptedDocument={document.settings.encrypted}
          />
          <Editor
            language={document.settings.language}
            value={document && document.content}
          />
        </>
      ) : (
        documentError && (
          <>
            {documentError.status === 401 ? (
              <h1>You are not authorized to access this resource</h1>
            ) : (
              <h1>{documentError.info}</h1>
            )}
          </>
        )
      )}
    </div>
  );
};

export default Home;

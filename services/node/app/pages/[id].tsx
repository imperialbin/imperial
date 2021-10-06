import { useEffect } from "react";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Editor } from "../components/ui";
import { useDocument, useUser } from "../hooks";
import { Nav } from "../layout/nav";
import { languageState } from "../state/editor";

const Home: NextPage = () => {
  const { id, password, lang } = useRouter().query;
  const { user, isLoading: userLoading } = useUser();
  const { document, isError: documentError } = useDocument(
    id as string,
    password as string,
  );
  const [, setLanguage] = useAtom(languageState);

  useEffect(() => {
    if (document) {
      setLanguage(lang ? (lang as string) : document.settings.language);
    }
  }, [document]);

  return (
    <div>
      {document ? (
        <>
          <Nav
            user={user}
            userLoading={userLoading}
            editor={
              user
                ? document.creator === user.username ||
                  document.settings.editors.includes(user.username)
                : false
            }
            document={document}
          />
          <Editor value={document && document.content} user={user} />
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

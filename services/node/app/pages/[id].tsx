import { useEffect } from "react";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Editor } from "../components/ui";
import { useDocument, useUser } from "../hooks";
import { Nav } from "../layout/Navbar";
import { languageState } from "../state/editor";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

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
        <Container>
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
        </Container>
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

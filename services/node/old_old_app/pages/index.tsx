import { useEffect } from "react";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import { Editor } from "../components/ui";
import { useUser } from "../hooks";
import { Nav } from "../layout/Navbar";
import { editingState, textState } from "../state/editor";
import { DragandDrop } from "../components/ui";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

// workflwo
const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const [, setEditing] = useAtom(editingState);
  const [text, setText] = useAtom(textState);

  useEffect(() => {
    setEditing(true);

    if (user && user.settings.clipboard) {
      navigator.clipboard.readText().then(text => {
        setText(text);
      });
    }
  }, [user]);

  return (
    <Container>
      <DragandDrop />
      <Nav user={user} userLoading={isLoading} creatingDocument />
      <Editor user={user} value={text} />
    </Container>
  );
};

export default Home;

import { useEffect } from "react";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import { Editor, Modal } from "../components";
import { useUser } from "../hooks/useUser";
import { Nav } from "../layout/nav";
import { editingState } from "../state/editor";

const Home: NextPage = () => {
  const { user, isError, isLoading } = useUser();
  const [, setEditing] = useAtom(editingState);

  useEffect(() => setEditing(true), []);

  return (
    <div>
      <Modal title="hey" />
      <Nav user={user} creatingDocument />
      <Editor user={user} />
    </div>
  );
};

export default Home;

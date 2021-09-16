import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import { Editor } from "../components";
import { useUser } from "../hooks";
import { Nav } from "../layout/nav";
import { editingState } from "../state/editor";

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const [clipboardText, setClipboardText] = useState<string | null>(null);
  const [, setEditing] = useAtom(editingState);

  useEffect(() => {
    setEditing(true);

    if (user && user.settings.clipboard) {
      navigator.clipboard.readText().then((text) => {
        setClipboardText(text);
      });
    }
  }, []);

  return (
    <div>
      <Nav user={user} userLoading={isLoading} creatingDocument />

      <Editor user={user} value={clipboardText as string} />
    </div>
  );
};

export default Home;

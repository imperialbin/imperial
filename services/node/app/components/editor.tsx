import Monaco, {
  DiffEditor as MonacoDiff,
  useMonaco,
  loader,
  EditorProps,
  DiffEditorProps,
} from "@monaco-editor/react";
import React from "react";

import { useAtom } from "jotai";
import { languageState } from "../state/editor";

export const Editor = (props: EditorProps): JSX.Element => {
  const [language] = useAtom(languageState);

  return <Monaco {...props} language={language} />;
};

export const DiffEditor = (props: DiffEditorProps): JSX.Element => {
  return <MonacoDiff {...props} />;
};

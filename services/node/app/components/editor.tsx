import Monaco, {
  DiffEditor as MonacoDiff,
  useMonaco,
  loader,
  EditorProps,
  DiffEditorProps,
} from "@monaco-editor/react";
import React from "react";
import { useAtom } from "jotai";
import { editingState, languageState } from "../state/editor";
import { User } from "../types";

export const Editor = (props: EditorProps & { user?: User }): JSX.Element => {
  const [language] = useAtom(languageState);
  const [editing] = useAtom(editingState);

  return (
    <Monaco
      {...props}
      height={"100vh"}
      options={
        props.user
          ? {
              readOnly: !editing,
              fontLignatures: props.user.settings.fontLignatures,
              fontSize: props.user.settings.fontSize,
              renderWhiteSpace: props.user.settings.renderWhitespace,
              wordWrap: props.user.settings.wordWrap,
            }
          : {
              readOnly: !editing,
              fontSize: 14,
            }
      }
      theme={"vs-dark"}
      language={props.language ? props.language : language}
    />
  );
};

export const DiffEditor = (props: DiffEditorProps): JSX.Element => {
  return <MonacoDiff theme={"vs-dark"} {...props} />;
};

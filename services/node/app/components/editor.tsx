import Monaco, {
  DiffEditor as MonacoDiff,
  useMonaco,
  loader,
  EditorProps,
  DiffEditorProps,
} from "@monaco-editor/react";
import React, { createRef, useRef } from "react";

import { useAtom } from "jotai";
import { languageState } from "../state/editor";
import { User } from "../types";

export const Editor = (props: EditorProps & { user?: User }): JSX.Element => {
  const [language] = useAtom(languageState);
  console.log(props.user);
  return (
    <Monaco
      {...props}
      height={"100vh"}
      options={
        props.user
          ? {
              fontLignatures: props.user.settings.fontLignatures,
              fontSize: props.user.settings.fontSize,
              renderWhiteSpace: props.user.settings.renderWhitespace,
              wordWrap: props.user.settings.wordWrap,
            }
          : {
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

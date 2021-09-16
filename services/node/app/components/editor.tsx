import Monaco, {
  DiffEditor as MonacoDiff,
  DiffEditorProps,
  EditorProps,
  Monaco as MonacoType,
} from "imperial-editor";
import { useAtom } from "jotai";
import React from "react";
import { editingState, languageState } from "../state/editor";
import { User } from "../types";
import { EditorSkeleton } from "./skeletons";

export const Editor = (props: EditorProps & { user?: User }): JSX.Element => {
  const [language] = useAtom(languageState);
  const [editing] = useAtom(editingState);

  const mounted = (editor: MonacoType) => {
    window.monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      {
        noSemanticValidation: true,
        noSyntaxValidation: false,
      }
    );

    editor.focus();
    editor.setPosition(editor.getPosition());
  };

  return (
    <Monaco
      {...props}
      height={"97vh"}
      loading={<EditorSkeleton />}
      onMount={mounted}
      options={
        props.user
          ? {
              readOnly: !editing,
              fontLignatures: props.user.settings.fontLignatures,
              fontSize: props.user.settings.fontSize,
              renderWhiteSpace: props.user.settings.renderWhiteSpace,
              wordWrap: props.user.settings.wordWrap,
            }
          : {
              readOnly: !editing,
            }
      }
      theme="IMPERIAL"
      language={props.language ? props.language : language}
    />
  );
};

export const DiffEditor = (props: DiffEditorProps): JSX.Element => {
  return <MonacoDiff theme={"vs-dark"} {...props} />;
};

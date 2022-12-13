import Monaco, {
  DiffEditor as MonacoDiff,
  DiffEditorProps,
  EditorProps,
  Monaco as MonacoType,
} from "imperial-editor";
import { useAtom } from "jotai";
import { editingState, languageState, textState } from "../../state/editor";
import { User } from "../../types";
import { EditorSkeleton } from "./skeletons";

export const Editor = (props: EditorProps & { user?: User }): JSX.Element => {
  const [language] = useAtom(languageState);
  const [editing] = useAtom(editingState);
  const [, setText] = useAtom(textState);

  const mounted = (editor: MonacoType) => {
    window.monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      {
        noSemanticValidation: true,
        noSyntaxValidation: false,
      },
    );

    editor.focus();
    editor.setPosition(editor.getPosition());
  };

  const changed = (value: MonacoType) => setText(value);

  return (
    <Monaco
      {...props}
      height={"100%"}
      loading={<EditorSkeleton />}
      onMount={mounted}
      onChange={changed}
      options={
        props.user
          ? {
              readOnly: !editing,
              fontLigatures: props.user.settings.fontLigatures,
              fontSize: props.user.settings.fontSize,
              renderWhitespace: props.user.settings.renderWhitespace,
              wordWrap: props.user.settings.wordWrap,
              tabSize: props.user.settings.tabSize,
            }
          : {
              readOnly: !editing,
              fontSize: 14,
            }
      }
      theme="IMPERIAL"
      language={props.language ? props.language : language}
    />
  );
};

export const DiffEditor = (props: DiffEditorProps): JSX.Element => (
  <MonacoDiff theme={"vs-dark"} {...props} />
);
import Monaco, { EditorProps } from "imperial-editor";
import { editor } from "monaco-editor";
import { connect, ConnectedProps } from "react-redux";
import { ImperialState } from "../../state/reducers";
import EditorSkeleton from "./EditorSkeleton";

interface IEditorProps extends ReduxProps, EditorProps {
  readonly?: boolean;
  language?: string;
}

const Editor = ({
  user,
  readonly = false,
  language = "plaintext",
  ...props
}: IEditorProps): JSX.Element => {
  const mounted = (editor: editor.IStandaloneCodeEditor) => {
    window.monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      {
        noSemanticValidation: true,
        noSyntaxValidation: false,
      },
    );

    editor.focus();
  };

  return (
    <Monaco
      {...props}
      height={"100%"}
      loading={<EditorSkeleton />}
      onMount={(e) => mounted(e)}
      options={
        user
          ? {
              readOnly: readonly,
              fontLigatures: user.settings.font_ligatures,
              fontSize: user.settings.font_size,
              renderWhitespace: user.settings.render_whitespace
                ? "all"
                : "none",
              wordWrap: user.settings.word_wrap ? "on" : "off",
              tabSize: user.settings.tab_size,
            }
          : {
              readOnly: readonly,
              fontSize: 14,
            }
      }
      theme="IMPERIAL"
      language={language}
    />
  );
};

const mapStateToProps = ({ user }: ImperialState) => {
  return { user };
};

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Editor);

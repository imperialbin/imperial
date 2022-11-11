import Monaco, { EditorProps } from "imperial-editor";
import { editor } from "monaco-editor";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { setLanguage, setReadOnly } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { SupportedLanguages } from "../utils/Consts";
import EditorSkeleton from "./EditorSkeleton";

interface IEditorProps extends ReduxProps, EditorProps {
  readonly?: boolean;
  language?: SupportedLanguages;
}

const Editor = ({
  user,
  language = "plaintext",
  editor,
  dispatch,
  readonly = false,
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

  useEffect(() => {
    dispatch(setReadOnly(readonly));
    dispatch(setLanguage(language));
  }, [readonly, language]);

  return (
    <Monaco
      {...props}
      height={"100%"}
      loading={<EditorSkeleton />}
      onMount={(e) => mounted(e)}
      options={
        user
          ? {
              readOnly: editor.readOnly,
              fontLigatures: user.settings.font_ligatures,
              fontSize: user.settings.font_size,
              renderWhitespace: user.settings.render_whitespace
                ? "all"
                : "none",
              wordWrap: user.settings.word_wrap ? "on" : "off",
              tabSize: user.settings.tab_size,
            }
          : {
              readOnly: editor.readOnly,
              fontSize: 14,
            }
      }
      theme="IMPERIAL"
      language={editor.language}
    />
  );
};

const mapStateToProps = ({ user, editor }: ImperialState) => {
  return { user, editor };
};

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Editor);

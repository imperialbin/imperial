import Monaco, { EditorProps, Monaco as MonacoType } from "imperial-editor";
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
  language = "none",
  ...props
}: IEditorProps): JSX.Element => {
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

  return (
    <Monaco
      {...props}
      height={"100%"}
      loading={<EditorSkeleton />}
      onMount={mounted}
      options={
        user
          ? {
              readOnly: readonly,
              fontLignatures: user.settings.fontLignatures,
              fontSize: user.settings.fontSize,
              renderWhitespace: user.settings.renderWhitespace,
              wordWrap: user.settings.wordWrap,
              tabSize: user.settings.tabSize,
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

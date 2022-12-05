import Monaco, { EditorProps } from "@monaco-editor/react";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { setLanguage, setReadOnly } from "../state/actions";
import { ImperialState } from "../state/reducers";
import { SupportedLanguages } from "../utils/Constants";
import Skeleton from "react-loading-skeleton";
import { styled } from "../stitches";

const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  width: "100vw",
  height: "100vh",
  padding: "0 30px",
  fontSize: 14,
  marginTop: 5,
});

const CodeContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  marginLeft: 25,
});

const EditorSkeleton = (): JSX.Element => (
  <Container>
    <CodeContainer>
      {[...Array(9).fill("undefined")].map((_, i) => (
        <Skeleton
          duration={0.5}
          style={{ display: "inline-block", marginTop: 3 }}
          key={i}
          width={Math.floor(Math.random() * 200) + 100}
          height={16}
        />
      ))}
      <Skeleton
        duration={0.5}
        style={{ marginTop: 48 }}
        width={300}
        height={16}
      />
      {[...Array(18)].map((_, i) => {
        const randomChance = Math.floor(Math.random() * 200);
        return (
          <Skeleton
            duration={0.5}
            style={{
              display: "block",
              margin: `${randomChance > 20 ? "3px" : "16px"} 25px`,
            }}
            key={i}
            width={randomChance + 120}
            height={16}
          />
        );
      })}
      <Skeleton
        duration={0.5}
        style={{ marginTop: 3 }}
        width={30}
        height={16}
      />
      <Skeleton
        duration={0.5}
        style={{ marginTop: 48 }}
        width={280}
        height={16}
      />
    </CodeContainer>
  </Container>
);

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
  useEffect(() => {
    dispatch(setReadOnly(readonly));
    dispatch(setLanguage(language));
  }, [readonly, language]);

  return (
    <Monaco
      {...props}
      height="100%"
      loading={<EditorSkeleton />}
      onMount={(editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });

        editor.focus();
      }}
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
              fontFamily: "var(--font-mono)",
            }
          : {
              readOnly: editor.readOnly,
              fontSize: 14,
              fontFamily: "var(--font-mono)",
            }
      }
      theme="imperial"
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

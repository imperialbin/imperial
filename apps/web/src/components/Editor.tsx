/* eslint-disable react/no-array-index-key */
import Monaco, { EditorProps } from "@monaco-editor/react";
import { config, styled } from "@web/stitches.config";
import { editor } from "monaco-editor";
import Skeleton from "react-loading-skeleton";
import { connect, ConnectedProps } from "react-redux";
import { ImperialState } from "../state/reducers";

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

function EditorSkeleton(): JSX.Element {
  return (
    <Container>
      <CodeContainer>
        {[...Array(9).fill("undefined")].map((_, i) => (
          <Skeleton
            key={i}
            duration={0.5}
            style={{ display: "inline-block", marginTop: i === 0 ? 0 : 3 }}
            width={Math.floor(Math.random() * 400) + 100}
            height={18}
          />
        ))}
        <Skeleton duration={0.5} style={{ marginTop: 48 }} width={250} height={18} />
        {[...Array(18)].map((_, i) => {
          const randomChance = Math.random() * 100;

          return (
            <Skeleton
              key={i}
              duration={0.5}
              wrapper={({ children }) => (
                <div style={{ display: "flex" }}>{children}</div>
              )}
              style={{
                display: "block",
                margin: `${randomChance > 30 ? "3px" : "16px"} 25px`,
              }}
              width={randomChance + 230}
              height={18}
            />
          );
        })}
        <Skeleton duration={0.5} style={{ marginTop: 3 }} width={30} height={18} />
        <Skeleton duration={0.5} style={{ marginTop: 48 }} width={280} height={18} />
      </CodeContainer>
    </Container>
  );
}

interface IEditorProps extends ReduxProps, EditorProps {
  readonly?: boolean;
  isLoading?: boolean;
}

const DEFAULT_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false,
  },
};

function Editor({
  user,
  editor,
  dispatch,
  isLoading = false,
  ...props
}: IEditorProps): JSX.Element {
  return !isLoading ? (
    <Monaco
      {...props}
      height="100%"
      loading={<EditorSkeleton />}
      options={
        user
          ? {
              readOnly: editor.readOnly,
              fontLigatures: user.settings.font_ligatures,
              fontSize: user.settings.font_size,
              renderWhitespace: user.settings.render_whitespace ? "all" : "none",
              wordWrap: user.settings.word_wrap ? "on" : "off",
              tabSize: user.settings.tab_size,
              fontFamily: `${config.theme.fonts.mono}`,
              ...DEFAULT_EDITOR_OPTIONS,
            }
          : {
              readOnly: editor.readOnly,
              fontSize: 14,
              fontFamily: `${config.theme.fonts.mono}`,
              ...DEFAULT_EDITOR_OPTIONS,
            }
      }
      theme="imperial"
      language={editor.language.toLowerCase()}
      onMount={(editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });

        editor.focus();
      }}
    />
  ) : (
    <EditorSkeleton />
  );
}

const mapStateToProps = ({ user, editor }: ImperialState) => ({ user, editor });

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Editor);

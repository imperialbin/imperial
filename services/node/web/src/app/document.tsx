import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { useDocument } from "../hooks/useDocument";
import { store } from "../state";
import { setLanguage, setReadOnly } from "../state/actions";
import { styled } from "../stitches";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Document = () => {
  const { document_id } = useParams<{ document_id: string }>();

  const document = useDocument(document_id);

  useEffect(() => {
    store.dispatch(setReadOnly(true));
    store.dispatch(setLanguage(document?.settings.language ?? "plaintext"));
  }, [document]);

  return (
    <Wrapper>
      <Navbar document={document} />
      <Editor isLoading={!document} value={document?.content} />
    </Wrapper>
  );
};

export default Document;

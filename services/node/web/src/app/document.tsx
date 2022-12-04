import { useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { useDocument } from "../hooks/useDocument";
import { styled } from "../stitches";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Document = () => {
  const { document_id } = useParams<{ document_id: string }>();

  const document = useDocument(document_id);

  return (
    <Wrapper>
      <Navbar />
      <Editor value={document?.content} />
    </Wrapper>
  );
};

export default Document;

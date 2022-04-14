import { useRouter } from "next/router";
import styled from "styled-components";
import Editor from "../components/Editor";
import Nav from "../components/Nav";
import { useDocument } from "../hooks/useDocument";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Document = () => {
  const { id, password, lang, noNav = false } = useRouter().query;
  const { document, isError, isLoading } = useDocument(
    id?.toString() ?? "",
    password?.toString() ?? "",
  );

  return (
    <Wrapper>
      {!noNav ? <Nav /> : null}
      <Editor language={lang?.toString() ?? document.settings.language} />
    </Wrapper>
  );
};

export default Document;

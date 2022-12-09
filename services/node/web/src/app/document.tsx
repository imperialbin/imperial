import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { useDocument } from "../hooks/useDocument";
import { store } from "../state";
import { openModal, setLanguage, setReadOnly } from "../state/actions";
import { styled } from "../stitches";
import { Document as IDocument } from "../types";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Document = () => {
  const [decryptedContent, setDecryptedContent] = useState("");

  const { document_id } = useParams<{ document_id: string }>();
  const location = useLocation();
  const fetchedDocument = useDocument(document_id);

  /* Store this in a memo so we can get either state derived from react router
  or the fetched state */
  const document: IDocument | undefined = useMemo(() => {
    return fetchedDocument ?? location.state ?? undefined;
  }, [location.state, fetchedDocument]);

  useEffect(() => {
    if (!document) return;

    store.dispatch(setReadOnly(true));
    store.dispatch(setLanguage(document?.settings.language ?? "plaintext"));

    if (document.settings.encrypted && decryptedContent === "") {
      store.dispatch(
        openModal("document_password", {
          encryptedContent: document.content,
          setDecryptedContent,
        })
      );
    }
  }, [document]);

  return (
    <Wrapper>
      <Navbar document={document} />
      <Editor
        isLoading={
          document?.settings.encrypted && decryptedContent === ""
            ? true
            : !document
        }
        value={
          document?.settings.encrypted ? decryptedContent : document?.content
        }
      />
    </Wrapper>
  );
};

export default Document;

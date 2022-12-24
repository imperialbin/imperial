import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { useDocument } from "../hooks/useDocument";
import { store } from "../state";
import { openModal, setLanguage, setReadOnly } from "../state/actions";
import { styled } from "../stitches";
import { Document as IDocument } from "../types";
import { CDN_URL } from "../utils/Constants";

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
    <>
      <Helmet>
        <title>
          {document_id + (document?.settings?.encrypted ? " 🔐" : "")}
        </title>
        <meta
          content={
            document?.timestamps.expiration
              ? `Deletes on ${dayjs(document.timestamps.expiration).fromNow()}`
              : "Never expires"
          }
          property="og:site_name"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:image" content={CDN_URL + document_id + ".jpg"} />
        <meta
          property="og:image:url"
          content={CDN_URL + document_id + ".jpg"}
        />
        <meta
          property="twitter:image"
          content={CDN_URL + document_id + ".jpg"}
        />
      </Helmet>
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
    </>
  );
};

export default Document;

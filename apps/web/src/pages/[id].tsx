import Editor from "@web/components/Editor";
import Navbar from "@web/components/Navbar";
import FourOFour from "@web/pages/404";
import { store } from "@web/state";
import { openModal, setLanguage, setReadOnly } from "@web/state/actions";
import { styled } from "@web/stitches.config";
import { Document as DocumentType } from "@web/types";
import { env } from "@web/utils/env";
import { makeRequest } from "@web/utils/rest";
import dayjs from "dayjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";

// Trigger deploy

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

export const config = {
  runtime: "experimental-edge",
};

export const getServerSideProps: GetServerSideProps<{
  document: DocumentType | null;
}> = async (context) => {
  const potentialDocument = JSON.parse(
    context.req.cookies["created-document"] ?? "null",
  ) as DocumentType | null;

  if (!potentialDocument) {
    const { data, error } = await makeRequest<DocumentType>(
      "GET",
      `/document/${context.params?.id}`,
    );

    return {
      props: {
        document: data ?? null,
        error: error ?? null,
      },
    };
  }

  return {
    props: {
      document: potentialDocument,
    },
  };
};

type InferProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function Document({ document }: InferProps) {
  const [decryptedContent, setDecryptedContent] = useState("");

  useEffect(() => {
    if (!document) return;

    store.dispatch(setReadOnly(true));
    store.dispatch(setLanguage(document?.settings.language ?? "plaintext"));

    if (document.settings.encrypted && decryptedContent === "") {
      store.dispatch(
        openModal("document_password", {
          encryptedContent: document.content,
          setDecryptedContent,
        }),
      );
    }
  }, [document]);

  return document ? (
    <>
      <NextSeo
        title={`IMPERIAL – ${document.id} ${document?.settings?.encrypted ? " 🔐" : ""}`}
        openGraph={{
          title: `IMPERIAL – ${document.id} ${
            document?.settings?.encrypted ? " 🔐" : ""
          }`,
          siteName: document.timestamps.expiration
            ? `Deletes on ${dayjs(document.timestamps.expiration).format("DD/MM/YYYY")}`
            : "Never expires",
          description: !document.settings.image_embed ? document.content : undefined,
          images: document.settings.image_embed
            ? [
                {
                  url: env.CDN_URL + document.id + ".jpeg",
                  alt: `IMPERIAL ${document.id}`,
                  type: "image/jpeg",
                },
              ]
            : undefined,
          type: "website",
        }}
      />
      <Wrapper>
        <Navbar document={document} />
        <Editor
          isLoading={
            document.settings.encrypted && decryptedContent === "" ? true : !document
          }
          value={document.settings.encrypted ? decryptedContent : document.content}
        />
      </Wrapper>
    </>
  ) : (
    <FourOFour />
  );
}

export default Document;

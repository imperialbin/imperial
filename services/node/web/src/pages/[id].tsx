import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import { store } from "@/state";
import { openModal, setLanguage, setReadOnly } from "@/state/actions";
import { styled } from "@/stitches.config";
import { Document } from "@/types";
import { CDN_URL } from "@/utils/Constants";
import { makeRequest } from "@/utils/Rest";
import dayjs from "dayjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import FourOFour from "./404";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

export const getServerSideProps: GetServerSideProps<{
  document: Document | null;
}> = async (context) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { success, data, error } = await makeRequest<Document>(
    "GET",
    `/document/${context.params?.id}`
  );

  return {
    props: {
      document: data ?? null,
      error: error ?? null,
    },
  };
};

type InferProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Document = ({ document }: InferProps) => {
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
        })
      );
    }
  }, [document]);

  return document ? (
    <>
      <NextSeo
        title={`IMPERIAL – ${document.id} ${
          document?.settings?.encrypted ? " 🔐" : ""
        }`}
        openGraph={{
          title: `IMPERIAL – ${document.id} ${
            document?.settings?.encrypted ? " 🔐" : ""
          }`,
          siteName: document.timestamps.expiration
            ? `Deletes on ${dayjs(document.timestamps.expiration).format("ll")}`
            : "Never expires",
          images: [
            {
              url: CDN_URL + document.id + ".jpg",
              alt: `IMPERIAL ${document.id}`,
              type: "image/jpeg",
            },
          ],
          type: "website",
        }}
      />
      <Wrapper>
        <Navbar document={document} />
        <Editor
          isLoading={
            document.settings.encrypted && decryptedContent === ""
              ? true
              : !document
          }
          value={
            document.settings.encrypted ? decryptedContent : document.content
          }
        />
      </Wrapper>
    </>
  ) : (
    <FourOFour />
  );
};

export default Document;

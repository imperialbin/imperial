import dayjs from "dayjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import { store } from "@/state";
import { openModal, setLanguage, setReadOnly } from "@/state/actions";
import { styled } from "@/stitches.config";
import { Document } from "@/types";
import { CDN_URL } from "@/utils/Constants";
import { makeRequest } from "@/utils/Rest";

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
    },
  };
};

type InferProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Document = ({ document }: InferProps) => {
  const [decryptedContent, setDecryptedContent] = useState("");
  const router = useRouter();

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
      <Head>
        {!document ? (
          <title>Document not found</title>
        ) : (
          <>
            <title>
              {document?.id + (document?.settings?.encrypted ? " 🔐" : "")}
            </title>
            <meta
              content={
                document?.timestamps.expiration
                  ? `Deletes on ${dayjs(
                      document.timestamps.expiration
                    ).fromNow()}`
                  : "Never expires"
              }
              property="og:site_name"
            />
            <meta property="twitter:card" content="summary_large_image" />
            <meta
              property="og:image"
              content={CDN_URL + document.id + ".png"}
            />
            <meta
              property="og:image:url"
              content={CDN_URL + document.id + ".png"}
            />
            <meta
              property="twitter:image"
              content={CDN_URL + document.id + ".png"}
            />
          </>
        )}
      </Head>
      <Wrapper>
        <Navbar document={document ?? undefined} />
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

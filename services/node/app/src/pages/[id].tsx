import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import Editor from "../components/Editor";
import Nav from "../components/Nav";
import { Document } from "../types";
import { request } from "../utils/Request";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  const { success, data } = await request(
    "GET",
    `/document/${query.id}?${query?.password}`,
  );

  if (!success) {
    return {
      props: {
        document: null,
      },
    };
  }

  return {
    props: {
      document: data as Document,
    },
  };
}

const Document = ({
  document,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [editing, setEditing] = useState(false);
  const { lang, noNav = false } = useRouter().query;

  return (
    <Wrapper>
      {document ? (
        <>
          {!noNav ? <Nav document={document} /> : null}
          <Editor
            language={lang?.toString() ?? document.settings.language}
            value={document.content}
            readonly={!editing}
          />
        </>
      ) : null}
    </Wrapper>
  );
};
export default Document;

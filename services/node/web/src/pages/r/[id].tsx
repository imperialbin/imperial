import { GetServerSideProps } from "next";
import { Document } from "../../types";
import { makeRequest } from "../../utils/Rest";

function Raw() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  if (res) {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

    const { data } = await makeRequest<Document>("GET", `/document/${params?.id}`);

    res.write(data?.content ?? "Document not found");
    res.end();
  }

  return {
    props: {},
  };
};

export default Raw;

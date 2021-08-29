import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useDocument } from "../../hooks";

const Raw: NextPage = () => {
  const { id } = useRouter().query;
  const { document } = useDocument(id as string);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {document && document.content}
    </span>
  );
};

export default Raw;

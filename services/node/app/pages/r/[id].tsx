import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useDocument } from "../../hooks";

const Raw: NextPage = () => {
  const { id, password } = useRouter().query;
  const { document, isError } = useDocument(id as string, password as string);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {isError ? isError.info : document && document.content}
    </span>
  );
};

export default Raw;

import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";

const ResetPassword: NextPage = () => {
  const { token } = useRouter().query;

  return (
    <>
      <span style={{ whiteSpace: "pre-wrap" }}>{token}</span>
    </>
  );
};

export default ResetPassword;

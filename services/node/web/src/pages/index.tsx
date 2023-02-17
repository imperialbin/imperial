import { useRouter } from "next/router";
import { useEffect } from "react";
import Editor from "@/components/Editor";
import { store } from "../state";
import { setReadOnly } from "../state/actions";
import { styled } from "../stitches.config";
import Navbar from "@/components/Navbar";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    store.dispatch(setReadOnly(false));

    /* Reset state if there is any */
    if (router.query) {
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Editor value={(router.query.init_text as string) ?? ""} />
    </Wrapper>
  );
};

export default Index;

import { useEffect } from "react";
import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { store } from "../state";
import { setReadOnly } from "../state/actions";
import { styled } from "../stitches";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Index = () => {
  useEffect(() => {
    store.dispatch(setReadOnly(false));
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Editor />
    </Wrapper>
  );
};

export default Index;

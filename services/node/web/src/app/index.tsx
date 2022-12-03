import Editor from "../components/Editor";
import Navbar from "../components/Navbar";
import { styled } from "../stitches";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

const Index = () => {
  return (
    <Wrapper>
      <Navbar />
      <Editor />
    </Wrapper>
  );
};

export default Index;

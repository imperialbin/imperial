import type { NextPage } from "next";
import styled from "styled-components";
import Editor from "../components/Editor";
import Nav from "../components/Nav";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Home: NextPage = () => {
  return (
    <Wrapper>
      <Nav />
      <Editor />
    </Wrapper>
  );
};

export default Home;

import type { NextPage } from "next";
import styled from "styled-components";
import { store } from "../../state";
import { openModal } from "../../state/actions";
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
      <button onClick={() => store.dispatch(openModal("login"))}>
        yooo open
      </button>
      <Editor />
    </Wrapper>
  );
};

export default Home;

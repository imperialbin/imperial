import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    store.dispatch(setReadOnly(false));

    /* Reset state if there is any */
    if (location.state) window.history.replaceState({}, document.title);
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Editor value={location.state?.init_text ?? ""} />
    </Wrapper>
  );
};

export default Index;

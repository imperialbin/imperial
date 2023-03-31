import Editor from "@web/components/Editor";
import Navbar from "@web/components/Navbar";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { setReadOnly } from "../state/actions";
import { ImperialState } from "../state/reducers";
import { styled } from "../stitches.config";

const Wrapper = styled("div", {
  width: "100vw",
  height: "100vh",
});

function Index({ forked_content, dispatch }: ReduxProps) {
  useEffect(() => {
    dispatch(setReadOnly(false));
  }, []);

  return (
    <Wrapper>
      <Navbar/>
      <Editor value={forked_content ?? ""}/>
    </Wrapper>
  );
}

const mapStateToProps = ({ editor: { forked_content } }: ImperialState) => ({
  forked_content,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Index);

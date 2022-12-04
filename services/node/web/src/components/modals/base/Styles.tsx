import { styled } from "../../../stitches";

export const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: 25,
  margin: 10,
  background: "$secondary",
  borderRadius: 8,
  overflow: "auto",
  maxHeight: "90%",
  minWidth: 200,
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  margin: "10px 0",
});
